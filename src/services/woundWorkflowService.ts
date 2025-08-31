// Wound Analysis Workflow Orchestration Service

import { medgemmaService, WoundAnalysisResponse } from './medgemmaService';
import { phenomlService, PhenomlResponse } from './phenomlService';
import { canvasService, CanvasResponse } from './canvasService';
import { keragonService, WoundAnalysisData } from './keragonService';

export interface WorkflowStepResult {
	step: string;
	success: boolean;
	data?: any;
	error?: string;
	duration?: number;
}

export interface WorkflowResult {
	success: boolean;
	steps: WorkflowStepResult[];
	finalData?: {
		analysisText: string;
		fhirResources: any;
		canvasIds: any;
	};
	totalDuration: number;
	error?: string;
}

export interface WorkflowProgress {
	currentStep: number;
	totalSteps: number;
	stepName: string;
	message: string;
}

class WoundWorkflowService {
	private readonly STEPS = [
		"Photo Processing",
		"AI Analysis (MedGemma)", 
		"FHIR Conversion (Phenoml)",
		"EHR Storage (Canvas)",
		"Workflow Automation (Keragon)"
	];

	/**
	 * Execute complete wound analysis workflow
	 */
	async executeWorkflow(
		imageData: string, 
		patientId: string = "demo-patient",
		onProgress?: (progress: WorkflowProgress) => void
	): Promise<WorkflowResult> {
		const startTime = Date.now();
		const steps: WorkflowStepResult[] = [];

		try {
			// Step 1: Photo Processing
			this.updateProgress(onProgress, 1, "Photo Processing", "Validating and preparing image...");
			const photoStep = await this.processPhoto(imageData);
			steps.push(photoStep);
			
			if (!photoStep.success) {
				throw new Error(photoStep.error);
			}

			// Step 2: AI Analysis with MedGemma
			this.updateProgress(onProgress, 2, "AI Analysis (MedGemma)", "Analyzing wound with medical AI...");
			const analysisStep = await this.runMedGemmaAnalysis(imageData);
			steps.push(analysisStep);
			
			if (!analysisStep.success) {
				throw new Error(analysisStep.error);
			}

			// Step 3: FHIR Conversion with Phenoml
			this.updateProgress(onProgress, 3, "FHIR Conversion (Phenoml)", "Converting to FHIR format...");
			const fhirStep = await this.convertToFHIR(analysisStep.data.analysisText);
			steps.push(fhirStep);
			
			if (!fhirStep.success) {
				throw new Error(fhirStep.error);
			}

			// Step 4: Store in Canvas Medical
			this.updateProgress(onProgress, 4, "EHR Storage (Canvas)", "Storing in medical records...");
			const storageStep = await this.storeInCanvas(imageData, analysisStep.data.analysisText, fhirStep.data, patientId);
			steps.push(storageStep);
			
			if (!storageStep.success) {
				throw new Error(storageStep.error);
			}

			// Step 5: Trigger Keragon Workflows
			this.updateProgress(onProgress, 5, "Workflow Automation (Keragon)", "Triggering care team workflows...");
			const workflowStep = await this.triggerKeragonWorkflows(analysisStep.data, patientId);
			steps.push(workflowStep);
			
			if (!workflowStep.success) {
				console.warn("Keragon workflow failed, but continuing:", workflowStep.error);
			}

			const totalDuration = Date.now() - startTime;

			return {
				success: true,
				steps,
				finalData: {
					analysisText: analysisStep.data.analysisText,
					medgemmaAnalysis: analysisStep.data,
					fhirResources: fhirStep.data,
					canvasIds: storageStep.data,
					workflowResults: workflowStep.data
				},
				totalDuration
			};

		} catch (error) {
			const totalDuration = Date.now() - startTime;
			
			return {
				success: false,
				steps,
				error: error instanceof Error ? error.message : "Unknown workflow error",
				totalDuration
			};
		}
	}

	/**
	 * Step 1: Process and validate photo
	 */
	private async processPhoto(imageData: string): Promise<WorkflowStepResult> {
		const stepStart = Date.now();
		
		try {
			// Basic validation
			if (!imageData) {
				throw new Error("No image data provided");
			}

			if (!imageData.startsWith('data:image/')) {
				throw new Error("Invalid image format");
			}

			// Check image size (basic validation)
			const sizeInBytes = (imageData.length * 3) / 4;
			if (sizeInBytes > 10 * 1024 * 1024) { // 10MB limit
				throw new Error("Image too large (max 10MB)");
			}

			return {
				step: "Photo Processing",
				success: true,
				data: { imageData, size: sizeInBytes },
				duration: Date.now() - stepStart
			};
		} catch (error) {
			return {
				step: "Photo Processing",
				success: false,
				error: error instanceof Error ? error.message : "Photo processing failed",
				duration: Date.now() - stepStart
			};
		}
	}

	/**
	 * Step 2: MedGemma AI Analysis
	 */
	private async runMedGemmaAnalysis(imageData: string): Promise<WorkflowStepResult> {
		const stepStart = Date.now();
		
		try {
			const analysisResult = await medgemmaService.analyzeWound({
				imageData,
				patientContext: "Patient presenting with wound for assessment"
			});

			return {
				step: "AI Analysis (MedGemma)",
				success: true,
				data: analysisResult,
				duration: Date.now() - stepStart
			};
		} catch (error) {
			return {
				step: "AI Analysis (MedGemma)",
				success: false,
				error: error instanceof Error ? error.message : "AI analysis failed",
				duration: Date.now() - stepStart
			};
		}
	}

	/**
	 * Step 3: Phenoml FHIR Conversion
	 */
	private async convertToFHIR(analysisText: string): Promise<WorkflowStepResult> {
		const stepStart = Date.now();
		
		try {
			const fhirResult = await phenomlService.convertToFHIR({
				clinicalText: analysisText,
				resourceTypes: ["Observation", "Condition"]
			});

			return {
				step: "FHIR Conversion (Phenoml)",
				success: true,
				data: fhirResult,
				duration: Date.now() - stepStart
			};
		} catch (error) {
			return {
				step: "FHIR Conversion (Phenoml)",
				success: false,
				error: error instanceof Error ? error.message : "FHIR conversion failed",
				duration: Date.now() - stepStart
			};
		}
	}

	/**
	 * Step 4: Canvas Medical Storage
	 */
	private async storeInCanvas(imageData: string, analysisText: string, fhirData: PhenomlResponse, patientId: string): Promise<WorkflowStepResult> {
		const stepStart = Date.now();
		
		try {
			const storageResult = await canvasService.storeWoundAnalysis(
				imageData, 
				analysisText, 
				fhirData, 
				patientId
			);

			if (!storageResult.success) {
				throw new Error(storageResult.error || "Storage failed");
			}

			return {
				step: "EHR Storage (Canvas)",
				success: true,
				data: storageResult.data,
				duration: Date.now() - stepStart
			};
		} catch (error) {
			return {
				step: "EHR Storage (Canvas)",
				success: false,
				error: error instanceof Error ? error.message : "Canvas storage failed",
				duration: Date.now() - stepStart
			};
		}
	}

	/**
	 * Step 5: Trigger Keragon Workflows Based on Risk Assessment
	 */
	private async triggerKeragonWorkflows(medgemmaData: any, patientId: string): Promise<WorkflowStepResult> {
		const stepStart = Date.now();
		
		try {
			// Extract risk assessment from MedGemma analysis
			const infectionRisk = medgemmaData.infectionRisk || 0;
			const severity = medgemmaData.severity || "Unknown";
			const riskFactors = medgemmaData.riskFactors || [];

			// Create wound analysis data for Keragon
			const woundAnalysisData: WoundAnalysisData = {
				patientId,
				woundId: `wound_${Date.now()}`,
				riskLevel: this.determineRiskLevel(infectionRisk, severity),
				infectionRisk,
				healingStage: medgemmaData.healingStage || "Assessment Complete",
				measurements: {
					length: parseFloat(medgemmaData.measurements?.length?.replace(/[^\d.]/g, '') || '0'),
					width: parseFloat(medgemmaData.measurements?.width?.replace(/[^\d.]/g, '') || '0'), 
					depth: parseFloat(medgemmaData.measurements?.depth?.replace(/[^\d.]/g, '') || '0')
				},
				tissueTypes: [medgemmaData.woundType || "Unspecified"],
				recommendations: medgemmaData.recommendations || [],
				imageUrl: "data:image/*", // Placeholder
				analysisTimestamp: new Date().toISOString()
			};

			// Determine workflow type based on infection risk threshold
			let workflowResult;
			if (infectionRisk > 70) {
				console.log(`🚨 High infection risk detected (${infectionRisk}%) - triggering critical workflow`);
				workflowResult = await keragonService.triggerCriticalRiskWorkflow(woundAnalysisData);
			} else {
				console.log(`📋 Standard infection risk (${infectionRisk}%) - triggering standard workflow`);
				workflowResult = await keragonService.triggerStandardCareWorkflow(woundAnalysisData);
			}

			return {
				step: "Workflow Automation (Keragon)",
				success: true,
				data: {
					workflowType: infectionRisk > 70 ? 'critical-risk' : 'standard-care',
					infectionRisk,
					workflowResult,
					riskFactors
				},
				duration: Date.now() - stepStart
			};

		} catch (error) {
			return {
				step: "Workflow Automation (Keragon)",
				success: false,
				error: error instanceof Error ? error.message : "Workflow automation failed",
				duration: Date.now() - stepStart
			};
		}
	}

	/**
	 * Determine risk level based on infection risk and severity
	 */
	private determineRiskLevel(infectionRisk: number, severity: string): 'low' | 'medium' | 'high' | 'critical' {
		if (infectionRisk > 70 || severity.toLowerCase().includes('stage 3') || severity.toLowerCase().includes('stage 4')) {
			return 'critical';
		} else if (infectionRisk > 50 || severity.toLowerCase().includes('stage 2')) {
			return 'high';
		} else if (infectionRisk > 25) {
			return 'medium';
		} else {
			return 'low';
		}
	}

	/**
	 * Update progress callback
	 */
	private updateProgress(onProgress: ((progress: WorkflowProgress) => void) | undefined, currentStep: number, stepName: string, message: string) {
		if (onProgress) {
			onProgress({
				currentStep,
				totalSteps: this.STEPS.length,
				stepName,
				message
			});
		}
	}

	/**
	 * Get workflow step names
	 */
	getSteps(): string[] {
		return [...this.STEPS];
	}

	/**
	 * Check if all services are configured
	 */
	isConfigured(): boolean {
		return medgemmaService.isConfigured() && 
			   phenomlService.isConfigured() && 
			   canvasService.isConfigured();
	}

	/**
	 * Get configuration status for each service
	 */
	getConfigurationStatus(): { [key: string]: boolean } {
		return {
			medgemma: medgemmaService.isConfigured(),
			phenoml: phenomlService.isConfigured(),
			canvas: canvasService.isConfigured()
		};
	}
}

export const woundWorkflowService = new WoundWorkflowService();
