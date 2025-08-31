// Canvas Medical OAuth 2.0 Authentication Service

export interface CanvasAuthConfig {
	clientId: string;
	clientSecret: string;
	canvasInstanceUrl: string;
	redirectUri: string;
	scopes: string[];
}

export interface TokenResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	expiresAt: number | null;
}

class CanvasAuthService {
	private config: CanvasAuthConfig;

	constructor() {
		this.config = {
			clientId: import.meta.env.VITE_CANVAS_CLIENT_ID || "",
			clientSecret: import.meta.env.VITE_CANVAS_CLIENT_SECRET || "",
			canvasInstanceUrl: import.meta.env.VITE_CANVAS_INSTANCE_URL || "",
			redirectUri: 
				import.meta.env.PROD
					? "https://woundsnap.vercel.app/auth/callback"
					: "http://localhost:1234/auth/callback",
			scopes: [
				"user/Patient.read",
				"user/Media.crus", 
				"user/Condition.crus",
				"user/Observation.crus", 
				"user/Task.crus",
				"user/Practitioner.read"
			]
		};
	}

	/**
	 * Generate a random state parameter for CSRF protection
	 */
	private generateState(): string {
		return Math.random().toString(36).substring(2, 15) + 
			   Math.random().toString(36).substring(2, 15);
	}

	/**
	 * Build the Canvas authorization URL and redirect the user
	 */
	initiateLogin(): void {
		if (!this.config.canvasInstanceUrl || !this.config.clientId) {
			throw new Error("Canvas configuration is incomplete. Please check CANVAS_INSTANCE_URL and CANVAS_CLIENT_ID environment variables.");
		}

		const state = this.generateState();
		sessionStorage.setItem("canvas_auth_state", state);

		const params = new URLSearchParams({
			response_type: "code",
			client_id: this.config.clientId,
			scope: this.config.scopes.join(" "),
			redirect_uri: this.config.redirectUri,
			state: state
		});

		const baseUrl = this.config.canvasInstanceUrl.replace(/\/$/, ''); // Remove trailing slash
		const authUrl = `${baseUrl}/auth/authorize/?${params.toString()}`;
		window.location.href = authUrl;
	}

	/**
	 * Handle the OAuth callback by exchanging the authorization code for tokens
	 */
	async handleCallback(code: string, state: string): Promise<AuthState> {
		// Verify state parameter for CSRF protection
		const storedState = sessionStorage.getItem("canvas_auth_state");
		if (!storedState || storedState !== state) {
			throw new Error("Invalid state parameter. Possible CSRF attack.");
		}

		sessionStorage.removeItem("canvas_auth_state");

		const baseUrl = this.config.canvasInstanceUrl.replace(/\/$/, ''); // Remove trailing slash
		const tokenUrl = `${baseUrl}/auth/token/`;
		
		const body = new URLSearchParams({
			grant_type: "authorization_code",
			client_id: this.config.clientId,
			client_secret: this.config.clientSecret,
			redirect_uri: this.config.redirectUri,
			code: code
		});

		try {
			const response = await fetch(tokenUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: body.toString()
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
			}

			const tokenData: TokenResponse = await response.json();
			
			// Calculate expiration time
			const expiresAt = Date.now() + (tokenData.expires_in * 1000);
			
			// Store tokens securely
			this.storeTokens({
				access_token: tokenData.access_token,
				refresh_token: tokenData.refresh_token,
				token_type: tokenData.token_type,
				expires_in: tokenData.expires_in,
				scope: tokenData.scope
			}, expiresAt);

			return {
				isAuthenticated: true,
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				expiresAt: expiresAt
			};
		} catch (error) {
			console.error("Canvas OAuth callback error:", error);
			throw error;
		}
	}

	/**
	 * Refresh the access token using the refresh token
	 */
	async refreshToken(): Promise<AuthState> {
		const refreshToken = localStorage.getItem("canvas_refresh_token");
		
		if (!refreshToken) {
			throw new Error("No refresh token available");
		}

		const baseUrl = this.config.canvasInstanceUrl.replace(/\/$/, ''); // Remove trailing slash
		const tokenUrl = `${baseUrl}/auth/token/`;
		
		const body = new URLSearchParams({
			grant_type: "refresh_token",
			client_id: this.config.clientId,
			client_secret: this.config.clientSecret,
			redirect_uri: this.config.redirectUri,
			refresh_token: refreshToken
		});

		try {
			const response = await fetch(tokenUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: body.toString()
			});

			if (!response.ok) {
				// Refresh token is invalid, user needs to re-authenticate
				this.logout();
				throw new Error("Refresh token expired. Please log in again.");
			}

			const tokenData: TokenResponse = await response.json();
			const expiresAt = Date.now() + (tokenData.expires_in * 1000);
			
			this.storeTokens(tokenData, expiresAt);

			return {
				isAuthenticated: true,
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				expiresAt: expiresAt
			};
		} catch (error) {
			console.error("Canvas token refresh error:", error);
			throw error;
		}
	}

	/**
	 * Store tokens securely in localStorage
	 */
	private storeTokens(tokenData: TokenResponse, expiresAt: number): void {
		localStorage.setItem("canvas_access_token", tokenData.access_token);
		localStorage.setItem("canvas_refresh_token", tokenData.refresh_token);
		localStorage.setItem("canvas_token_expires_at", expiresAt.toString());
		localStorage.setItem("canvas_token_type", tokenData.token_type);
		localStorage.setItem("canvas_token_scope", tokenData.scope);
	}

	/**
	 * Get current authentication state
	 */
	getAuthState(): AuthState {
		const accessToken = localStorage.getItem("canvas_access_token");
		const refreshToken = localStorage.getItem("canvas_refresh_token");
		const expiresAtStr = localStorage.getItem("canvas_token_expires_at");
		
		if (!accessToken || !refreshToken || !expiresAtStr) {
			return {
				isAuthenticated: false,
				accessToken: null,
				refreshToken: null,
				expiresAt: null
			};
		}

		const expiresAt = parseInt(expiresAtStr);
		const isExpired = Date.now() >= expiresAt - 60000; // Refresh 1 minute before expiry

		return {
			isAuthenticated: !isExpired,
			accessToken: isExpired ? null : accessToken,
			refreshToken: refreshToken,
			expiresAt: expiresAt
		};
	}

	/**
	 * Get a valid access token, refreshing if necessary
	 */
	async getValidAccessToken(): Promise<string> {
		const authState = this.getAuthState();
		
		if (authState.isAuthenticated && authState.accessToken) {
			return authState.accessToken;
		}

		if (authState.refreshToken) {
			const newAuthState = await this.refreshToken();
			return newAuthState.accessToken!;
		}

		throw new Error("No valid access token available. Please log in again.");
	}

	/**
	 * Clear all stored tokens and log the user out
	 */
	logout(): void {
		localStorage.removeItem("canvas_access_token");
		localStorage.removeItem("canvas_refresh_token");
		localStorage.removeItem("canvas_token_expires_at");
		localStorage.removeItem("canvas_token_type");
		localStorage.removeItem("canvas_token_scope");
		sessionStorage.removeItem("canvas_auth_state");
	}

	/**
	 * Check if the service is properly configured
	 */
	isConfigured(): boolean {
		return !!(this.config.canvasInstanceUrl && this.config.clientId && this.config.clientSecret);
	}
}

export const canvasAuth = new CanvasAuthService();
