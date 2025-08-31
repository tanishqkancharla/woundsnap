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

						{/* Keragon Workflow Results */}
						{result.finalData?.workflowResults && (
							<div className="workflow-section">
								<h3>Care Team Workflows</h3>
								<div className="workflow-info">
									<div className="workflow-header">
										<span className={`workflow-type ${result.finalData.workflowResults.workflowType}`}>
											{result.finalData.workflowResults.workflowType === 'critical-risk' ? 
												'🚨 Critical Risk Workflow' : 
												'📋 Standard Care Workflow'
											}
										</span>
										<span className="infection-risk">
											Infection Risk: {result.finalData.workflowResults.infectionRisk}%
										</span>
									</div>
									
									{result.finalData.workflowResults.workflowResult && (
										<div className="workflow-actions">
											<p>✅ Workflow triggered successfully</p>
											<div className="actions-grid">
												<div className="action-item">
													<strong>SMS Notifications:</strong> 
													{result.finalData.workflowResults.workflowResult.actions.smsNotifications}
												</div>
												<div className="action-item">
													<strong>Email Notifications:</strong>
													{result.finalData.workflowResults.workflowResult.actions.emailNotifications}
												</div>
												<div className="action-item">
													<strong>Appointments Scheduled:</strong>
													{result.finalData.workflowResults.workflowResult.actions.appointmentsScheduled}
												</div>
												<div className="action-item">
													<strong>Tasks Created:</strong>
													{result.finalData.workflowResults.workflowResult.actions.tasksCreated}
												</div>
											</div>
											
											{result.finalData.workflowResults.riskFactors && result.finalData.workflowResults.riskFactors.length > 0 && (
												<div className="risk-factors">
													<strong>Risk Factors Identified:</strong>
													<ul>
														{result.finalData.workflowResults.riskFactors.map((factor, index) => (
															<li key={index}>{factor}</li>
														))}
													</ul>
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						)}

						{/* eKare Advanced Analytics */}
						{result.finalData?.ekareAnalysis && (
							<div className="ekare-analytics-section">
								<h3>Advanced Wound Analytics (eKare.ai)</h3>
								<div className="ekare-content">
									{/* Measurements */}
									<div className="measurements-section">
										<h4>3D Wound Measurements</h4>
										<div className="measurements-grid">
											<div className="measurement-item">
												<span className="measurement-label">Length:</span>
												<span className="measurement-value">
													{result.finalData.ekareAnalysis.measurements.length.toFixed(1)} cm
												</span>
											</div>
											<div className="measurement-item">
												<span className="measurement-label">Width:</span>
												<span className="measurement-value">
													{result.finalData.ekareAnalysis.measurements.width.toFixed(1)} cm
												</span>
											</div>
											<div className="measurement-item">
												<span className="measurement-label">Depth:</span>
												<span className="measurement-value">
													{result.finalData.ekareAnalysis.measurements.depth.toFixed(1)} cm
												</span>
											</div>
											<div className="measurement-item">
												<span className="measurement-label">Area:</span>
												<span className="measurement-value">
													{result.finalData.ekareAnalysis.measurements.area.toFixed(1)} cm²
												</span>
											</div>
											<div className="measurement-item">
												<span className="measurement-label">Volume:</span>
												<span className="measurement-value">
													{result.finalData.ekareAnalysis.measurements.volume.toFixed(1)} cm³
												</span>
											</div>
											<div className="measurement-item">
												<span className="measurement-label">Perimeter:</span>
												<span className="measurement-value">
													{result.finalData.ekareAnalysis.measurements.perimeter.toFixed(1)} cm
												</span>
											</div>
										</div>
									</div>

									{/* Tissue Analysis */}
									<div className="tissue-analysis-section">
										<h4>Tissue Composition</h4>
										<div className="tissue-breakdown">
											<div className="tissue-item">
												<span className="tissue-label">Granulation:</span>
												<div className="tissue-bar">
													<div 
														className="tissue-fill granulation"
														style={{width: `${result.finalData.ekareAnalysis.tissueAnalysis.granulation}%`}}
													></div>
												</div>
												<span className="tissue-percentage">
													{result.finalData.ekareAnalysis.tissueAnalysis.granulation}%
												</span>
											</div>
											<div className="tissue-item">
												<span className="tissue-label">Slough:</span>
												<div className="tissue-bar">
													<div 
														className="tissue-fill slough"
														style={{width: `${result.finalData.ekareAnalysis.tissueAnalysis.slough}%`}}
													></div>
												</div>
												<span className="tissue-percentage">
													{result.finalData.ekareAnalysis.tissueAnalysis.slough}%
												</span>
											</div>
											<div className="tissue-item">
												<span className="tissue-label">Necrosis:</span>
												<div className="tissue-bar">
													<div 
														className="tissue-fill necrosis"
														style={{width: `${result.finalData.ekareAnalysis.tissueAnalysis.necrosis}%`}}
													></div>
												</div>
												<span className="tissue-percentage">
													{result.finalData.ekareAnalysis.tissueAnalysis.necrosis}%
												</span>
											</div>
											<div className="tissue-item">
												<span className="tissue-label">Epithelialization:</span>
												<div className="tissue-bar">
													<div 
														className="tissue-fill epithelialization"
														style={{width: `${result.finalData.ekareAnalysis.tissueAnalysis.epithelialization}%`}}
													></div>
												</div>
												<span className="tissue-percentage">
													{result.finalData.ekareAnalysis.tissueAnalysis.epithelialization}%
												</span>
											</div>
										</div>
									</div>

									{/* Healing Prediction */}
									<div className="healing-prediction-section">
										<h4>Healing Prediction</h4>
										<div className="prediction-summary">
											<div className="prediction-item">
												<span className="prediction-label">Estimated Healing Time:</span>
												<span className="prediction-value highlight">
													{result.finalData.ekareAnalysis.healingPrediction.estimatedHealingTime} days
												</span>
											</div>
											<div className="prediction-item">
												<span className="prediction-label">Confidence:</span>
												<span className="prediction-value">
													{result.finalData.ekareAnalysis.healingPrediction.confidence}%
												</span>
											</div>
											<div className="prediction-item">
												<span className="prediction-label">Healing Stage:</span>
												<span className="prediction-value">
													{result.finalData.ekareAnalysis.healingPrediction.healingStage}
												</span>
											</div>
											<div className="prediction-item">
												<span className="prediction-label">Progression Rate:</span>
												<span className={`prediction-value ${result.finalData.ekareAnalysis.healingPrediction.progressionRate > 0 ? 'positive' : 'negative'}`}>
													{result.finalData.ekareAnalysis.healingPrediction.progressionRate > 0 ? '+' : ''}
													{result.finalData.ekareAnalysis.healingPrediction.progressionRate.toFixed(1)} cm²/week
												</span>
											</div>
										</div>

										{/* Risk Factors */}
										{result.finalData.ekareAnalysis.healingPrediction.riskFactors?.length > 0 && (
											<div className="risk-factors">
												<strong>Risk Factors:</strong>
												<ul>
													{result.finalData.ekareAnalysis.healingPrediction.riskFactors.map((factor, index) => (
														<li key={index}>{factor}</li>
													))}
												</ul>
											</div>
										)}

										{/* Intervention Recommendations */}
										{result.finalData.ekareAnalysis.healingPrediction.interventionRecommendations?.length > 0 && (
											<div className="intervention-recommendations">
												<strong>Intervention Recommendations:</strong>
												<ul>
													{result.finalData.ekareAnalysis.healingPrediction.interventionRecommendations.map((rec, index) => (
														<li key={index}>{rec}</li>
													))}
												</ul>
											</div>
										)}
									</div>

									{/* Quality Metrics */}
									<div className="quality-metrics-section">
										<h4>Analysis Quality</h4>
										<div className="quality-grid">
											<div className="quality-item">
												<span className="quality-label">Image Quality:</span>
												<span className="quality-score">
													{result.finalData.ekareAnalysis.qualityMetrics.imageQuality}/100
												</span>
											</div>
											<div className="quality-item">
												<span className="quality-label">Measurement Confidence:</span>
												<span className="quality-score">
													{result.finalData.ekareAnalysis.qualityMetrics.measurementConfidence}/100
												</span>
											</div>
											<div className="quality-item">
												<span className="quality-label">AI Analysis Confidence:</span>
												<span className="quality-score">
													{result.finalData.ekareAnalysis.qualityMetrics.aiAnalysisConfidence}/100
												</span>
											</div>
										</div>
									</div>
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
