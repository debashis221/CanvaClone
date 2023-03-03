import { useState } from "react";
import "./App.css";
import ImageCanvas from "./Components/ImageCanvas";
import Draggable from "./Components/Draggable";
import DropTarget from "./Components/DropTarget";

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
