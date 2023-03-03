import { useState } from "react";
import "./App.css";
import ImageCanvas from "./Components/ImageCanvas";
import CanvasWithResizableImage from "./Components/NewImage";

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

const App = () => {
  const [dropData, setDropData] = useState("");
  const imagesData = [
    {
      id: 1,
      name: "MountainImage",
      path: "/assets/images/mountains.jpg",
    },
    { id: 2, name: "MountainImage", path: "/assets/images/mountains1.jpg" },
    { id: 3, name: "MountainImage", path: "/assets/images/flowers.jpg" },
    { id: 4, name: "MountainImage", path: "/assets/images/beluga.jpeg" },
  ];
  const handleDrop = (data) => {
    setDropData(data);
  };

  return (
    <div className="App">
      <div className="images__wrapper">
        <h2>Images</h2>
        <div className="images__container">
          {imagesData.map((image, index) => {
            return (
              <Draggable dragData={image.path} key={index}>
                <div className="image" key={image.id}>
                  <img alt={image.name} src={image.path} />
                </div>
              </Draggable>
            );
          })}
        </div>
      </div>

      <DropTarget onDrop={handleDrop}>
        <div className="dropzone__wrapper">
          <div className="dropzone__image__container">
            <ImageCanvas src={dropData} width={300} height={200} />
            {/* <CanvasWithResizableImage /> */}
          </div>
        </div>
      </DropTarget>
    </div>
  );
};

export default App;
