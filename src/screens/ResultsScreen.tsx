import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { woundWorkflowService, WorkflowProgress, WorkflowResult } from "../services/woundWorkflowService";
import PatientContext from "../components/PatientContext";

function ResultsScreen() {
	const location = useLocation();
	const photoData = location.state?.photoData as string;
	
	const [isProcessing, setIsProcessing] = useState(true);
	const [progress, setProgress] = useState<WorkflowProgress | null>(null);
	const [result, setResult] = useState<WorkflowResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!photoData) {
			setError("No photo data available");
			setIsProcessing(false);
			return;
		}

		executeAnalysis();
	}, [photoData]);

	const executeAnalysis = async () => {
		try {
			setIsProcessing(true);
			setError(null);
			
			const workflowResult = await woundWorkflowService.executeWorkflow(
				photoData,
				"demo-patient", // TODO: Use actual patient ID
				(progressUpdate) => {
					setProgress(progressUpdate);
				}
			);
			
			setResult(workflowResult);
			
			if (!workflowResult.success) {
				setError(workflowResult.error || "Analysis failed");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Analysis failed");
		} finally {
			setIsProcessing(false);
		}
	};

	const retryAnalysis = () => {
		executeAnalysis();
	};

	if (!photoData) {
		return (
			<div className="results-screen">
				<header className="results-header">
					<Link to="/photo-capture" className="back-button">← Back</Link>
					<h1>Analysis Results</h1>
				</header>
				<div className="error-state">
					<p>No photo data found. Please capture a photo first.</p>
					<Link to="/photo-capture" className="btn-primary">Capture Photo</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="results-screen">
			<header className="results-header">
				<Link to="/photo-capture" className="back-button">← Back</Link>
				<h1>Analysis Results</h1>
			</header>

			<div className="results-content">
				{/* Photo Preview */}
				<div className="photo-section">
					<h2>Wound Photo</h2>
					<div className="photo-container">
						<img src={photoData} alt="Wound analysis" className="analyzed-photo" />
					</div>
				</div>

				{/* Progress Section */}
				{isProcessing && (
					<div className="progress-section">
						<h2>Processing Analysis</h2>
						{progress && (
							<div className="progress-display">
								<div className="progress-bar">
									<div 
										className="progress-fill" 
										style={{ width: `${(progress.currentStep / progress.totalSteps) * 100}%` }}
									></div>
								</div>
								<div className="progress-info">
									<span className="step-counter">
										Step {progress.currentStep} of {progress.totalSteps}
									</span>
									<span className="step-name">{progress.stepName}</span>
									<p className="step-message">{progress.message}</p>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Error Section */}
				{error && !isProcessing && (
					<div className="error-section">
						<h2>Analysis Error</h2>
						<div className="error-display">
							<p className="error-message">{error}</p>
							<button onClick={retryAnalysis} className="btn-secondary">
								Retry Analysis
							</button>
						</div>
					</div>
				)}

				{/* Patient Clinical Context - Always Show */}
				{!isProcessing && (
					<PatientContext 
						patientId="demo-patient" 
						className="clinical-context-section"
					/>
				)}

				{/* Results Section */}
				{result && !isProcessing && result.success && (
					<div className="analysis-results">
						<h2>AI Analysis Complete</h2>
						
						{/* Analysis Text */}
						{result.finalData?.analysisText && (
							<div className="analysis-text-section">
								<h3>Clinical Assessment</h3>
								<div className="analysis-text">
									{result.finalData.analysisText}
								</div>
							</div>
						)}

						{/* Structured MedGemma Analysis Data */}
						{result.finalData?.medgemmaAnalysis && (
							<div className="medgemma-analysis-section">
								<h3>MedGemma AI Analysis Details</h3>
								<div className="medgemma-data">
									{result.finalData.medgemmaAnalysis.woundType && (
										<div className="analysis-field">
											<strong>Wound Type:</strong> {result.finalData.medgemmaAnalysis.woundType}
										</div>
									)}
									{result.finalData.medgemmaAnalysis.severity && (
										<div className="analysis-field">
											<strong>Severity:</strong> {result.finalData.medgemmaAnalysis.severity}
										</div>
									)}
									{result.finalData.medgemmaAnalysis.measurements && (
										<div className="analysis-field">
											<strong>Measurements:</strong>
											<div className="measurements">
												{result.finalData.medgemmaAnalysis.measurements.length && (
													<span>Length: {result.finalData.medgemmaAnalysis.measurements.length}</span>
												)}
												{result.finalData.medgemmaAnalysis.measurements.width && (
													<span>Width: {result.finalData.medgemmaAnalysis.measurements.width}</span>
												)}
												{result.finalData.medgemmaAnalysis.measurements.depth && (
													<span>Depth: {result.finalData.medgemmaAnalysis.measurements.depth}</span>
												)}
											</div>
										</div>
									)}
									{result.finalData.medgemmaAnalysis.recommendations && result.finalData.medgemmaAnalysis.recommendations.length > 0 && (
										<div className="analysis-field">
											<strong>Clinical Recommendations:</strong>
											<ul className="recommendations-list">
												{result.finalData.medgemmaAnalysis.recommendations.map((rec, index) => (
													<li key={index}>{rec}</li>
												))}
											</ul>
										</div>
									)}
									{result.finalData.medgemmaAnalysis.confidence && (
										<div className="analysis-field">
											<strong>AI Confidence:</strong> {(result.finalData.medgemmaAnalysis.confidence * 100).toFixed(1)}%
										</div>
									)}
								</div>
							</div>
						)}

						{/* FHIR Resources Summary */}
						{result.finalData?.fhirResources && (
							<div className="fhir-section">
								<h3>Medical Records Created</h3>
								<div className="fhir-summary">
									<div className="fhir-item">
										<strong>Observations:</strong> {result.finalData.fhirResources.observations?.length || 0} records
									</div>
									<div className="fhir-item">
										<strong>Conditions:</strong> {result.finalData.fhirResources.conditions?.length || 0} records  
									</div>
								</div>
							</div>
						)}

						{/* Canvas Storage Info */}
						{result.finalData?.canvasIds && (
							<div className="storage-section">
								<h3>EHR Storage</h3>
								<div className="storage-info">
									<p>✅ Successfully stored in Canvas Medical EHR</p>
									{result.finalData.canvasIds.mediaId && (
										<div className="storage-detail">
											<strong>Photo ID:</strong> {result.finalData.canvasIds.mediaId}
										</div>
									)}
									{result.finalData.canvasIds.observationIds?.length > 0 && (
										<div className="storage-detail">
											<strong>Observations:</strong> {result.finalData.canvasIds.observationIds.length} stored
										</div>
									)}
									{result.finalData.canvasIds.conditionIds?.length > 0 && (
										<div className="storage-detail">
											<strong>Conditions:</strong> {result.finalData.canvasIds.conditionIds.length} stored
										</div>
									)}
								</div>
							</div>
						)}

						{/* Workflow Steps Summary */}
						<div className="workflow-steps">
							<h3>Process Summary</h3>
							<div className="steps-list">
								{result.steps.map((step, index) => (
									<div key={index} className={`step-item ${step.success ? 'success' : 'error'}`}>
										<span className="step-status">
											{step.success ? '✅' : '❌'}
										</span>
										<span className="step-name">{step.step}</span>
										<span className="step-duration">
											{step.duration ? `${step.duration}ms` : ''}
										</span>
										{step.error && (
											<div className="step-error">{step.error}</div>
										)}
									</div>
								))}
							</div>
							<div className="total-duration">
								Total time: {result.totalDuration}ms
							</div>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="results-actions">
					<Link to="/photo-capture" className="btn-secondary">
						Analyze Another Photo
					</Link>
					<Link to="/dashboard" className="btn-primary">
						Back to Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ResultsScreen;
