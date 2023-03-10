import React, { useEffect, useRef, useState } from "react";

const ImageCanvas = (props) => {
  const canvasRef = useRef(null);
  const { src, width, height } = props;
  const [canvasContext, setCanvasContext] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [canvas, setCanvas] = useState(null);
  const [offsetX, setOffsetX] = useState(null);
  const [offsetY, setOffsetY] = useState(null);
  const img = new Image();
  const pi2 = 3.14 * 2;
  const resizerRadius = 8;
  const rr = resizerRadius * resizerRadius;
  let draggingResizer = -1;
  let imageLeft;
  let imageTop;
  let startX;
  let startY;
  let imageWidth = width;
  let imageHeight = height;
  let imageRight, imageBottom;
  let mouseX, mouseY;

  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvas(canvas);
    setCanvasContext(canvas.getContext("2d"));
    const rect = canvas.getBoundingClientRect();
    setOffsetX(rect.left);
    setOffsetY(rect.top);
    img.src = src;
    img.onload = () => {
      const canvasCenterX = canvas.width / 2;
      const canvasCenterY = canvas.height / 2;
      //* Calculate the aspect ratio of the image
      setAspectRatio(img.width / img.height);

      //* Calculate the maximum width and height that the image can be
      const maxWidth = canvas.width * 0.8;
      const maxHeight = canvas.height * 0.8;

      //* Calculate the width and height of the image based on the maximum values and the aspect ratio
      let imgWidth = maxWidth;
      let imgHeight = maxHeight;
      if (imgWidth / aspectRatio > maxHeight) {
        imgWidth = maxHeight * aspectRatio;
      } else {
        imgHeight = maxWidth / aspectRatio;
      }

      //* Set the image's position to be centered on the canvas
      const imgX = canvasCenterX - imgWidth / 2;
      const imgY = canvasCenterY - imgHeight / 2;
      imageLeft = imgX;
      imageTop = imgY;
      imageWidth = imgWidth;
      imageHeight = imgHeight;
      imageRight = imageLeft + imageWidth;
      imageBottom = imageTop + imageHeight;
      draw(true);
    };
    console.log(imageRight, imageBottom);
  }, [src, width, height, aspectRatio]);

  const draw = (withAnchors) => {
    //* clear the canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    //* draw the image
    canvasContext.drawImage(
      img,
      imageLeft,
      imageTop,
      imageRight - imageLeft,
      imageBottom - imageTop
    );

    //* optionally draw the draggable anchors
    if (withAnchors) {
      drawDragAnchor(imageLeft, imageTop);
      drawDragAnchor(imageRight, imageTop);
      drawDragAnchor(imageRight, imageBottom);
      drawDragAnchor(imageLeft, imageBottom);
    }
  };

  const drawDragAnchor = (x, y) => {
    canvasContext.beginPath();
    canvasContext.arc(x, y, resizerRadius, 0, pi2, false);
    canvasContext.closePath();
    canvasContext.fill();
  };

  const anchorHitTest = (x, y) => {
    let dx, dy;
    //* top-left
    dx = x - imageLeft;
    dy = y - imageTop;
    // console.log({ dx, dy });
    if (dx * dx + dy * dy <= rr) {
      return 0;
    }
    //* top-right
    dx = x - imageRight;
    dy = y - imageTop;
    if (dx * dx + dy * dy <= rr) {
      return 1;
    }
    //* bottom-right
    dx = x - imageRight;
    dy = y - imageBottom;
    if (dx * dx + dy * dy <= rr) {
      return 2;
    }
    //* bottom-left
    dx = x - imageLeft;
    dy = y - imageBottom;
    if (dx * dx + dy * dy <= rr) {
      return 3;
    }
    return -1;
  };

  const handleMouseDown = (e) => {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    draggingResizer = anchorHitTest(startX, startY);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    draggingResizer = -1;
    draw(true);
  };

  const handleMouseOut = (e) => {
    handleMouseUp(e);
  };

  const handleMouseMove = (e) => {
    if (draggingResizer > -1) {
      mouseX = parseInt(e.clientX - offsetX);
      mouseY = parseInt(e.clientY - offsetY);
      switch (draggingResizer) {
        case 0:
          //*top-left
          imageLeft = mouseX;
          imageTop =
            imageBottom - (imageHeight * (imageRight - imageLeft)) / imageWidth;
          break;
        case 1:
          //*top-right
          imageRight = mouseX;
          imageTop =
            imageBottom - (imageHeight * (imageRight - imageLeft)) / imageWidth;
          break;
        case 2:
          //*bottom-right
          imageBottom = mouseY;
          imageRight =
            imageLeft + (imageWidth * (imageBottom - imageTop)) / imageHeight;
          break;
        case 3:
          //*bottom-left
          imageLeft = mouseX;
          imageBottom =
            imageTop + (imageHeight * (imageRight - imageLeft)) / imageWidth;
          break;
      }
      draw(true);
    }
  };
  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth / 2}
      height={window.innerHeight / 2}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseOut={handleMouseOut}
    ></canvas>
  );
};

export default ImageCanvas;
