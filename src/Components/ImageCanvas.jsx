import React, { useEffect, useRef, useState } from "react";

const ImageCanvas = (props) => {
  const canvasRef = useRef(null);
  const { src, width, height } = props;
  const [canvasContext, setCanvasContext] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [offsetX, setOffsetX] = useState(null);
  const [offsetY, setOffsetY] = useState(null);
  const img = new Image();
  const pi2 = 3.14 * 2;
  const resizerRadius = 8;
  const rr = resizerRadius * resizerRadius;
  let aspectRatio;
  let draggingResizer = -1;
  let imageX;
  let imageY;
  let startX;
  let startY;
  let imageWidth = width;
  let imageHeight = height;
  let imageRight, imageBottom;
  let draggingImage = false;
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
      aspectRatio = img.width / img.height;

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
      imageX = imgX;
      imageY = imgY;

      imageWidth = imgWidth;
      imageHeight = imgHeight;
      imageRight = imageX + imageWidth;
      imageBottom = imageY + imageHeight;
      draw(true, false);
    };
  }, [src]);

  const draw = (withAnchors, withBorders) => {
    //* clear the canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    //* draw the image
    canvasContext.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      imageX,
      imageY,
      imageWidth,
      imageHeight
    );

    //* optionally draw the draggable anchors
    if (withAnchors) {
      drawDragAnchor(imageX, imageY);
      drawDragAnchor(imageRight, imageY);
      drawDragAnchor(imageRight, imageBottom);
      drawDragAnchor(imageX, imageBottom);
    }

    //* optionally draw the connecting anchor lines
    if (withBorders) {
      canvasContext.beginPath();
      canvasContext.moveTo(imageX, imageY);
      canvasContext.lineTo(imageRight, imageY);
      canvasContext.lineTo(imageRight, imageBottom);
      canvasContext.lineTo(imageX, imageBottom);
      canvasContext.closePath();
      canvasContext.stroke();
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
    dx = x - imageX;
    dy = y - imageY;
    // console.log({ dx, dy });
    if (dx * dx + dy * dy <= rr) {
      console.log("top-left");
      return 0;
    }
    //* top-right
    dx = x - imageRight;
    dy = y - imageY;
    if (dx * dx + dy * dy <= rr) {
      console.log("top-right");

      return 1;
    }
    //* bottom-right
    dx = x - imageRight;
    dy = y - imageBottom;
    if (dx * dx + dy * dy <= rr) {
      console.log("bottom-right");

      return 2;
    }
    //* bottom-left
    dx = x - imageX;
    dy = y - imageBottom;
    if (dx * dx + dy * dy <= rr) {
      console.log("top-left");

      return 3;
    }
    return -1;
  };

  const hitImage = (x, y) => {
    return (
      x > imageX &&
      x < imageX + imageWidth &&
      y > imageY &&
      y < imageY + imageHeight
    );
  };

  const handleMouseDown = (e) => {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    draggingResizer = anchorHitTest(startX, startY);
    draggingImage = draggingResizer < 0 && hitImage(startX, startY);
  };

  const handleMouseUp = (e) => {
    draggingResizer = -1;
    draggingImage = false;
    draw(true, false);
  };

  const handleMouseOut = (e) => {
    handleMouseUp(e);
  };

  const handleMouseMove = (e) => {
    if (draggingResizer > -1) {
      mouseX = parseInt(e.clientX - offsetX);
      mouseY = parseInt(e.clientY - offsetY);

      //* resize the image
      switch (draggingResizer) {
        case 0:
          console.log("resizing top left");
          //*top-left
          imageX = mouseX;
          imageWidth = imageRight - mouseX;
          imageY = mouseY;
          imageHeight = imageWidth / aspectRatio;
          break;
        case 1:
          console.log("resizing top right");
          //*top-right
          imageY = mouseY;
          imageWidth = mouseX - imageX;
          imageHeight = imageWidth / aspectRatio;
          break;
        case 2:
          console.log("resizing bottom right");
          //*bottom-right
          imageWidth = mouseX - imageX;
          imageHeight = imageWidth / aspectRatio;
          break;
        case 3:
          console.log("resizing bottom left");
          //*bottom-left
          imageX = mouseX;
          imageWidth = imageRight - mouseX;
          imageHeight = imageWidth / aspectRatio;
          break;
      }

      if (imageWidth < 25) {
        imageWidth = 25;
      }
      if (imageHeight < 25) {
        imageHeight = 25;
      }

      //* set the image right and bottom
      imageRight = imageX + imageWidth;
      imageBottom = imageY + imageHeight;
      // console.log({
      //   imageWidth,
      //   imageHeight,
      //   imageX,
      //   imageY,
      //   imageRight,
      //   imageBottom,
      // });
      //* redraw the image with resizing anchors
      draw(true, true);
    } else if (draggingImage) {
      mouseX = parseInt(e.clientX - offsetX);
      mouseY = parseInt(e.clientY - offsetY);
      //** move the image by the amount of the latest drag
      let dx = mouseX - startX;
      let dy = mouseY - startY;
      imageX += dx;
      imageY += dy;
      imageRight += dx;
      imageBottom += dy;
      //** reset the startXY for next time
      startX = mouseX;
      startY = mouseY;

      //** redraw the image with border
      draw(false, true);
    }
  };
  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth / 4}
      height={window.innerHeight / 2}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseOut={handleMouseOut}
    ></canvas>
  );
};

export default ImageCanvas;
