import React from 'react';
import { toDisplayHtml } from '../services/richText';

type RichTextContentProps = {
  html?: string | null;
  className?: string;
  id?: string;
  elementRef?: React.Ref<HTMLDivElement>;
};

const RichTextContent: React.FC<RichTextContentProps> = ({ html, className = '', id, elementRef }) => {
  const safeHtml = toDisplayHtml(html);
  if (!safeHtml) return null;

  const classes = ['rich-content', className].filter(Boolean).join(' ');

  return (
    <div
      id={id}
      ref={elementRef}
      className={classes}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default RichTextContent;

