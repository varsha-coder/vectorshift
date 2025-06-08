export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`
        draggable-node
        cursor-grab min-w-[80px] h-[80px] flex flex-col items-center justify-center
        rounded-2xl bg-white border-2 border-gray-200 shadow
        transition-all duration-200
        hover:bg-blue-50 hover:border-blue-500
      `}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
      title={label}
    >
      <span
        className={`
          draggable-node-icon
          text-[25px] mb-2 transition-colors duration-200
          text-gray-800
          group-hover:text-blue-600
        `}
      >
        {icon}
      </span>
      <span
        className={`
          draggable-node-label
          text-[18px] font-medium transition-colors duration-200
          text-gray-800
          group-hover:text-blue-600
        `}
      >
        {label}
      </span>
    </div>
  );
};