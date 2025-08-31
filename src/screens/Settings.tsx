import React, { useState } from "react";
import { Link } from "react-router-dom";
import ToggleSwitch from "../components/ToggleSwitch";

function Settings() {
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [pushNotifications, setPushNotifications] = useState(true);
	const [notificationReminders, setNotificationReminders] = useState(true);
	const [autoBackup, setAutoBackup] = useState(true);

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
					<h2>Notification Preferences</h2>
					<ToggleSwitch
						id="email-notifications"
						checked={emailNotifications}
						onChange={setEmailNotifications}
						label="Email Notifications"
					/>
					<ToggleSwitch
						id="push-notifications"
						checked={pushNotifications}
						onChange={setPushNotifications}
						label="Push Notifications"
					/>
				</div>

				<div className="settings-section">
					<h2>Account Management</h2>
					<button 
						className="account-management-button"
						onClick={() => {
							// TODO: Implement update profile functionality
							alert('Update Profile functionality coming soon!');
						}}
					>
						Update Profile
					</button>
					<button 
						className="account-management-button"
						onClick={() => {
							// TODO: Implement change password functionality
							alert('Change Password functionality coming soon!');
						}}
					>
						Change Password
					</button>
				</div>
				
				<div className="settings-section">
					<h2>Account</h2>
					<div className="setting-item">
						<span>Canvas Medical Connection</span>
						<button className="btn-secondary">Manage</button>
					</div>
				</div>
				
				<div className="settings-section">
					<h2>Preferences</h2>
					<ToggleSwitch
						id="notification-reminders"
						checked={notificationReminders}
						onChange={setNotificationReminders}
						label="Notification Reminders"
					/>
					<ToggleSwitch
						id="auto-backup"
						checked={autoBackup}
						onChange={setAutoBackup}
						label="Auto-backup Photos"
					/>
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
