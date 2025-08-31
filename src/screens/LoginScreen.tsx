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
		<div className="login-screen-new">
			<div className="login-form-container">
				<h1 className="login-title">Login</h1>
				
				<div className="login-form">
					<input 
						type="text" 
						placeholder="Username"
						className="login-input"
					/>
					<input 
						type="password" 
						placeholder="Password"
						className="login-input"
					/>
					
					<div className="forgot-password">
						<a href="#" className="forgot-link">Forgot Password?</a>
					</div>
					
					<button 
						className="login-button"
						onClick={handleCanvasLogin}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<div className="loading-spinner loading-spinner-small" style={{ marginRight: '0.5rem' }}></div>
								Logging in...
							</>
						) : "Login"}
					</button>
					
					{/* Demo mode for testing */}
					<Link to="/dashboard" className="demo-link">
						Demo Mode (Skip Authentication)
					</Link>
				</div>

				{(error || configError) && (
					<div className="login-error">
						<p>{error || configError}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default LoginScreen;
