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
		<div className="welcome-screen-new">
			<div className="welcome-teal-header">
				<div className="welcome-logo">
					<span className="heart-icon">🤍</span>
					<span className="app-name">WoundSnap Lite</span>
				</div>
			</div>

			<div className="welcome-content-card">
				<h1 className="welcome-title">Welcome to WoundSnap Lite</h1>
				<p className="welcome-description">
					Effortlessly track and manage wound healing progress with WoundSnap Lite. Your journey to better wound care begins here.
				</p>
				
				<Link 
					to="/login" 
					className="welcome-proceed-button"
				>
					Proceed to Login / Create Account
				</Link>
			</div>
		</div>
	);
}

export default WelcomeScreen;
