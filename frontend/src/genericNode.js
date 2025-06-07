import { useState, useMemo, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export const GenericNode = ({
  id,
  data = {},
  label = 'Node',
  fields = [],
  handles = [{ type: 'source', position: Position.Right, id: `${id}-output` }],
  style = {},
}) => {
  const initialState = {};
  fields.forEach(f => {
    initialState[f.name] = data?.[f.name] ?? f.defaultValue ?? '';
  });
  const [nodeState, setNodeState] = useState(initialState);

  const [dimensions, setDimensions] = useState({ width: 220, height: 40 });
  const textareaRef = useRef(null);

  const textField = fields.find(f => f.type === 'text');
  const textValue = textField ? nodeState[textField.name] : '';

  const variableMatches = useMemo(() => {
    if (!textValue) return [];
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const vars = new Set();
    let match;
    while ((match = regex.exec(textValue))) {
      vars.add(match[1]);
    }
    return Array.from(vars);
  }, [textValue]);

  const MAX_WIDTH = 400;
  const MAX_HEIGHT = 300;

  useEffect(() => {
    if (textareaRef.current) {
      const text = textareaRef.current.value || '';

      const font = window.getComputedStyle(textareaRef.current).font;

      // Width: longest line
      const lines = text.split('\n');
      const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), '');

      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.whiteSpace = 'pre';
      span.style.font = font;
      span.textContent = longestLine || ' ';
      document.body.appendChild(span);
      const textWidth = span.offsetWidth;
      document.body.removeChild(span);

      // Height: simulate wrapping by putting text in a hidden div with same width
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordWrap = 'break-word';
      div.style.font = font;
      div.style.width = `${Math.min(Math.max(220, textWidth), MAX_WIDTH)}px`;
      div.style.lineHeight = window.getComputedStyle(textareaRef.current).lineHeight;
      div.textContent = text || ' ';
      document.body.appendChild(div);
      const textHeight = div.offsetHeight;
      document.body.removeChild(div);

      const minWidth = 220;
      const minHeight = 40;
      const padding = 32;

      const newWidth = Math.min(Math.max(minWidth, textWidth), MAX_WIDTH);
      const newHeight = Math.min(Math.max(minHeight, textHeight), MAX_HEIGHT);

      setDimensions({
        width: newWidth + padding,
        height: newHeight + padding,
        textareaWidth: newWidth,
        textareaHeight: newHeight,
      });
    }
  }, [textValue]);

  const handleChange = (name) => (e) => {
    setNodeState((prev) => ({ ...prev, [name]: e.target.value }));
  };

  return (
    <div
      className="rounded-xl border-2 border-blue-400 bg-blue-50 shadow p-4 flex flex-col gap-2 font-sans"
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div className="font-semibold text-blue-700 text-lg mb-1">
        <span>{label}</span>
      </div>
      <div>
        {fields.map((field) => (
          <label
            key={field.name}
            className="flex items-center gap-2 text-base text-gray-800 mb-2 w-full"
            style={{ alignItems: 'flex-start' }}
          >
            {field.label}:
            {field.type === 'select' ? (
              <select
                value={nodeState[field.name]}
                onChange={handleChange(field.name)}
                className="border border-blue-200 rounded-md px-2 py-1 text-base bg-white transition-colors focus:border-blue-400 focus:outline-none w-full"
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'text' ? (
              <textarea
                ref={textareaRef}
                value={nodeState[field.name]}
                onChange={handleChange(field.name)}
                rows={1}
                className="border border-blue-200 rounded-md px-2 py-1 text-base bg-white transition-colors focus:border-blue-400 focus:outline-none resize-none"
                style={{
                  minHeight: '40px',
                  minWidth: '100px',
                  fontFamily: 'inherit',
                  width: dimensions.textareaWidth,
                  height: dimensions.textareaHeight,
                  boxSizing: 'border-box',
                  overflow: 'auto',
                  maxWidth: `${MAX_WIDTH}px`,
                  maxHeight: `${MAX_HEIGHT}px`,
                }}
              />
            ) : (
              <input
                type={field.type}
                value={nodeState[field.name]}
                onChange={handleChange(field.name)}
                className="border border-blue-200 rounded-md px-2 py-1 text-base bg-white transition-colors focus:border-blue-400 focus:outline-none w-full"
              />
            )}
          </label>
        ))}
      </div>

      {/* Handles for variables on the left */}
      {variableMatches.map((varName, idx) => (
        <Handle
          key={`var-${varName}`}
          type="target"
          position={Position.Left}
          id={`var-${varName}`}
          style={{ top: 50 + idx * 24 }}
        />
      ))}

      {/* Existing handles */}
      {handles.map((h, idx) => (
        <Handle key={h.id || idx} type={h.type} position={h.position} id={h.id} />
      ))}
    </div>
  );
};
