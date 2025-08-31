import React, { useState } from "react";
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

	// Form state - pre-populated with AI recommendations
	const [medicationName, setMedicationName] = useState("Hydrocolloid dressing");
	const [medicationType, setMedicationType] = useState("topical");
	const [dressingFrequency, setDressingFrequency] = useState("Every 3 days");
	const [elevation, setElevation] = useState(false);
	const [compression, setCompression] = useState(false);
	const [priorityLevel, setPriorityLevel] = useState(3);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission - could send to Canvas Medical or other API
		console.log("Treatment plan submitted:", {
			medicationName,
			medicationType,
			dressingFrequency,
			elevation,
			compression,
			priorityLevel
		});
	};

	const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.currentTarget.value, 10);
		setPriorityLevel(newValue);
	};

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

				<section className="treatment-form">
					<h2>Customize Treatment Plan</h2>
					<p>Review and modify the AI-generated recommendations below:</p>
					
					<form onSubmit={handleSubmit}>
						<div className="form-section">
							<h3>Medication</h3>
							<div className="form-group">
								<label htmlFor="medication-name">Medication Name</label>
								<input
									type="text"
									id="medication-name"
									value={medicationName}
									onChange={(e) => setMedicationName(e.target.value)}
									placeholder="Enter medication name"
								/>
							</div>
							<div className="form-group">
								<label>Type</label>
								<div className="radio-group">
									<label className="radio-option">
										<input
											type="radio"
											value="oral"
											checked={medicationType === "oral"}
											onChange={(e) => setMedicationType(e.target.value)}
										/>
										Oral
									</label>
									<label className="radio-option">
										<input
											type="radio"
											value="topical"
											checked={medicationType === "topical"}
											onChange={(e) => setMedicationType(e.target.value)}
										/>
										Topical
									</label>
								</div>
							</div>
						</div>

						<div className="form-section">
							<h3>Wound Dressing Changes</h3>
							<div className="form-group">
								<label htmlFor="dressing-frequency">Frequency</label>
								<input
									type="text"
									id="dressing-frequency"
									value={dressingFrequency}
									onChange={(e) => setDressingFrequency(e.target.value)}
									placeholder="Enter frequency"
								/>
							</div>
						</div>

						<div className="form-section">
							<h3>Other Interventions</h3>
							<div className="checkbox-group">
								<label className="checkbox-option">
									<input
										type="checkbox"
										checked={elevation}
										onChange={(e) => setElevation(e.target.checked)}
									/>
									Elevation
								</label>
								<label className="checkbox-option">
									<input
										type="checkbox"
										checked={compression}
										onChange={(e) => setCompression(e.target.checked)}
									/>
									Compression
								</label>
							</div>
						</div>

						<div className="form-section">
							<h3>Priority Level</h3>
							<div className="slider-group">
								<div className="slider-labels">
									<span>Low</span>
									<span>High</span>
								</div>
								<input
									type="range"
									min={1}
									max={5}
									step={1}
									value={priorityLevel}
									onChange={handlePriorityChange}
									onInput={handlePriorityChange}
									className="priority-slider"
								/>
								<div className="priority-value">Priority: {priorityLevel}</div>
							</div>
						</div>

						<button type="submit" className="submit-button">
							Submit
						</button>
					</form>
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
