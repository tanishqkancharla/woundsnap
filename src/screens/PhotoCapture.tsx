import React, { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import CameraIcon from "../components/CameraIcon";

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
		<div className="photo-capture-new">
			<div className="photo-capture-container">
				<h1 className="photo-capture-title">WoundSnap Lite</h1>
				
				<div className="camera-illustration">
					<CameraIcon size={160} className="camera-icon" />
				</div>
				
				<div className="capture-instructions">
					<p>To capture a clear image of the wound:</p>
					<ul>
						<li>Ensure good lighting.</li>
						<li>Focus the camera on the wound.</li>
						<li>Hold the camera steady.</li>
						<li>Keep the wound centered.</li>
					</ul>
				</div>
				
				<div className="notes-section">
					<textarea 
						placeholder="Add notes about the wound..."
						className="wound-notes-input"
						rows={3}
					/>
				</div>

				{/* Hidden file input for upload functionality */}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileUpload}
					style={{ display: 'none' }}
				/>

				{photo && (
					<div className="photo-preview-new">
						<img 
							src={photo} 
							alt="Captured wound" 
							className="preview-image"
						/>
						<button
							className="retake-button"
							onClick={() => {
								setPhoto(null);
								setUploadError(null);
								setCameraError(null);
							}}
						>
							Retake Photo
						</button>
					</div>
				)}

				{(uploadError || cameraError) && (
					<div className="capture-error">
						<p>{uploadError || cameraError}</p>
					</div>
				)}

				<div className="capture-button-section">
					{!photo ? (
						<>
							<button
								className="photo-capture-button"
								onClick={handleTakePhoto}
								disabled={isCapturing || isUploading}
							>
								{isCapturing ? (
									<>
										<div className="loading-spinner loading-spinner-small" style={{ marginRight: '0.5rem' }}></div>
										Capturing...
									</>
								) : isUploading ? (
									<>
										<div className="loading-spinner loading-spinner-small" style={{ marginRight: '0.5rem' }}></div>
										Uploading...
									</>
								) : "Take Photo"}
							</button>
							<button
								className="upload-photo-button"
								onClick={handleUploadClick}
								disabled={isCapturing || isUploading}
							>
								Upload Photo
							</button>
						</>
					) : (
						<button className="analyze-button" onClick={handleAnalyze}>
							Analyze Wound
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default PhotoCapture;
