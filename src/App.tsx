import React, { useState, useRef } from 'react';
import ReactCrop, {
  centerCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import { canvasPreview } from './canvasPreview';

import 'react-image-crop/dist/ReactCrop.css';

export default function App() {
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [process, setProcess] = useState(false);
  const [coord, setCoord] = useState(null);


  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
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

  // const showCroppedCoordinates = () => {
  //   if (completedCrop) {
  //     setProcess(true);
  //     const { x, y, width, height } = completedCrop;
  //     const scaledX = x * scale;
  //     const scaledY = y * scale;
  //     const scaledWidth = width * scale;
  //     const scaledHeight = height * scale;
  //   }
  // };

  const showImg = () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      setCoord(completedCrop)
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
    <div className='container' style={{marginTop:100, marginBottom:100}} >

      <div className="Crop-Controls">
      <form className='form-group form_pdf'>

        <input  type="file" accept="image/*" onChange={onSelectFile} className='file_inpt' />
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
      <h2 style={{marginTop:50, marginBottom:50, textAlign:'center'}}>View Image</h2>
      {/* <div className='pdf-container'> */}
      {!!imgSrc && (
        
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
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
      {/* </div> */}
  <div style={{display:'flex',marginTop:50, justifyContent:'center', flexDirection:'column', alignItems:'center', gap:30}}>
      {!!completedCrop && (
        <>
        
          <div>
              <>
                <h1>Start X: {completedCrop?.x * scale}</h1>
                <h1>Start Y: {completedCrop?.y * scale}</h1>
                <h1>End X: {(completedCrop?.x + completedCrop.width) * scale}</h1>
                <h1>End Y: {(completedCrop?.y + completedCrop.height) * scale}</h1>

                <h1>C1=</h1>
                <h1>F1=</h1>

                <h1>F2=</h1>
                <h1>C1=</h1>
                <h1>C1=</h1>
                <h1>C1=</h1>

              </>
          </div>

      <button onClick={showImg}>Show Cropped Image</button>

          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                // objectFit: 'contain',
                width: completedCrop.width * scale,
                height: completedCrop.height * scale,
              }}
            />
          </div>

        </>
      )}

    </div>
    </div>
  );
}
