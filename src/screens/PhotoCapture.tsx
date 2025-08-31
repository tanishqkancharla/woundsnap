import React, { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

function PhotoCapture() {
	const [isCapturing, setIsCapturing] = useState(false);
	const [photo, setPhoto] = useState<string | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const webcamRef = useRef<Webcam>(null);
	const navigate = useNavigate();

	const handleTakePhoto = useCallback(() => {
		if (!webcamRef.current) {
			setCameraError("Camera not available");
			return;
		}

		setIsCapturing(true);
		try {
			const imageSrc = webcamRef.current.getScreenshot();
			if (imageSrc) {
				setPhoto(imageSrc);
				setCameraError(null);
			} else {
				setCameraError("Failed to capture photo");
			}
		} catch (error) {
			setCameraError("Error capturing photo");
			console.error("Photo capture error:", error);
		} finally {
			setIsCapturing(false);
		}
	}, []);

	const handleAnalyze = () => {
		if (photo) {
			// Navigate to results screen with the captured photo
			navigate("/results", { state: { photoData: photo } });
		}
	};

	return (
		<div className="photo-capture">
			<header className="capture-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Capture Wound Photo</h1>
			</header>

			<div className="camera-container">
				{!photo ? (
					<div className="camera-preview">
						{cameraError ? (
							<div className="camera-error">
								<p>Camera Error: {cameraError}</p>
								<p>Please ensure camera permissions are granted</p>
							</div>
						) : (
							<>
								<div className="camera-overlay">
									<div className="wound-guide">
										Position wound within guides
									</div>
								</div>
								<Webcam
									ref={webcamRef}
									screenshotFormat="image/jpeg"
									screenshotQuality={0.8}
									videoConstraints={{
										width: 1280,
										height: 720,
										facingMode: "environment"
									}}
									onUserMediaError={() => setCameraError("Failed to access camera")}
									className="camera-feed"
								/>
							</>
						)}
					</div>
				) : (
					<div className="photo-preview">
						<img 
							src={photo} 
							alt="Captured wound" 
							className="captured-image"
						/>
					</div>
				)}
			</div>

			<div className="capture-controls">
				{!photo ? (
					<button
						className="capture-button"
						onClick={handleTakePhoto}
						disabled={isCapturing}
					>
						{isCapturing ? "Capturing..." : "Take Photo"}
					</button>
				) : (
					<div className="photo-actions">
						<button
							className="btn-secondary"
							onClick={() => setPhoto(null)}
						>
							Retake
						</button>
						<button className="btn-primary" onClick={handleAnalyze}>
							Analyze Wound
						</button>
					</div>
				)}
			</div>

			<div className="capture-tips">
				<h3>Tips for best results:</h3>
				<ul>
					<li>Ensure good lighting</li>
					<li>Keep camera steady</li>
					<li>Position wound within guides</li>
					<li>Include ruler for scale if available</li>
				</ul>
			</div>
		</div>
	);
}

export default PhotoCapture;
