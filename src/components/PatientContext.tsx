import React, { useState, useEffect } from "react";
import { metriportService } from "../services/metriportService";

interface PatientContextProps {
	patientId: string;
	className?: string;
}

interface PatientContextData {
	relevantConditions: string[];
	currentMedications: string[];
	allergies: string[];
	previousWoundCare: string[];
	riskFactors: string[];
}

function PatientContext({ patientId, className = "" }: PatientContextProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [contextData, setContextData] = useState<PatientContextData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		loadPatientContext();
	}, [patientId]);

	const loadPatientContext = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const result = await metriportService.getPatientContextSummary(patientId);
			
			if (result.success && result.data) {
				setContextData(result.data);
			} else {
				setError(result.error || "Failed to load patient context");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setIsLoading(false);
		}
	};

	const retryLoad = () => {
		loadPatientContext();
	};

	if (isLoading) {
		return (
			<div className={`patient-context loading ${className}`}>
				<div className="patient-context-header">
					<h3>Loading Clinical Context...</h3>
					<div className="loading-spinner"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`patient-context error ${className}`}>
				<div className="patient-context-header">
					<h3>Clinical Context</h3>
					<span className="context-status error">⚠️ Error</span>
				</div>
				<div className="error-display">
					<p>{error}</p>
					<button onClick={retryLoad} className="btn-link">
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!contextData) {
		return (
			<div className={`patient-context ${className}`}>
				<div className="patient-context-header">
					<h3>Clinical Context</h3>
					<span className="context-status">No data available</span>
				</div>
			</div>
		);
	}

	const hasData = contextData.relevantConditions.length > 0 ||
					contextData.currentMedications.length > 0 ||
					contextData.allergies.length > 0 ||
					contextData.previousWoundCare.length > 0 ||
					contextData.riskFactors.length > 0;

	if (!hasData) {
		return (
			<div className={`patient-context ${className}`}>
				<div className="patient-context-header">
					<h3>Clinical Context</h3>
					<span className="context-status">✅ No relevant history</span>
				</div>
				<p className="no-context-message">
					No significant medical history affecting wound care identified.
				</p>
			</div>
		);
	}

	return (
		<div className={`patient-context ${className}`}>
			<div 
				className="patient-context-header" 
				onClick={() => setIsExpanded(!isExpanded)}
				style={{ cursor: "pointer" }}
			>
				<h3>Clinical Context</h3>
				<div className="context-controls">
					<span className="context-status">📋 History available</span>
					<span className="expand-icon">
						{isExpanded ? "−" : "+"}
					</span>
				</div>
			</div>

			{isExpanded && (
				<div className="patient-context-content">
					{/* Risk Factors - Most Important */}
					{contextData.riskFactors.length > 0 && (
						<div className="context-section risk-factors">
							<h4>⚠️ Wound Healing Risk Factors</h4>
							<ul>
								{contextData.riskFactors.map((factor, index) => (
									<li key={index} className="risk-factor">{factor}</li>
								))}
							</ul>
						</div>
					)}

					{/* Relevant Conditions */}
					{contextData.relevantConditions.length > 0 && (
						<div className="context-section conditions">
							<h4>🏥 Relevant Medical Conditions</h4>
							<ul>
								{contextData.relevantConditions.map((condition, index) => (
									<li key={index}>{condition}</li>
								))}
							</ul>
						</div>
					)}

					{/* Current Medications */}
					{contextData.currentMedications.length > 0 && (
						<div className="context-section medications">
							<h4>💊 Current Medications</h4>
							<ul>
								{contextData.currentMedications.map((medication, index) => (
									<li key={index}>{medication}</li>
								))}
							</ul>
						</div>
					)}

					{/* Allergies */}
					{contextData.allergies.length > 0 && (
						<div className="context-section allergies">
							<h4>⚠️ Known Allergies</h4>
							<ul>
								{contextData.allergies.map((allergy, index) => (
									<li key={index} className="allergy">{allergy}</li>
								))}
							</ul>
						</div>
					)}

					{/* Previous Wound Care */}
					{contextData.previousWoundCare.length > 0 && (
						<div className="context-section wound-history">
							<h4>🩹 Previous Wound Care</h4>
							<ul>
								{contextData.previousWoundCare.map((procedure, index) => (
									<li key={index}>{procedure}</li>
								))}
							</ul>
						</div>
					)}

					<div className="context-footer">
						<small>
							Data retrieved from Metriport • Patient ID: {patientId}
						</small>
					</div>
				</div>
			)}
		</div>
	);
}

export default PatientContext;
