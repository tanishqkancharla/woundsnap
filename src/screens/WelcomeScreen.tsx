import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface PermissionState {
	camera: "granted" | "denied" | "prompt" | "unsupported";
	notifications: "granted" | "denied" | "prompt" | "unsupported";
}

function WelcomeScreen() {
	const [permissions, setPermissions] = useState<PermissionState>({
		camera: "prompt",
		notifications: "prompt",
	});
	const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);

	useEffect(() => {
		checkBrowserSupport();
	}, []);

	const checkBrowserSupport = async () => {
		// Check camera support
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			setPermissions(prev => ({ ...prev, camera: "unsupported" }));
		}

		// Check notification support
		if (!("Notification" in window)) {
			setPermissions(prev => ({ ...prev, notifications: "unsupported" }));
		} else {
			setPermissions(prev => ({
				...prev,
				notifications: Notification.permission as "granted" | "denied" | "prompt"
			}));
		}
	};

	const requestCameraPermission = async () => {
		setIsCheckingPermissions(true);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ 
				video: { facingMode: 'environment' }, 
				audio: false 
			});
			
			// Stop the stream immediately after getting permission
			stream.getTracks().forEach(track => track.stop());
			
			setPermissions(prev => ({ ...prev, camera: "granted" }));
		} catch (error) {
			console.error("Camera permission denied:", error);
			setPermissions(prev => ({ ...prev, camera: "denied" }));
		} finally {
			setIsCheckingPermissions(false);
		}
	};

	const requestNotificationPermission = async () => {
		if ("Notification" in window) {
			const permission = await Notification.requestPermission();
			setPermissions(prev => ({ ...prev, notifications: permission as "granted" | "denied" }));
		}
	};

	const getPermissionStatus = (permission: string) => {
		const status = permissions[permission as keyof PermissionState];
		switch (status) {
			case "granted":
				return { icon: "✅", text: "Enabled", className: "permission-granted" };
			case "denied":
				return { icon: "❌", text: "Denied", className: "permission-denied" };
			case "unsupported":
				return { icon: "⚠️", text: "Not Supported", className: "permission-unsupported" };
			default:
				return { icon: "⏳", text: "Not Requested", className: "permission-prompt" };
		}
	};

	const canProceed = permissions.camera === "granted";

	return (
		<div className="welcome-screen">
			<div className="welcome-header">
				<h1 className="app-title">WoundSnap</h1>
				<p className="app-subtitle">AI-powered wound care analysis</p>
			</div>

			<div className="welcome-features">
				<div className="feature-card">
					<div className="feature-icon">🔬</div>
					<h3>AI Analysis</h3>
					<p>Advanced medical imaging AI identifies wound dimensions, tissue types, and healing stages</p>
				</div>
				<div className="feature-card">
					<div className="feature-icon">📋</div>
					<h3>FHIR Compliant</h3>
					<p>Automatic medical documentation ready for any EHR system (Epic, Cerner, etc.)</p>
				</div>
				<div className="feature-card">
					<div className="feature-icon">👩‍⚕️</div>
					<h3>Clinical Workflow</h3>
					<p>Smart care coordination with automated provider alerts and treatment plans</p>
				</div>
			</div>

			<div className="permissions-section">
				<h2>Required Permissions</h2>
				<p className="permissions-description">
					For the best experience, WoundSnap needs access to certain device features. Your privacy and security are our top priorities.
				</p>
				
				<div className="permission-cards">
					<div className="permission-card">
						<div className="permission-header">
							<div className="permission-icon">📷</div>
							<div className="permission-info">
								<h3>Camera Access</h3>
								<p>Required to capture wound photographs for AI analysis</p>
							</div>
							<div className={`permission-status ${getPermissionStatus("camera").className}`}>
								{getPermissionStatus("camera").icon} {getPermissionStatus("camera").text}
							</div>
						</div>
						{permissions.camera === "prompt" && (
							<button 
								className="permission-button"
								onClick={requestCameraPermission}
								disabled={isCheckingPermissions}
							>
								{isCheckingPermissions ? "Requesting..." : "Enable Camera"}
							</button>
						)}
						{permissions.camera === "denied" && (
							<p className="permission-help">
								Please enable camera access in your browser settings to use WoundSnap
							</p>
						)}
						{permissions.camera === "unsupported" && (
							<p className="permission-help">
								Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.
							</p>
						)}
					</div>

					<div className="permission-card optional">
						<div className="permission-header">
							<div className="permission-icon">🔔</div>
							<div className="permission-info">
								<h3>Notifications <span className="optional-badge">Optional</span></h3>
								<p>For follow-up reminders and treatment alerts</p>
							</div>
							<div className={`permission-status ${getPermissionStatus("notifications").className}`}>
								{getPermissionStatus("notifications").icon} {getPermissionStatus("notifications").text}
							</div>
						</div>
						{permissions.notifications === "prompt" && (
							<button 
								className="permission-button secondary"
								onClick={requestNotificationPermission}
							>
								Enable Notifications
							</button>
						)}
					</div>
				</div>
			</div>

			<div className="privacy-section">
				<div className="privacy-badge">
					<span className="privacy-icon">🔒</span>
					<div className="privacy-text">
						<strong>HIPAA Compliant</strong>
						<p>Your medical data is encrypted and secure</p>
					</div>
				</div>
			</div>

			<div className="welcome-actions">
				<Link 
					to="/login" 
					className={`btn-primary ${!canProceed ? 'btn-disabled' : ''}`}
					onClick={(e) => {
						if (!canProceed) {
							e.preventDefault();
							alert("Camera access is required to use WoundSnap. Please enable camera permissions to continue.");
						}
					}}
				>
					{canProceed ? "Get Started" : "Camera Required"}
				</Link>
				<Link to="/support" className="btn-secondary">
					Learn More
				</Link>
			</div>
		</div>
	);
}

export default WelcomeScreen;
