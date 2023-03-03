import { useRef, useState, useEffect } from "react";

const ResizableImage = ({ src, alt }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [canvasContext, setCanvasContext] = useState(null);
  const canvasRef = useRef(null);
  const img = new Image();
  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvasContext(canvas.getContext("2d"));
    img.onload = () => {
      canvasContext.drawImage(img, position.x, position.y);
    };
    img.src = src;
  }, [src]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      x > position.x &&
      x < position.x + img.width &&
      y > position.y &&
      y < position.y + img.height
    ) {
      console.log("Clicking inside");
      setDragging(true);
    } else {
      console.log("clicking outside");
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      setPosition({
        x: x - img.width / 2,
        y: y - img.height / 2,
      });
      canvasContext.drawImage(img, x, y);
    }
  };

  const handleMouseUp = (e) => {
    setDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className="canvas-image"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      width={window.innerWidth / 2}
      height={window.innerHeight / 2}
    ></canvas>
  );
};

export default ResizableImage;
