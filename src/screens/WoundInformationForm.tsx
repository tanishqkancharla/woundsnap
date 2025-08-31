import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function WoundInformationForm() {
	const [formData, setFormData] = useState({
		location: "",
		painLevel: 5,
		drainage: "",
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
				<div className="loading-spinner">🔄</div>
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
					<label htmlFor="location">Wound Location</label>
					<select
						id="location"
						value={formData.location}
						onChange={(e) =>
							setFormData({ ...formData, location: e.target.value })
						}
						required
					>
						<option value="">Select location</option>
						<option value="leg">Leg</option>
						<option value="arm">Arm</option>
						<option value="back">Back</option>
						<option value="foot">Foot</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="pain">Pain Level (1-10)</label>
					<input
						type="range"
						id="pain"
						min="1"
						max="10"
						value={formData.painLevel}
						onChange={(e) =>
							setFormData({ ...formData, painLevel: parseInt(e.target.value) })
						}
					/>
					<span className="pain-value">{formData.painLevel}</span>
				</div>

				<div className="form-group">
					<label htmlFor="drainage">Drainage Type</label>
					<select
						id="drainage"
						value={formData.drainage}
						onChange={(e) =>
							setFormData({ ...formData, drainage: e.target.value })
						}
					>
						<option value="">None</option>
						<option value="clear">Clear</option>
						<option value="yellow">Yellow</option>
						<option value="green">Green</option>
						<option value="bloody">Bloody</option>
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="duration">How long has wound existed?</label>
					<input
						type="text"
						id="duration"
						value={formData.duration}
						onChange={(e) =>
							setFormData({ ...formData, duration: e.target.value })
						}
						placeholder="e.g., 2 weeks"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="treatment">Previous Treatment</label>
					<textarea
						id="treatment"
						value={formData.previousTreatment}
						onChange={(e) =>
							setFormData({ ...formData, previousTreatment: e.target.value })
						}
						placeholder="Any previous treatments or medications..."
					/>
				</div>

				<button type="submit" className="btn-primary analyze-button">
					Analyze Wound
				</button>
			</form>
		</div>
	);
}

export default WoundInformationForm;
