import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RecentAnalysis {
	id: string;
	date: string;
	location: string;
	status: "healing" | "attention" | "stable";
	thumbnail: string;
	aiInsights?: string;
}

interface DashboardStats {
	totalPhotos: number;
	healingProgress: number;
	nextAppointment?: string;
	activeAlerts: number;
}

function Dashboard() {
	const { authState, logout, error } = useAuth();

	// Mock data - will be replaced with real API calls
	const [recentAnalyses] = useState<RecentAnalysis[]>([
		{
			id: "1",
			date: "2024-01-15",
			location: "Left ankle",
			status: "healing",
			thumbnail: "🩹",
			aiInsights: "Good healing progress, reduced inflammation",
		},
		{
			id: "2",
			date: "2024-01-12",
			location: "Right knee",
			status: "attention",
			thumbnail: "⚠️",
			aiInsights: "Monitor for signs of infection",
		},
	]);

	const [dashboardStats] = useState<DashboardStats>({
		totalPhotos: 12,
		healingProgress: 78,
		nextAppointment: "2024-01-20",
		activeAlerts: 1,
	});

	// Check if in demo mode - allow dashboard access for demo mode
	const isDemoMode = window.location.pathname === "/dashboard";

	const getStatusColor = (status: RecentAnalysis["status"]) => {
		switch (status) {
			case "healing":
				return "#4CAF50";
			case "attention":
				return "#FF9800";
			case "stable":
				return "#2196F3";
			default:
				return "#9E9E9E";
		}
	};

	const getStatusText = (status: RecentAnalysis["status"]) => {
		switch (status) {
			case "healing":
				return "Healing Well";
			case "attention":
				return "Needs Attention";
			case "stable":
				return "Stable";
			default:
				return "Unknown";
		}
	};

	// Show dashboard if authenticated OR in demo mode
	if (!authState.isAuthenticated && !isDemoMode) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="dashboard">
			<header className="dashboard-header">
				<div className="header-content">
					<div className="user-info">
						<h1 className="welcome-title">Welcome back</h1>
						<p className="user-status">Ready to track your healing</p>
					</div>
					<div className="header-actions">
						<Link to="/settings" className="settings-button">
							⚙️
						</Link>
						<button onClick={logout} className="logout-button">
							Logout
						</button>
					</div>
				</div>
			</header>

			{error && <div className="error-banner">⚠️ {error}</div>}

			<main className="dashboard-main">
				{/* Primary Action */}
				<section className="primary-action-section">
					<Link to="/photo-capture" className="primary-capture-button">
						<div className="capture-icon">📸</div>
						<div className="capture-text">
							<h2>Take Wound Photo</h2>
							<p>Capture and analyze with AI</p>
						</div>
						<div className="capture-arrow">›</div>
					</Link>
				</section>

				{/* Quick Stats */}
				<section className="stats-section">
					<div className="stat-cards">
						<div className="stat-card">
							<div className="stat-value">{dashboardStats.totalPhotos}</div>
							<div className="stat-label">Total Photos</div>
						</div>
						<div className="stat-card">
							<div className="stat-value">
								{dashboardStats.healingProgress}%
							</div>
							<div className="stat-label">Healing Progress</div>
						</div>
						<div className="stat-card">
							<div className="stat-value">{dashboardStats.activeAlerts}</div>
							<div className="stat-label">Active Alerts</div>
						</div>
					</div>
				</section>

				{/* Recent Analyses */}
				<section className="recent-section">
					<div className="section-header">
						<h2>Recent Analyses</h2>
						{recentAnalyses.length > 2 && (
							<Link to="/profile" className="view-all-link">
								View All
							</Link>
						)}
					</div>

					{recentAnalyses.length > 0 ? (
						<div className="analyses-list">
							{recentAnalyses.map((analysis) => (
								<div key={analysis.id} className="analysis-card">
									<div className="analysis-thumbnail">{analysis.thumbnail}</div>
									<div className="analysis-info">
										<div className="analysis-location">{analysis.location}</div>
										<div className="analysis-date">
											{new Date(analysis.date).toLocaleDateString()}
										</div>
										<div className="analysis-insights">
											{analysis.aiInsights}
										</div>
									</div>
									<div
										className="analysis-status"
										style={{ color: getStatusColor(analysis.status) }}
									>
										{getStatusText(analysis.status)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="empty-state">
							<div className="empty-icon">📊</div>
							<p>No wound analyses yet</p>
							<Link to="/photo-capture" className="empty-action">
								Take your first photo
							</Link>
						</div>
					)}
				</section>

				{/* Quick Actions */}
				<section className="quick-actions-section">
					<h2>Quick Actions</h2>
					<div className="quick-actions-grid">
						<Link to="/profile" className="quick-action-card">
							<div className="action-icon">👤</div>
							<div className="action-text">
								<h3>Patient Profile</h3>
								<p>View your information</p>
							</div>
						</Link>
						<Link to="/reminders" className="quick-action-card">
							<div className="action-icon">⏰</div>
							<div className="action-text">
								<h3>Reminders</h3>
								<p>Follow-up schedules</p>
							</div>
						</Link>
						<Link to="/clinician" className="quick-action-card">
							<div className="action-icon">👩‍⚕️</div>
							<div className="action-text">
								<h3>Clinician Review</h3>
								<p>Professional verification</p>
							</div>
						</Link>
						<Link to="/treatment" className="quick-action-card">
							<div className="action-icon">💊</div>
							<div className="action-text">
								<h3>Patient Summary/Treatment Instructions</h3>
								<p>Care instructions</p>
							</div>
						</Link>
					</div>
				</section>
			</main>

			{/* Bottom Navigation */}
			<nav className="bottom-nav">
				<Link to="/dashboard" className="nav-item active">
					<div className="nav-icon">🏠</div>
					<div className="nav-label">Home</div>
				</Link>
				<Link to="/photo-capture" className="nav-item">
					<div className="nav-icon">📸</div>
					<div className="nav-label">Camera</div>
				</Link>
				<Link to="/profile" className="nav-item">
					<div className="nav-icon">👤</div>
					<div className="nav-label">Profile</div>
				</Link>
				<Link to="/support" className="nav-item">
					<div className="nav-icon">❓</div>
					<div className="nav-label">Help</div>
				</Link>
			</nav>
		</div>
	);
}

export default Dashboard;
