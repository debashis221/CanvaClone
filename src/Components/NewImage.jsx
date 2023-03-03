import React, { useRef, useEffect, useState } from "react";

function CanvasWithResizableImage() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const ctx = canvas.getContext("2d");

    // Set the initial width and height of the image to fit within the canvas
    let imgWidth = canvas.width * 0.8;
    let imgHeight = canvas.height * 0.8;

    // Calculate the aspect ratio of the image
    const aspectRatio = img.width / img.height;

    // Set the initial position of the image to be centered on the canvas
    let imgX = (canvas.width - imgWidth) / 2;
    let imgY = (canvas.height - imgHeight) / 2;

    // Draw the image onto the canvas
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    // Add an event listener for mouse down events on the canvas
    canvas.addEventListener("mousedown", handleMouseDown);

    // Add an event listener for mouse move events on the document
    document.addEventListener("mousemove", handleMouseMove);

    // Add an event listener for mouse up events on the document
    document.addEventListener("mouseup", handleMouseUp);

    // Remove the event listeners when the component unmounts
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handleMouseDown(event) {
    // Check if the mouse is within the anchor point
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;
    const anchorRadius = 10;
    if (
      mouseX >= anchor.x - anchorRadius &&
      mouseX <= anchor.x + anchorRadius &&
      mouseY >= anchor.y - anchorRadius &&
      mouseY <= anchor.y + anchorRadius
    ) {
      setIsDragging(true);
    }
  }

  function handleMouseMove(event) {
    if (isDragging) {
      // Calculate the new width and height of the image based on the distance the mouse has moved
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const aspectRatio = img.width / img.height;
      const maxImgWidth = canvasWidth * 0.8;
      const maxImgHeight = canvasHeight * 0.8;
      const deltaX = event.clientX - canvas.offsetLeft - anchor.x;
      const deltaY = event.clientY - canvas.offsetTop - anchor.y;
      let newImgWidth = imgWidth + deltaX;
      let newImgHeight = imgHeight + deltaY;

      // Check if the new width and height exceed the maximum values
      if (newImgWidth > maxImgWidth) {
        newImgWidth = maxImgWidth;
        newImgHeight = newImgWidth / aspectRatio;
      }
      if (newImgHeight > maxImgHeight) {
        newImgHeight = maxImgHeight;
        newImgWidth = newImgHeight * aspectRatio;
      }

      // Calculate the new position of the image based on the new width and height
      imgX = canvasWidth / 2 - newImgWidth / 2;
      imgY = canvasHeight / 2 - newImgHeight / 2;

      // Draw the image onto the canvas
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(imgRef.current, imgX, imgY, newImgWidth, newImgHeight);

      // Update the image width, height, and position
      imgWidth = newImgWidth;
      imgHeight = newImgHeight;
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    // Set the initial width and height of the image to fit within the canvas
    const canvas = canvasRef.current;
    const img = imgRef.current;
    imgWidth = canvas.width * 0.8;
    imgHeight = (imgWidth / img.width) * img.height;

    // Calculate the initial position of the image to be centered on the canvas
    imgX = (canvas.width - imgWidth) / 2;
    imgY = (canvas.height - imgHeight) / 2;

    // Draw the image onto the canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }}
      />
      <img
        ref={imgRef}
        src="https://source.unsplash.com/random/800x600"
        onLoad={handleImageLoad}
        style={{ display: "none" }}
      />
      <div
        style={{
          position: "absolute",
          left: anchor.x - 10,
          top: anchor.y - 10,
          width: 20,
          height: 20,
          border: "2px solid red",
          borderRadius: "50%",
          cursor: "move",
        }}
        onMouseDown={(event) => {
          setAnchor({
            x: event.clientX - event.target.offsetLeft,
            y: event.clientY - event.target.offsetTop,
          });
        }}
      />
    </>
  );
}

export default CanvasWithResizableImage;
