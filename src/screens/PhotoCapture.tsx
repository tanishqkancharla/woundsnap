import React, { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

function PhotoCapture() {
	const [isCapturing, setIsCapturing] = useState(false);
	const [photo, setPhoto] = useState<string | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const webcamRef = useRef<Webcam>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
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

	const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			setUploadError("Please select a valid image file");
			return;
		}

		// Validate file size (5MB limit)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			setUploadError("File size too large. Please select an image under 5MB");
			return;
		}

		setIsUploading(true);
		setUploadError(null);
		setCameraError(null);

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			if (result) {
				setPhoto(result);
				setUploadError(null);
			} else {
				setUploadError("Failed to process the image file");
			}
			setIsUploading(false);
		};

		reader.onerror = () => {
			setUploadError("Error reading the image file");
			setIsUploading(false);
		};

		reader.readAsDataURL(file);
	}, []);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

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
								<p>Or use the upload option below</p>
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
						
						{uploadError && (
							<div className="upload-error">
								<p>Upload Error: {uploadError}</p>
							</div>
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

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileUpload}
				style={{ display: 'none' }}
			/>

			<div className="capture-controls">
				{!photo ? (
					<div className="capture-options">
						<button
							className="capture-button"
							onClick={handleTakePhoto}
							disabled={isCapturing || isUploading}
						>
							{isCapturing ? "Capturing..." : "Take Photo"}
						</button>
						<div className="upload-section">
							<p className="upload-label">or</p>
							<button
								className="upload-button btn-secondary"
								onClick={handleUploadClick}
								disabled={isCapturing || isUploading}
							>
								{isUploading ? "Uploading..." : "Upload Photo"}
							</button>
						</div>
					</div>
				) : (
					<div className="photo-actions">
						<button
							className="btn-secondary"
							onClick={() => {
								setPhoto(null);
								setUploadError(null);
								setCameraError(null);
							}}
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
