import React, { useState } from "react";
import { Link } from "react-router-dom";

function ClinicianVerification() {
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
		alert("Treatment plan updated successfully!");
	};

	const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.currentTarget.value, 10);
		setPriorityLevel(newValue);
	};

	const handleGenerateSummary = () => {
		// Generate clinical summary functionality
		console.log("Generating clinical summary...");
		alert("Clinical summary generated and ready for review!");
	};

	return (
		<div className="clinician-verification">
			<header className="clinician-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Clinician Review</h1>
			</header>
			<div className="clinician-content">
				<section className="generate-summary-section">
					<h2>Clinical Documentation</h2>
					<p>Generate comprehensive clinical summary for medical records and provider review.</p>
					<button 
						onClick={handleGenerateSummary}
						className="generate-summary-button"
					>
						Generate Clinical Summary
					</button>
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
							Submit Treatment Plan
						</button>
					</form>
				</section>
			</div>
		</div>
	);
}

export default ClinicianVerification;
