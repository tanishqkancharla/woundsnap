// Canvas Medical FHIR API Service

import { canvasAuth } from './canvasAuth';
import { FHIRObservation, FHIRCondition } from './phenomlService';

export interface MediaResource {
	resourceType: "Media";
	status: "completed" | "entered-in-error" | "unknown";
	content: {
		contentType: "image/jpeg" | "image/png";
		data: string; // base64 encoded image
		title?: string;
	};
	subject: {
		reference: string;
	};
	note?: Array<{
		text: string;
	}>;
	createdDateTime?: string;
}

export interface CanvasPatient {
	resourceType: "Patient";
	id: string;
	name: Array<{
		given: string[];
		family: string;
	}>;
	gender: string;
	birthDate: string;
}

export interface CanvasResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	id?: string;
}

class CanvasService {
	private baseUrl: string;

	constructor() {
		this.baseUrl = import.meta.env.VITE_CANVAS_INSTANCE_URL?.replace(/\/$/, '') || "";
	}

	/**
	 * Get base headers with authentication
	 */
	private async getHeaders(): Promise<HeadersInit> {
		const accessToken = await canvasAuth.getValidAccessToken();
		return {
			"Authorization": `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			"Accept": "application/json"
		};
	}

	/**
	 * Create a Media resource for wound photo
	 */
	async createMediaResource(imageData: string, patientId: string, title?: string): Promise<CanvasResponse<MediaResource>> {
		try {
			const mediaResource: MediaResource = {
				resourceType: "Media",
				status: "completed",
				content: {
					contentType: "image/jpeg",
					data: imageData.replace(/^data:image\/jpeg;base64,/, ''), // Remove data URL prefix
					title: title || "Wound photograph"
				},
				subject: {
					reference: `Patient/${patientId}`
				},
				note: [{
					text: "AI-analyzed wound photograph captured via WoundSnap"
				}],
				createdDateTime: new Date().toISOString()
			};

			const response = await fetch(`${this.baseUrl}/api/fhir/Media`, {
				method: "POST",
				headers: await this.getHeaders(),
				body: JSON.stringify(mediaResource)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Canvas Media creation failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			return {
				success: true,
				data: result,
				id: result.id
			};
		} catch (error) {
			console.error("Canvas Media creation error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}

	/**
	 * Create an Observation resource
	 */
	async createObservation(observation: FHIRObservation): Promise<CanvasResponse<FHIRObservation>> {
		try {
			const response = await fetch(`${this.baseUrl}/api/fhir/Observation`, {
				method: "POST",
				headers: await this.getHeaders(),
				body: JSON.stringify(observation)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Canvas Observation creation failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			return {
				success: true,
				data: result,
				id: result.id
			};
		} catch (error) {
			console.error("Canvas Observation creation error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}

	/**
	 * Create a Condition resource
	 */
	async createCondition(condition: FHIRCondition): Promise<CanvasResponse<FHIRCondition>> {
		try {
			const response = await fetch(`${this.baseUrl}/api/fhir/Condition`, {
				method: "POST",
				headers: await this.getHeaders(),
				body: JSON.stringify(condition)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Canvas Condition creation failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			return {
				success: true,
				data: result,
				id: result.id
			};
		} catch (error) {
			console.error("Canvas Condition creation error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}

	/**
	 * Get patient information
	 */
	async getPatient(patientId: string): Promise<CanvasResponse<CanvasPatient>> {
		try {
			const response = await fetch(`${this.baseUrl}/api/fhir/Patient/${patientId}`, {
				method: "GET",
				headers: await this.getHeaders()
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Canvas Patient fetch failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			return {
				success: true,
				data: result
			};
		} catch (error) {
			console.error("Canvas Patient fetch error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}

	/**
	 * Search for patients (simplified)
	 */
	async searchPatients(query?: string): Promise<CanvasResponse<CanvasPatient[]>> {
		try {
			const params = new URLSearchParams();
			if (query) {
				params.append("name", query);
			}
			params.append("_count", "10");

			const response = await fetch(`${this.baseUrl}/api/fhir/Patient?${params.toString()}`, {
				method: "GET",
				headers: await this.getHeaders()
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Canvas Patient search failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			return {
				success: true,
				data: result.entry?.map((entry: any) => entry.resource) || []
			};
		} catch (error) {
			console.error("Canvas Patient search error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}

	/**
	 * Store complete wound analysis workflow
	 */
	async storeWoundAnalysis(imageData: string, analysisText: string, fhirData: { observations: FHIRObservation[], conditions: FHIRCondition[] }, patientId: string = "demo-patient"): Promise<CanvasResponse<any>> {
		try {
			const results: any = {
				mediaId: null,
				observationIds: [],
				conditionIds: []
			};

			// 1. Store the wound photo
			const mediaResult = await this.createMediaResource(imageData, patientId, "AI Wound Analysis");
			if (mediaResult.success) {
				results.mediaId = mediaResult.id;
			}

			// 2. Store observations
			for (const observation of fhirData.observations) {
				const obsResult = await this.createObservation(observation);
				if (obsResult.success) {
					results.observationIds.push(obsResult.id);
				}
			}

			// 3. Store conditions
			for (const condition of fhirData.conditions) {
				const condResult = await this.createCondition(condition);
				if (condResult.success) {
					results.conditionIds.push(condResult.id);
				}
			}

			return {
				success: true,
				data: results
			};
		} catch (error) {
			console.error("Canvas wound analysis storage error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}

	/**
	 * Check if service is properly configured
	 */
	isConfigured(): boolean {
		return !!(this.baseUrl && canvasAuth.isConfigured());
	}
}

export const canvasService = new CanvasService();
