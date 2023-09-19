import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop';
import { canvasPreview } from './canvasPreview';

import 'react-image-crop/dist/ReactCrop.css';

export default function App() {
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cropRef = useRef<any>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [process, setProcess] = useState(false);

  const [scrollOffset, setScrollOffset] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (cropRef.current) {
        const cropElement = cropRef.current.getResizerElement();
        if (cropElement) {
          const left = cropElement.scrollLeft;
          const top = cropElement.scrollTop;
          setScrollOffset({ left, top });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (completedCrop) {
      const { width, height } = e.currentTarget;
      setCrop(convertToPixelCrop(completedCrop, width, height));
    }
  }

  const showImg = () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      setCoordinates(completedCrop);
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate,
      );
    }
  };

  return (
    <div className='container' style={{ marginTop: 100, marginBottom: 100 }}>
      <div className="Crop-Controls">
        <form className='form-group form_pdf'>
          <input type="file" accept="image/*" onChange={onSelectFile} className='file_inpt' />
          <div>
            <label htmlFor="scale-input">Zoom: </label>
            <input
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              disabled={!imgSrc}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>
        </form>
      </div>
      <h2 style={{ marginTop: 50, marginBottom: 50, textAlign: 'center' }}>View Image</h2>
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => {
            setCompletedCrop(c);
            const scrollLeft = scrollOffset.left || 0;
            const scrollTop = scrollOffset.top || 0;
            // Adjust the coordinates based on the scale factor
            const adjustedX = (c.x - scrollLeft) / scale;
            const adjustedY = (c.y - scrollTop) / scale;
            const adjustedWidth = c.width / scale;
            const adjustedHeight = c.height / scale;
            setCompletedCrop({ x: adjustedX, y: adjustedY, width: adjustedWidth, height: adjustedHeight });
          }}
          ref={cropRef}
          minHeight={200}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}

      <div style={{ display: 'flex', justifyContent: "center", flexDirection: 'column', alignItems: "center", gap: 50 }}>
        <button onClick={showImg} style={{ width: 250, background: "#4681f4", height: 40, cursor: 'pointer', marginTop: 20, color: 'white', fontSize: 18, border: '1px solid #4681f4' }}>Process</button>

        {!!completedCrop && (
          <>
            <div>
              <h2 style={{ marginTop: 50, marginBottom: 50, textAlign: 'center' }}>View Cropped Image</h2>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: coordinates ? "1px solid gray" : "",
                  objectFit: 'contain',
                  width: completedCrop.width * scale,
                  height: completedCrop.height * scale,
                }}
              />
            </div>
            <div>
              <>
                {coordinates &&
                  <>
                    <h1>Start X: {coordinates?.x}</h1>
                    <h1>Start Y: {coordinates?.y}</h1>
                    <h1>End X: {coordinates?.x + coordinates?.width}</h1>
                    <h1>End Y: {coordinates?.y + coordinates?.height}</h1>
                  </>
                }
              </>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
