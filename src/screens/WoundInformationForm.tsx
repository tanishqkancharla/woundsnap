import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface WoundFormData {
	location: string;
	woundCause: string;
	hasSmell: boolean;
	smellIntensity: number;
	hasPain: boolean;
	hasFever: boolean;
	bloodGlucose: string;
	isHotWarm: boolean;
	drainageAmount: 'scant' | 'medium' | 'alot' | '';
	// Keep some original fields for compatibility
	painLevel: number;
	duration: string;
	previousTreatment: string;
}

function WoundInformationForm() {
	const [formData, setFormData] = useState<WoundFormData>({
		location: "",
		woundCause: "",
		hasSmell: false,
		smellIntensity: 5,
		hasPain: false,
		hasFever: false,
		bloodGlucose: "",
		isHotWarm: false,
		drainageAmount: '',
		painLevel: 5,
		duration: "",
		previousTreatment: "",
	});
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsAnalyzing(true);
		
		// Simulate AI analysis
		setTimeout(() => {
			navigate("/treatment");
		}, 3000);
	};

	if (isAnalyzing) {
		return (
			<div className="analyzing-screen">
				<div className="loading-spinner loading-spinner-large loading-spinner-teal"></div>
				<h2>Analyzing Wound...</h2>
				<p>AI is processing your wound photo and information</p>
				<div className="analysis-steps">
					<div>✓ Image processed</div>
					<div>✓ Wound dimensions calculated</div>
					<div>⏳ Checking for infection signs</div>
					<div>⏳ Generating treatment recommendations</div>
				</div>
			</div>
		);
	}

	return (
		<div className="wound-form">
			<header className="form-header">
				<Link to="/capture" className="back-button">
					← Back
				</Link>
				<h1>Wound Information</h1>
			</header>

			<form onSubmit={handleSubmit} className="wound-form-content">
				<div className="form-group">
					<label htmlFor="location">Where is the wound located?</label>
					<input
						type="text"
						id="location"
						value={formData.location}
						onChange={(e) =>
							setFormData({ ...formData, location: e.target.value })
						}
						placeholder="Enter location"
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="woundCause">How did the wound occur?</label>
					<input
						type="text"
						id="woundCause"
						value={formData.woundCause}
						onChange={(e) =>
							setFormData({ ...formData, woundCause: e.target.value })
						}
						placeholder="Describe the cause"
						required
					/>
				</div>

				<div className="form-group">
					<label>Is there a smell?</label>
					<div className="radio-group">
						<label className="radio-option">
							<input
								type="radio"
								name="hasSmell"
								checked={formData.hasSmell === true}
								onChange={() => setFormData({ ...formData, hasSmell: true })}
							/>
							Yes
						</label>
						<label className="radio-option">
							<input
								type="radio"
								name="hasSmell"
								checked={formData.hasSmell === false}
								onChange={() => setFormData({ ...formData, hasSmell: false })}
							/>
							No
						</label>
					</div>
				</div>

				{formData.hasSmell && (
					<div className="form-group">
						<label htmlFor="smellIntensity">How bad is the smell on a scale of 1-10?</label>
						<input
							type="range"
							id="smellIntensity"
							min="1"
							max="10"
							value={formData.smellIntensity}
							onChange={(e) =>
								setFormData({ ...formData, smellIntensity: parseInt(e.target.value) })
							}
							className="smell-slider"
						/>
						<span className="scale-value">{formData.smellIntensity}</span>
					</div>
				)}

				<div className="form-group">
					<label>Does it hurt?</label>
					<div className="radio-group">
						<label className="radio-option">
							<input
								type="radio"
								name="hasPain"
								checked={formData.hasPain === true}
								onChange={() => setFormData({ ...formData, hasPain: true })}
							/>
							Yes
						</label>
						<label className="radio-option">
							<input
								type="radio"
								name="hasPain"
								checked={formData.hasPain === false}
								onChange={() => setFormData({ ...formData, hasPain: false })}
							/>
							No
						</label>
					</div>
				</div>

				<div className="form-group">
					<label>Does the patient have a fever?</label>
					<div className="radio-group">
						<label className="radio-option">
							<input
								type="radio"
								name="hasFever"
								checked={formData.hasFever === true}
								onChange={() => setFormData({ ...formData, hasFever: true })}
							/>
							Yes
						</label>
						<label className="radio-option">
							<input
								type="radio"
								name="hasFever"
								checked={formData.hasFever === false}
								onChange={() => setFormData({ ...formData, hasFever: false })}
							/>
							No
						</label>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="bloodGlucose">Latest blood glucose level</label>
					<input
						type="number"
						id="bloodGlucose"
						value={formData.bloodGlucose}
						onChange={(e) =>
							setFormData({ ...formData, bloodGlucose: e.target.value })
						}
						placeholder="138"
					/>
				</div>

				<div className="form-group">
					<label>Does the wound feel hot or warm to touch?</label>
					<div className="radio-group">
						<label className="radio-option">
							<input
								type="radio"
								name="isHotWarm"
								checked={formData.isHotWarm === true}
								onChange={() => setFormData({ ...formData, isHotWarm: true })}
							/>
							Yes
						</label>
						<label className="radio-option">
							<input
								type="radio"
								name="isHotWarm"
								checked={formData.isHotWarm === false}
								onChange={() => setFormData({ ...formData, isHotWarm: false })}
							/>
							No
						</label>
					</div>
				</div>

				<div className="form-group">
					<label>Amount of drainage</label>
					<div className="drainage-buttons">
						<button
							type="button"
							className={`drainage-btn ${formData.drainageAmount === 'scant' ? 'active' : ''}`}
							onClick={() => setFormData({ ...formData, drainageAmount: 'scant' })}
						>
							Scant
						</button>
						<button
							type="button"
							className={`drainage-btn ${formData.drainageAmount === 'medium' ? 'active' : ''}`}
							onClick={() => setFormData({ ...formData, drainageAmount: 'medium' })}
						>
							Medium
						</button>
						<button
							type="button"
							className={`drainage-btn ${formData.drainageAmount === 'alot' ? 'active' : ''}`}
							onClick={() => setFormData({ ...formData, drainageAmount: 'alot' })}
						>
							A lot
						</button>
					</div>
				</div>

				<button type="submit" className="btn-primary submit-button">
					Submit
				</button>
			</form>
		</div>
	);
}

export default WoundInformationForm;
