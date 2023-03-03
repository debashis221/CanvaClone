const Draggable = ({ children, dragData }) => {
  const handleDragStart = (event) => {
    // Set the drag data
    event.dataTransfer.setData("text/plain", dragData);

    // Add a class to the element being dragged
    event.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (event) => {
    // Remove the dragging class
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
