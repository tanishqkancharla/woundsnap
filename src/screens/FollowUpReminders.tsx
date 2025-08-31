import React from "react";
import { Link } from "react-router-dom";

function FollowUpReminders() {
	return (
		<div className="follow-up-reminders">
			<header className="reminders-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Follow-up Reminders</h1>
			</header>
			<div className="reminders-content">
				<p>Follow-up scheduling and reminder system.</p>
				<p>Integration with Keragon for automated care coordination.</p>
			</div>
		</div>
	);
}

export default FollowUpReminders;
