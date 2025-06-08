import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Handle } from 'reactflow';
import { CiMinimize1 } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';

export const GenericNode = ({
  id,
  label = '',
  icon,
  description = '',
  fields = [],
  handles = [],
  onDelete,
  style = {},
  showFormatOutput = false,
  formatOutput = false,
  onFormatChange,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [fieldState, setFieldState] = useState(
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue ?? '']))
  );
  const [localFormat, setLocalFormat] = useState(formatOutput);

  // Dimensions state
  const [dimensions, setDimensions] = useState({
    width: 300,
    height: 60,
    textareaHeight: 40,
  });

  // For auto-resizing textarea
  const textareaRef = useRef(null);
  const resizing = useRef(false);

  const outputValue = fieldState.output ?? '';

  // Variable matches
  const variableMatches = useMemo(() => {
    if (!outputValue) return [];
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const vars = new Set();
    let match;
    while ((match = regex.exec(outputValue))) {
      vars.add(match[1]);
    }
    return Array.from(vars);
  }, [outputValue]);

  // Constants
  const MAX_WIDTH = 600;
  const MAX_HEIGHT = 250;
  const MIN_WIDTH = 220;
  const MIN_HEIGHT = 40;

  // Auto-grow textarea effect
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, MAX_HEIGHT);
      textareaRef.current.style.height = `${newHeight}px`;
      setDimensions(prev => ({
        ...prev,
        height: newHeight + 80, // adding padding for node box
        textareaHeight: newHeight,
      }));
    }
  }, [outputValue]);

  // Resize start
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
        height: newHeight + 80, // match with auto-grow height padding
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

  const handleFieldChange = (name, value) => {
    setFieldState(prev => ({ ...prev, [name]: value }));
    // Optionally: call a callback here if you want to lift state up
  };

  const handleFormatChange = () => {
    setLocalFormat((prev) => {
      onFormatChange?.(!prev);
      return !prev;
    });
  };

  const isMaxed = dimensions.width >= MAX_WIDTH || dimensions.textareaHeight >= MAX_HEIGHT;

  return (
    <div
      className="bg-blue-50 border-2 border-blue-500 rounded-lg shadow-md p-4 relative font-sans"
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Minimize/Expand button */}
      <button
        className="absolute top-2 right-10 z-10 bg-white rounded-full p-1 shadow hover:bg-blue-100"
        onClick={() => setMinimized(m => !m)}
        title={minimized ? "Expand node" : "Minimize node"}
        type="button"
      >
        <CiMinimize1 className="w-5 h-5 text-blue-500" />
      </button>
      {/* Delete button */}
      <button
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-blue-100"
        onClick={onDelete}
        title="Delete node"
        type="button"
      >
        <MdDelete className="w-5 h-5 text-blue-500" />
      </button>
      {/* Title bar */}
      <div className="flex items-center mb-2">
        {icon}
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      {description && !minimized && (
        <p className="text-xs text-gray-400 mb-3">{description}</p>
      )}
      {/* Fields */}
      {!minimized && fields.length > 0 && (
        <div className="mt-2">
          {fields.map(field => (
            <label key={field.name} className="flex flex-col text-base text-gray-800 mb-2 w-full">
              {field.name === 'output' ? (
                <>
                  <span className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                    Output<span className="text-red-500 ml-1">*</span>
                  </span>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <textarea
                      ref={textareaRef}
                      value={fieldState[field.name]}
                      onChange={e => handleFieldChange(field.name, e.target.value)}
                      rows={1}
                      className="border border-blue-200 rounded-md px-2 py-1 text-base bg-white transition-colors focus:border-blue-400 focus:outline-none resize-none w-full font-mono"
                      style={{
                        fontFamily: 'inherit',
                        height: dimensions.textareaHeight,
                        boxSizing: 'border-box',
                        overflow: dimensions.textareaHeight >= MAX_HEIGHT ? 'auto' : 'hidden',
                        maxHeight: `${MAX_HEIGHT}px`,
                        transition: 'height 0.2s ease',
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
                </>
              ) : field.name.toLowerCase().includes('name') ? (
                <input
                  type="text"
                  value={fieldState[field.name]}
                  onChange={e => handleFieldChange(field.name, e.target.value)}
                  className="w-full rounded px-2 py-1 text-base text-blue-900 bg-blue-100 font-mono text-center mb-2 border-none focus:ring-2 focus:ring-blue-300"
                  style={{ fontWeight: 600, letterSpacing: 1 }}
                />
              ) : field.type === 'select' ? (
                <select
                  value={fieldState[field.name]}
                  onChange={e => handleFieldChange(field.name, e.target.value)}
                  className="border border-blue-200 rounded-md px-2 py-1 text-base bg-white transition-colors focus:border-blue-400 focus:outline-none w-full"
                >
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={fieldState[field.name]}
                  onChange={e => handleFieldChange(field.name, e.target.value)}
                  className="border border-blue-200 rounded-md px-2 py-1 text-base bg-white transition-colors focus:border-blue-400 focus:outline-none w-full"
                />
              )}
            </label>
          ))}
        </div>
      )}
      {/* Format Output Toggle */}
      {!minimized && showFormatOutput && (
        <div className="flex items-center mt-3 mb-2">
          <label className="text-xs text-gray-500 mr-2">Format output</label>
          <button
            type="button"
            className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors focus:outline-none ${localFormat ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={handleFormatChange}
          >
            <span
              className={`inline-block h-4 w-4 transform bg-white rounded-full shadow transition-transform ${localFormat ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>
          <span className="ml-2 text-xs text-gray-500">{localFormat ? "Yes" : "No"}</span>
        </div>
      )}
      {/* Handles for variables on the left */}
      {variableMatches.map((varName, idx) => (
        <Handle
          key={`var-${varName}`}
          type="target"
          position="left"
          id={`var-${varName}`}
          style={{ top: 50 + idx * 24 }}
        />
      ))}
      {/* Existing handles */}
      {handles.map((h, idx) => (
        <Handle key={h.id || idx} type={h.type} position={h.position} id={h.id} style={h.style} />
      ))}
    </div>
  );
};
