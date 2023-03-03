const DropTarget = ({ children, onDrop }) => {
  const handleDragOver = (event) => {
    // Prevent default to allow drop
    event.preventDefault();
  };

  const handleDrop = (event) => {
    // Prevent default to avoid redirect
    event.preventDefault();

    // Get the drag data
    const dragData = event.dataTransfer.getData("text/plain");

    // Call the onDrop function passed as a prop
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
