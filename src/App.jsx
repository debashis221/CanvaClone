import { Suspense, lazy, useState } from "react";
import "./App.css";
const Draggable = lazy(() => import("./Components/Draggable"));
const DropTarget = lazy(() => import("./Components/DropTarget"));
const ImageCanvas = lazy(() => import("./Components/ImageCanvas"));

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
          <Suspense fallback={<>Loading...</>}>
            {imagesData.map((image, index) => {
              return (
                <Draggable dragData={image.path} key={index}>
                  <div className="image" key={image.id}>
                    <img alt={image.name} src={image.path} />
                  </div>
                </Draggable>
              );
            })}
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<>Loading...</>}>
        <DropTarget onDrop={handleDrop}>
          <div className="dropzone__wrapper">
            <div className="dropzone__image__container">
              <ImageCanvas src={dropData} width={300} height={200} />
            </div>
          </div>
        </DropTarget>
      </Suspense>
    </div>
  );
};

export default App;
