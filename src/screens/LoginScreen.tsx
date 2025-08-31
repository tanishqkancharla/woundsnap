import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canvasAuth } from "../services/canvasAuth";

function LoginScreen() {
	const { login, error } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [configError, setConfigError] = useState<string | null>(null);

	const handleCanvasLogin = async () => {
		try {
			setIsLoading(true);
			setConfigError(null);

			// Check if Canvas is properly configured
			if (!canvasAuth.isConfigured()) {
				setConfigError("Canvas Medical is not configured. Please check your environment variables.");
				return;
			}

			// Initiate OAuth flow
			login();
		} catch (err) {
			setConfigError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login-screen">
			<div className="login-container">
				<div className="login-header">
					<h1>Welcome to WoundSnap</h1>
					<p>Connect with Canvas Medical for secure, FHIR-compliant patient data management</p>
				</div>

				<div className="canvas-info">
					<div className="canvas-logo">
						<div className="canvas-icon">🏥</div>
						<strong>Canvas Medical</strong>
					</div>
					<div className="permissions-info">
						<h3>This app will access:</h3>
						<ul>
							<li>📋 Patient information (read-only)</li>
							<li>📸 Medical images and photos</li>
							<li>🩺 Wound conditions and diagnoses</li>
							<li>📊 Wound measurements and observations</li>
							<li>📅 Care tasks and reminders</li>
							<li>👨‍⚕️ Healthcare provider information</li>
						</ul>
					</div>
				</div>

				{(error || configError) && (
					<div className="error-banner">
						<strong>⚠ Authentication Error</strong>
						<p>{error || configError}</p>
						{configError && (
							<small>
								Make sure CANVAS_CLIENT_ID, CANVAS_CLIENT_SECRET, and CANVAS_INSTANCE_URL 
								are properly configured in your environment.
							</small>
						)}
					</div>
				)}

				<div className="login-actions">
					<button 
						className={`btn-primary canvas-oauth ${isLoading ? 'loading' : ''}`}
						onClick={handleCanvasLogin}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<span className="spinner"></span>
								Connecting to Canvas...
							</>
						) : (
							<>
								<span className="canvas-icon">🏥</span>
								Login with Canvas Medical
							</>
						)}
					</button>
					
					<Link to="/dashboard" className="btn-secondary">
						💡 Demo Mode (Skip Authentication)
					</Link>
				</div>

				<div className="security-note">
					<p>🔒 Your data is protected by HIPAA-compliant encryption and Canvas Medical's enterprise security.</p>
				</div>
			</div>


		</div>
	);
}

export default LoginScreen;
