const DropTarget = ({ children, onDrop }) => {
  const handleDragOver = (event) => {
    // Prevent default to allow drop
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const dragData = event.dataTransfer.getData("text/plain");
    onDrop(dragData);
  };

  return (
    <div
      className="drop-target"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default DropTarget;
