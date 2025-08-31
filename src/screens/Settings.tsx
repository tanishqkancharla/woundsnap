import React from "react";
import { Link } from "react-router-dom";

function Settings() {
	return (
		<div className="settings">
			<header className="settings-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Settings</h1>
			</header>
			<div className="settings-content">
				<div className="settings-section">
					<h2>Account</h2>
					<div className="setting-item">
						<span>Canvas Medical Connection</span>
						<button className="btn-secondary">Manage</button>
					</div>
				</div>
				
				<div className="settings-section">
					<h2>Preferences</h2>
					<div className="setting-item">
						<span>Notification Reminders</span>
						<input type="checkbox" defaultChecked />
					</div>
					<div className="setting-item">
						<span>Auto-backup Photos</span>
						<input type="checkbox" defaultChecked />
					</div>
				</div>

				<div className="settings-section">
					<h2>Privacy</h2>
					<div className="setting-item">
						<span>Data Sharing</span>
						<button className="btn-secondary">Review</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Settings;
