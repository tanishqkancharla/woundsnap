import React from "react";
import { Link } from "react-router-dom";

function TreatmentPlan() {
	const analysisResults = {
		woundType: "Stage 2 Pressure Ulcer",
		dimensions: "3.2cm × 2.1cm × 0.8cm deep",
		healingStage: "Proliferative phase",
		infectionRisk: "Low",
		estimatedHealing: "2-3 weeks with proper care",
	};

	const treatmentSteps = [
		"Clean wound with saline solution daily",
		"Apply hydrocolloid dressing",
		"Change dressing every 3 days or when saturated",
		"Monitor for signs of infection",
		"Take follow-up photo in 1 week",
	];

	const warningSigns = [
		"Increased redness around wound",
		"Foul-smelling drainage",
		"Fever or chills",
		"Wound becoming larger or deeper",
	];

	return (
		<div className="treatment-plan">
			<header className="treatment-header">
				<Link to="/dashboard" className="back-button">
					← Dashboard
				</Link>
				<h1>Treatment Plan</h1>
			</header>

			<div className="treatment-content">
				<section className="analysis-results">
					<h2>AI Analysis Results</h2>
					<div className="result-grid">
						<div className="result-item">
							<span className="label">Wound Type:</span>
							<span className="value">{analysisResults.woundType}</span>
						</div>
						<div className="result-item">
							<span className="label">Dimensions:</span>
							<span className="value">{analysisResults.dimensions}</span>
						</div>
						<div className="result-item">
							<span className="label">Healing Stage:</span>
							<span className="value">{analysisResults.healingStage}</span>
						</div>
						<div className="result-item">
							<span className="label">Infection Risk:</span>
							<span className="value risk-low">{analysisResults.infectionRisk}</span>
						</div>
						<div className="result-item">
							<span className="label">Est. Healing:</span>
							<span className="value">{analysisResults.estimatedHealing}</span>
						</div>
					</div>
				</section>

				<section className="treatment-steps">
					<h2>Treatment Instructions</h2>
					<ol className="treatment-list">
						{treatmentSteps.map((step, index) => (
							<li key={index} className="treatment-step">
								{step}
							</li>
						))}
					</ol>
				</section>

				<section className="warning-signs">
					<h2>⚠️ Watch for Warning Signs</h2>
					<p>Contact your healthcare provider immediately if you notice:</p>
					<ul className="warning-list">
						{warningSigns.map((sign, index) => (
							<li key={index} className="warning-item">
								{sign}
							</li>
						))}
					</ul>
				</section>

				<div className="treatment-actions">
					<Link to="/reminders" className="btn-primary">
						Set Follow-up Reminders
					</Link>
					<Link to="/clinician" className="btn-secondary">
						Send to Clinician
					</Link>
				</div>
			</div>
		</div>
	);
}

export default TreatmentPlan;
