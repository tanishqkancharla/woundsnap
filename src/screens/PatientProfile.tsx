import React from "react";
import { Link } from "react-router-dom";

function PatientProfile() {
	return (
		<div className="patient-profile">
			<header className="profile-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Patient Profile</h1>
			</header>
			<div className="profile-content">
				<p>Patient profile and wound history will be displayed here.</p>
				<p>Integration with Canvas Medical and Metriport for patient data aggregation.</p>
			</div>
		</div>
	);
}

export default PatientProfile;
