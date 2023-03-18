import React, { useEffect, useRef, useState } from "react";

const ImageCanvas = (props) => {
  const canvasRef = useRef(null);
  const { src, width, height } = props;
  const [canvasContext, setCanvasContext] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [canvas, setCanvas] = useState(null);
  const [offsetX, setOffsetX] = useState(null);
  const [offsetY, setOffsetY] = useState(null);
  const [imageWidth, setImageWidth] = useState(width);
  const [imageHeight, setImageHeight] = useState(height);
  const imageLeft = useRef(null);
  const imageTop = useRef(null);
  const imageRight = useRef(null);
  const imageBottom = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);
  const mouseX = useRef(null);
  const mouseY = useRef(null);
  const img = new Image();
  const pi2 = 3.14 * 2;
  const resizerRadius = 8;
  const rr = resizerRadius * resizerRadius;
  let draggingResizer = -1;

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
      setAspectRatio(img.width / img.height);
      const maxWidth = canvas.width * 0.8;
      const maxHeight = canvas.height * 0.8;
      let imgWidth = maxWidth;
      let imgHeight = maxHeight;
      if (imgWidth / aspectRatio > maxHeight) {
        imgWidth = maxHeight * aspectRatio;
      } else {
        imgHeight = maxWidth / aspectRatio;
      }
      const imgX = canvasCenterX - imgWidth / 2;
      const imgY = canvasCenterY - imgHeight / 2;
      imageLeft.current = imgX;
      imageTop.current = imgY;
      setImageWidth(imgWidth);
      setImageHeight(imgHeight);
      imageRight.current = imageLeft.current + imageWidth;
      imageBottom.current = imageTop.current + imageHeight;
      draw(true);
    };
  }, [src, width, height, aspectRatio, imageWidth, imageHeight]);

  const draw = (withAnchors) => {
    //* clear the canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    //* draw the image
    canvasContext.drawImage(
      img,
      imageLeft.current,
      imageTop.current,
      imageRight.current - imageLeft.current,
      imageBottom.current - imageTop.current
    );

    //* optionally draw the draggable anchors
    if (withAnchors) {
      drawDragAnchor(imageLeft.current, imageTop.current);
      drawDragAnchor(imageRight.current, imageTop.current);
      drawDragAnchor(imageRight.current, imageBottom.current);
      drawDragAnchor(imageLeft.current, imageBottom.current);
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
    dx = x - imageLeft.current;
    dy = y - imageTop.current;
    if (dx * dx + dy * dy <= rr) {
      return 0;
    }
    //* top-right
    dx = x - imageRight.current;
    dy = y - imageTop.current;
    if (dx * dx + dy * dy <= rr) {
      return 1;
    }
    //* bottom-right
    dx = x - imageRight.current;
    dy = y - imageBottom.current;
    if (dx * dx + dy * dy <= rr) {
      return 2;
    }
    //* bottom-left
    dx = x - imageLeft.current;
    dy = y - imageBottom.current;
    if (dx * dx + dy * dy <= rr) {
      return 3;
    }
    return -1;
  };

  const handleMouseDown = (e) => {
    startX.current = parseInt(e.clientX - offsetX);
    startY.current = parseInt(e.clientY - offsetY);
    draggingResizer = anchorHitTest(startX.current, startY.current);
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
      mouseX.current = parseInt(e.clientX - offsetX);
      mouseY.current = parseInt(e.clientY - offsetY);
      switch (draggingResizer) {
        case 0:
          //*top-left
          imageLeft.current = mouseX.current;
          imageTop.current =
            imageBottom.current -
            (imageHeight * (imageRight.current - imageLeft.current)) /
              imageWidth;
          break;
        case 1:
          //*top-right
          imageRight.current = mouseX.current;
          imageTop.current =
            imageBottom.current -
            (imageHeight * (imageRight.current - imageLeft.current)) /
              imageWidth;
          break;
        case 2:
          //*bottom-right
          imageBottom.current = mouseY.current;
          imageRight.current =
            imageLeft.current +
            (imageWidth * (imageBottom.current - imageTop.current)) /
              imageHeight;
          break;
        case 3:
          //*bottom-left
          imageLeft.current = mouseX.current;
          imageBottom.current =
            imageTop.current +
            (imageHeight * (imageRight.current - imageLeft.current)) /
              imageWidth;
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
