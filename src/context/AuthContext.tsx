import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { canvasAuth, AuthState } from "../services/canvasAuth";

interface AuthContextType {
	authState: AuthState;
	login: () => void;
	logout: () => void;
	getAccessToken: () => Promise<string>;
	isLoading: boolean;
	error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
		expiresAt: null
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initialize auth state on component mount
	useEffect(() => {
		try {
			const currentAuthState = canvasAuth.getAuthState();
			setAuthState(currentAuthState);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Authentication error");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Auto-refresh tokens when they're about to expire
	useEffect(() => {
		if (!authState.isAuthenticated || !authState.expiresAt) {
			return;
		}

		const refreshBuffer = 5 * 60 * 1000; // Refresh 5 minutes before expiry
		const timeUntilRefresh = authState.expiresAt - Date.now() - refreshBuffer;

		if (timeUntilRefresh <= 0) {
			// Token needs immediate refresh
			refreshTokens();
			return;
		}

		const refreshTimer = setTimeout(() => {
			refreshTokens();
		}, timeUntilRefresh);

		return () => clearTimeout(refreshTimer);
	}, [authState.expiresAt]);

	const refreshTokens = async () => {
		try {
			setError(null);
			const newAuthState = await canvasAuth.refreshToken();
			setAuthState(newAuthState);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Token refresh failed");
			setAuthState({
				isAuthenticated: false,
				accessToken: null,
				refreshToken: null,
				expiresAt: null
			});
		}
	};

	const login = () => {
		try {
			setError(null);
			canvasAuth.initiateLogin();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login initiation failed");
		}
	};

	const logout = () => {
		canvasAuth.logout();
		setAuthState({
			isAuthenticated: false,
			accessToken: null,
			refreshToken: null,
			expiresAt: null
		});
		setError(null);
	};

	const getAccessToken = async (): Promise<string> => {
		try {
			setError(null);
			return await canvasAuth.getValidAccessToken();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to get access token";
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const contextValue: AuthContextType = {
		authState,
		login,
		logout,
		getAccessToken,
		isLoading,
		error
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
};
