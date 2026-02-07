import React, { useEffect, useMemo, useRef, useState } from 'react';
import RichTextContent from './RichTextContent';
import { sanitizeRichText, toDisplayHtml } from '../services/richText';

type RichTextEditorProps = {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  previewLabel?: string;
};

type ToolbarAction = {
  id: string;
  icon: string;
  title: string;
  command?: string;
  commandValue?: string;
  customAction?: () => void;
};

const EMPTY_EDITOR_VALUES = new Set(['', '<br>', '<p><br></p>', '<div><br></div>']);

const normalizeEditorOutput = (value: string) => {
  const sanitized = sanitizeRichText(value);
  return EMPTY_EDITOR_VALUES.has(sanitized.toLowerCase()) ? '' : sanitized;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Digite aqui...',
  previewLabel = 'Pré-visualização',
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [editorHtml, setEditorHtml] = useState('');

  const normalizedValue = useMemo(() => toDisplayHtml(value), [value]);

  useEffect(() => {
    if (isFocused) return;
    setEditorHtml(normalizedValue);
    if (editorRef.current && editorRef.current.innerHTML !== normalizedValue) {
      editorRef.current.innerHTML = normalizedValue;
    }
  }, [isFocused, normalizedValue]);

  const emitChange = (nextHtml: string) => {
    setEditorHtml(nextHtml);
    onChange(nextHtml);
  };

  const refreshFromDom = () => {
    if (!editorRef.current) return;
    const next = normalizeEditorOutput(editorRef.current.innerHTML);
    if (editorRef.current.innerHTML !== next) {
      editorRef.current.innerHTML = next;
    }
    emitChange(next);
  };

  const runCommand = (command: string, commandValue?: string) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    const hasSelectionInEditor =
      !!selection &&
      selection.rangeCount > 0 &&
      editorRef.current.contains(selection.getRangeAt(0).commonAncestorContainer);

    if (!hasSelectionInEditor) {
      editorRef.current.focus();
    }

    if (command === 'bold' || command === 'italic' || command === 'underline') {
      document.execCommand('styleWithCSS', false, 'false');
    }
    document.execCommand(command, false, commandValue);
    refreshFromDom();
  };

  const addLink = () => {
    const input = window.prompt('Digite a URL do link:', 'https://');
    if (!input) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    runCommand('createLink', trimmed);
  };

  const toolbarActions: ToolbarAction[] = [
    { id: 'bold', icon: 'fa-solid fa-bold', title: 'Negrito', command: 'bold' },
    { id: 'italic', icon: 'fa-solid fa-italic', title: 'Itálico', command: 'italic' },
    { id: 'underline', icon: 'fa-solid fa-underline', title: 'Sublinhado', command: 'underline' },
    { id: 'h3', icon: 'fa-solid fa-heading', title: 'Subtítulo', command: 'formatBlock', commandValue: '<h3>' },
    { id: 'h4', icon: 'fa-solid fa-text-height', title: 'Título menor', command: 'formatBlock', commandValue: '<h4>' },
    { id: 'ul', icon: 'fa-solid fa-list-ul', title: 'Lista com marcadores', command: 'insertUnorderedList' },
    { id: 'ol', icon: 'fa-solid fa-list-ol', title: 'Lista numerada', command: 'insertOrderedList' },
    { id: 'quote', icon: 'fa-solid fa-quote-left', title: 'Citação', command: 'formatBlock', commandValue: '<blockquote>' },
    { id: 'link', icon: 'fa-solid fa-link', title: 'Inserir link', customAction: addLink },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
          <div className="flex flex-wrap gap-2 border-b border-slate-800 px-3 py-3 bg-slate-950/70">
            {toolbarActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (action.customAction) {
                    action.customAction();
                    return;
                  }
                  if (action.command) {
                    runCommand(action.command, action.commandValue);
                  }
                }}
                className="h-8 min-w-8 px-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500 hover:bg-slate-900 transition-colors"
                title={action.title}
                aria-label={action.title}
              >
                <i className={action.icon}></i>
              </button>
            ))}
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            className="rich-editor-input min-h-[160px] max-h-[420px] overflow-y-auto px-4 py-3 text-slate-200 focus:outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              refreshFromDom();
            }}
            onInput={refreshFromDom}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{previewLabel}</label>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 min-h-[100px]">
          {editorHtml ? (
            <RichTextContent html={editorHtml} className="text-slate-300 text-sm md:text-base leading-relaxed" />
          ) : (
            <p className="text-sm text-slate-600">Sem conteúdo formatado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
