import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { canvasAuth } from "../services/canvasAuth";

function AuthCallback() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleCallback = async () => {
			try {
				const code = searchParams.get("code");
				const state = searchParams.get("state");
				const errorParam = searchParams.get("error");
				const errorDescription = searchParams.get("error_description");

				// Check for OAuth error response
				if (errorParam) {
					const errorMsg = errorDescription || errorParam;
					setError(`Authentication failed: ${errorMsg}`);
					setStatus("error");
					return;
				}

				// Validate required parameters
				if (!code || !state) {
					setError("Missing required authentication parameters");
					setStatus("error");
					return;
				}

				// Exchange code for tokens
				await canvasAuth.handleCallback(code, state);
				setStatus("success");
				
				// Redirect to dashboard after successful authentication
				setTimeout(() => {
					navigate("/dashboard", { replace: true });
				}, 2000);

			} catch (err) {
				console.error("Auth callback error:", err);
				setError(err instanceof Error ? err.message : "Authentication failed");
				setStatus("error");
			}
		};

		handleCallback();
	}, [searchParams, navigate]);

	const handleRetry = () => {
		navigate("/login");
	};

	return (
		<div className="auth-callback">
			<div className="auth-callback-content">
				{status === "processing" && (
					<>
						<div className="loading-spinner"></div>
						<h2>Completing Authentication...</h2>
						<p>Please wait while we securely connect your Canvas Medical account.</p>
					</>
				)}

				{status === "success" && (
					<>
						<div className="success-icon">✓</div>
						<h2>Authentication Successful!</h2>
						<p>Redirecting you to the dashboard...</p>
					</>
				)}

				{status === "error" && (
					<>
						<div className="error-icon">⚠</div>
						<h2>Authentication Failed</h2>
						<p className="error-message">{error}</p>
						<button onClick={handleRetry} className="btn-primary">
							Try Again
						</button>
					</>
				)}
			</div>

			<style jsx>{`
				.auth-callback {
					display: flex;
					justify-content: center;
					align-items: center;
					min-height: 100vh;
					background: #f8fafc;
					padding: 20px;
				}

				.auth-callback-content {
					text-align: center;
					background: white;
					padding: 40px;
					border-radius: 12px;
					box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
					max-width: 400px;
				}

				.loading-spinner {
					width: 40px;
					height: 40px;
					border: 4px solid #e5e7eb;
					border-left: 4px solid #3b82f6;
					border-radius: 50%;
					animation: spin 1s linear infinite;
					margin: 0 auto 20px;
				}

				.success-icon {
					width: 60px;
					height: 60px;
					background: #10b981;
					color: white;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24px;
					font-weight: bold;
					margin: 0 auto 20px;
				}

				.error-icon {
					width: 60px;
					height: 60px;
					background: #ef4444;
					color: white;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24px;
					font-weight: bold;
					margin: 0 auto 20px;
				}

				h2 {
					margin: 0 0 10px;
					color: #1f2937;
				}

				p {
					margin: 0 0 20px;
					color: #6b7280;
					line-height: 1.5;
				}

				.error-message {
					color: #dc2626;
					background: #fef2f2;
					padding: 12px;
					border-radius: 8px;
					border: 1px solid #fecaca;
				}

				.btn-primary {
					background: #3b82f6;
					color: white;
					border: none;
					padding: 12px 24px;
					border-radius: 8px;
					font-size: 16px;
					font-weight: 500;
					cursor: pointer;
					transition: background-color 0.2s;
				}

				.btn-primary:hover {
					background: #2563eb;
				}

				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}

export default AuthCallback;
