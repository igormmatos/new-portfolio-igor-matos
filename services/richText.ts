const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'b',
  'i',
  'strong',
  'em',
  'u',
  's',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'div',
  'span',
]);

const BLOCKED_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'meta', 'link']);

const isSafeHref = (href: string) => {
  const value = href.trim().toLowerCase();
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('#') ||
    value.startsWith('/')
  );
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const normalizeEmptyRichText = (html: string) => {
  const plain = html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
  return plain.length === 0 ? '' : html;
};

const sanitizeWithDomParser = (input: string) => {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const root = documentNode.body.firstElementChild as HTMLElement | null;
  if (!root) return '';

  const normalizeInlineTag = (element: HTMLElement, targetTag: 'strong' | 'em' | 'u') => {
    const replacement = documentNode.createElement(targetTag);
    while (element.firstChild) {
      replacement.appendChild(element.firstChild);
    }
    element.parentNode?.replaceChild(replacement, element);
    return replacement;
  };

  const sanitizeNode = (node: Node) => {
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        return;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const element = child as HTMLElement;
      let tag = element.tagName.toLowerCase();

      if (tag === 'b') {
        const replacement = normalizeInlineTag(element, 'strong');
        sanitizeNode(replacement);
        return;
      }

      if (tag === 'i') {
        const replacement = normalizeInlineTag(element, 'em');
        sanitizeNode(replacement);
        return;
      }

      if (tag === 'span') {
        const style = (element.getAttribute('style') || '').toLowerCase();
        if (style) {
          let replacement: HTMLElement | null = null;
          if (/font-weight\s*:\s*(bold|[7-9]00)/i.test(style)) {
            replacement = normalizeInlineTag(element, 'strong');
          } else if (/font-style\s*:\s*italic/i.test(style)) {
            replacement = normalizeInlineTag(element, 'em');
          } else if (/text-decoration[^;]*:\s*[^;]*underline/i.test(style)) {
            replacement = normalizeInlineTag(element, 'u');
          }

          if (replacement) {
            sanitizeNode(replacement);
            return;
          }
        }
      }

      if (BLOCKED_TAGS.has(tag)) {
        element.remove();
        return;
      }

      if (!ALLOWED_TAGS.has(tag)) {
        while (element.firstChild) {
          element.parentNode?.insertBefore(element.firstChild, element);
        }
        element.remove();
        return;
      }

      Array.from(element.attributes).forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        if (attrName.startsWith('on')) {
          element.removeAttribute(attr.name);
          return;
        }

        if (tag !== 'a') {
          element.removeAttribute(attr.name);
          return;
        }

        if (!['href', 'target', 'rel'].includes(attrName)) {
          element.removeAttribute(attr.name);
        }
      });

      if (tag === 'a') {
        const href = element.getAttribute('href') || '';
        const safeHref = isSafeHref(href) ? href.trim() : '#';
        element.setAttribute('href', safeHref || '#');
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'noopener noreferrer nofollow');
      }

      sanitizeNode(element);
    });
  };

  sanitizeNode(root);
  return normalizeEmptyRichText(root.innerHTML.trim());
};

const sanitizeWithRegexFallback = (input: string) => {
  let output = input;

  output = output.replace(/<\s*(script|style|iframe|object|embed|meta|link)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  output = output.replace(/<\s*(script|style|iframe|object|embed|meta|link)[^>]*\/?\s*>/gi, '');
  output = output.replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, '');
  output = output.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '');
  output = output.replace(/<\s*b\b[^>]*>/gi, '<strong>');
  output = output.replace(/<\s*\/\s*b\s*>/gi, '</strong>');
  output = output.replace(/<\s*i\b[^>]*>/gi, '<em>');
  output = output.replace(/<\s*\/\s*i\s*>/gi, '</em>');

  output = output.replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const isClosing = full.startsWith('</');

    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    if (isClosing) {
      return `</${tag}>`;
    }

    if (tag !== 'a') {
      return tag === 'br' ? '<br>' : `<${tag}>`;
    }

    const hrefMatch = rawAttrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const hrefRaw = hrefMatch ? hrefMatch[2] || hrefMatch[3] || hrefMatch[4] || '' : '';
    const safeHref = isSafeHref(hrefRaw) ? hrefRaw : '#';
    return `<a href="${escapeAttribute(safeHref)}" target="_blank" rel="noopener noreferrer nofollow">`;
  });

  return normalizeEmptyRichText(output.trim());
};

const hasHtmlTag = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const legacyTextToHtml = (value: string) => {
  const blocks = value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (blocks.length === 0) return '';

  return blocks
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
    .join('');
};

export const sanitizeRichText = (value?: string | null) => {
  if (!value) return '';
  const input = value.trim();
  if (!input) return '';

  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    return sanitizeWithDomParser(input);
  }

  return sanitizeWithRegexFallback(input);
};

export const toDisplayHtml = (value?: string | null) => {
  if (!value) return '';
  const input = value.trim();
  if (!input) return '';
  const html = hasHtmlTag(input) ? input : legacyTextToHtml(input);
  return sanitizeRichText(html);
};

export const richTextToPlainText = (value?: string | null) => {
  if (!value) return '';
  return toDisplayHtml(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const parseSkillsListInput = (value: string) =>
  value
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
