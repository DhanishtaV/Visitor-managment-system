import React, { useRef, useEffect } from "react";

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  /* START CAMERA */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or not available");
      console.error(err);
    }
  };

  /* CAPTURE PHOTO */
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // 🔒 SAFETY CHECK
    if (!video.videoWidth) {
      alert("Camera not ready yet");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL("image/jpeg", 0.8); // 🔥 compressed
    onCapture(imageBase64);

    stopCamera(); // 🔥 VERY IMPORTANT
  };

  /* STOP CAMERA */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  /* CLEANUP ON UNMOUNT */
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #ccc",
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: 12, display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto}>Capture Photo</button>
      </div>
    </div>
  );
};

export default WebcamCapture;
