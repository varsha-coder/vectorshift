import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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

  const [dimensions, setDimensions] = useState({ width: 220, height: 40, textareaHeight: 40 });
  const textareaRef = useRef(null);
  const resizing = useRef(false);

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
  const MIN_WIDTH = 220;
  const MIN_HEIGHT = 40;

  // Auto-grow textarea based on scrollHeight
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, MAX_HEIGHT);
      textareaRef.current.style.height = `${newHeight}px`;

      setDimensions(prev => ({
        ...prev,
        height: newHeight + 32, // add padding for the node box
        textareaHeight: newHeight,
      }));
    }
  }, [textValue]);

  const handleChange = (name) => (e) => {
    setNodeState((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const isMaxed = dimensions.width >= MAX_WIDTH || dimensions.textareaHeight >= MAX_HEIGHT;

  const startResize = useCallback((e) => {
    e.preventDefault();
    resizing.current = true;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.textareaHeight;

    const onMouseMove = (moveEvent) => {
      if (!resizing.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newWidth = Math.min(Math.max(MIN_WIDTH, startWidth + deltaX), MAX_WIDTH);
      const newHeight = Math.min(Math.max(MIN_HEIGHT, startHeight + deltaY), MAX_HEIGHT);

      setDimensions({
        width: newWidth,
        textareaHeight: newHeight,
        height: newHeight + 32,
      });
    };

    const onMouseUp = () => {
      resizing.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [dimensions]);

  return (
    <div
      className="rounded-xl border-2 border-blue-400 bg-blue-50 shadow p-4 flex flex-col gap-2 font-sans relative"
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div className="flex items-center font-semibold text-blue-700 text-lg mb-1">
        <span>{label}</span>
      </div>
      <div>
        {fields.map((field) => (
          <label
            key={field.name}
            className="flex flex-col text-base text-gray-800 mb-2 w-full"
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
              <div style={{ position: 'relative', width: '100%' }}>
                <textarea
                  ref={textareaRef}
                  value={nodeState[field.name]}
                  onChange={handleChange(field.name)}
                  rows={1}
                  className="border border-blue-200 rounded-md px-2 py-1 text-base bg-white transition-colors focus:border-blue-400 focus:outline-none resize-none w-full"
                  style={{
                    fontFamily: 'inherit',
                    height: dimensions.textareaHeight,
                    boxSizing: 'border-box',
                    overflow: 'hidden', // no scrollbars unless max height hit
                    maxHeight: `${MAX_HEIGHT}px`,
                    transition: 'height 0.2s ease', // nice animation!
                  }}
                />
                {isMaxed && (
                  <div
                    onMouseDown={startResize}
                    style={{
                      position: 'absolute',
                      width: '12px',
                      height: '12px',
                      bottom: '4px',
                      right: '4px',
                      cursor: 'se-resize',
                      backgroundColor: 'rgba(59,130,246,0.5)',
                      borderRadius: '2px',
                    }}
                    title="Drag to resize"
                  />
                )}
              </div>
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
