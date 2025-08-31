import React from "react";
import { Link } from "react-router-dom";

function ClinicianVerification() {
	return (
		<div className="clinician-verification">
			<header className="clinician-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Clinician Review</h1>
			</header>
			<div className="clinician-content">
				<p>Clinical workflow for provider review and verification.</p>
				<p>Integration with Canvas Medical FHIR resources and Keragon automation.</p>
			</div>
		</div>
	);
}

export default ClinicianVerification;
