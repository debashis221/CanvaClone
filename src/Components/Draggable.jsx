const Draggable = ({ children, dragData }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", dragData);
    event.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (event) => {
    event.currentTarget.classList.remove("dragging");
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </div>
  );
};

export default Draggable;
