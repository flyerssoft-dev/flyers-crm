import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from 'antd';
import './signature.scss';

const SignaturePad = ({ initialSignature, onSaveSignature }) => {
  const sigCanvas = useRef(null);
  const [isChanged, setIsChanged] = useState(false);
  const [canvasSize] = useState({ width: 400, height: 200 });

  // Load the initial signature
  useEffect(() => {
    if (initialSignature) {
      const canvas = sigCanvas.current.getCanvas();
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = initialSignature;

      img.onload = () => {
        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Scale the image to fit the canvas size
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.min(scaleX, scaleY);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
    }
  }, [initialSignature]);

  // Save the signature
  const handleSave = () => {
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    if (onSaveSignature) {
      onSaveSignature(signature);
    }
    setIsChanged(false);
  };

  // Clear the signature pad
  const handleClear = () => {
    sigCanvas.current.clear();
    setIsChanged(false);
  };

  // Detect drawing changes
  const handleDraw = () => setIsChanged(true);

  return (
    <div className="signature-container">
      <div className="signature-box">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: canvasSize.width,
            height: canvasSize.height,
            className: 'sigCanvas',
          }}
          onEnd={handleDraw}
        />
      </div>
      <div className="button-container">
        <Button
          type="primary"
          onClick={handleSave}
          disabled={!isChanged} // Disable save if no change
        >
          Save Signature
        </Button>
        <Button danger onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
