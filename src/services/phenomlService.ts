// Phenoml Lang2FHIR Service

export interface FHIRConversionRequest {
	clinicalText: string;
	patientId?: string;
	resourceTypes?: string[];
}

export interface FHIRObservation {
	resourceType: "Observation";
	status: "final" | "preliminary" | "registered";
	code: {
		coding: Array<{
			system: string;
			code: string;
			display: string;
		}>;
	};
	subject: {
		reference: string;
	};
	valueString?: string;
	component?: Array<{
		code: {
			coding: Array<{
				system: string;
				code: string;
				display: string;
			}>;
		};
		valueQuantity?: {
			value: number;
			unit: string;
		};
		valueString?: string;
	}>;
}

export interface FHIRCondition {
	resourceType: "Condition";
	clinicalStatus: {
		coding: Array<{
			system: string;
			code: string;
		}>;
	};
	code: {
		coding: Array<{
			system: string;
			code: string;
			display: string;
		}>;
	};
	subject: {
		reference: string;
	};
	onset?: {
		dateTime: string;
	};
}

export interface PhenomlResponse {
	observations: FHIRObservation[];
	conditions: FHIRCondition[];
	success: boolean;
	message?: string;
}

class PhenomlService {
	private baseUrl: string;
	private email: string;
	private password: string;
	private accessToken: string | null = null;

	constructor() {
		this.baseUrl = process.env.PHENOML_API_BASE_URL || "https://phenoml-hackathon.app.pheno.ml";
		this.email = process.env.PHENOML_EMAIL || "";
		this.password = process.env.PHENOML_PASSWORD || "";
	}

	/**
	 * Authenticate with Phenoml API
	 */
	async authenticate(): Promise<void> {
		if (!this.email || !this.password) {
			throw new Error("Phenoml credentials not configured");
		}

		try {
			const credentials = btoa(`${this.email}:${this.password}`);
			const response = await fetch(`${this.baseUrl}/auth/token`, {
				method: "POST",
				headers: {
					"Authorization": `Basic ${credentials}`
				}
			});

			if (!response.ok) {
				throw new Error(`Phenoml authentication failed: ${response.status}`);
			}

			const result = await response.json();
			this.accessToken = result.token;
		} catch (error) {
			console.error("Phenoml authentication error:", error);
			throw error;
		}
	}

	/**
	 * Convert clinical text to FHIR resources using Lang2FHIR
	 */
	async convertToFHIR(request: FHIRConversionRequest): Promise<PhenomlResponse> {
		if (!this.accessToken) {
			await this.authenticate();
		}

		try {
			// Use real API if credentials are configured, otherwise simulate
			if (this.email && this.password) {
				return this.callLang2FHIR(request);
			} else {
				return this.simulateConversion(request);
			}
		} catch (error) {
			console.error("Phenoml FHIR conversion error:", error);
			throw error;
		}
	}

	/**
	 * Simulate FHIR conversion for development/testing
	 * This will be replaced with actual Lang2FHIR API call
	 */
	private async simulateConversion(request: FHIRConversionRequest): Promise<PhenomlResponse> {
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 1500));

		const patientRef = request.patientId ? `Patient/${request.patientId}` : "Patient/example-patient";

		// Generate mock FHIR resources based on clinical text
		const observations: FHIRObservation[] = [
			{
				resourceType: "Observation",
				status: "final",
				code: {
					coding: [{
						system: "http://loinc.org",
						code: "39156-5",
						display: "Body mass index (BMI) [Ratio]"
					}]
				},
				subject: {
					reference: patientRef
				},
				valueString: "Wound measurement and assessment completed",
				component: [
					{
						code: {
							coding: [{
								system: "http://snomed.info/sct",
								code: "401238003",
								display: "Length of wound"
							}]
						},
						valueQuantity: {
							value: 2.3,
							unit: "cm"
						}
					},
					{
						code: {
							coding: [{
								system: "http://snomed.info/sct",
								code: "401239006", 
								display: "Width of wound"
							}]
						},
						valueQuantity: {
							value: 1.8,
							unit: "cm"
						}
					}
				]
			}
		];

		const conditions: FHIRCondition[] = [
			{
				resourceType: "Condition",
				clinicalStatus: {
					coding: [{
						system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
						code: "active"
					}]
				},
				code: {
					coding: [{
						system: "http://snomed.info/sct",
						code: "421076008",
						display: "Pressure ulcer stage 2"
					}]
				},
				subject: {
					reference: patientRef
				},
				onset: {
					dateTime: new Date().toISOString()
				}
			}
		];

		return {
			observations,
			conditions,
			success: true,
			message: "FHIR conversion completed successfully"
		};
	}

	/**
	 * Real Lang2FHIR API call implementation
	 */
	private async callLang2FHIR(request: FHIRConversionRequest): Promise<PhenomlResponse> {
		const response = await fetch(`${this.baseUrl}/lang2fhir/create`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${this.accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				text: request.clinicalText,
				version: "1.0",
				resource: "Observation"
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Lang2FHIR API error ${response.status}:`, errorText);
			throw new Error(`Lang2FHIR API error: ${response.status} ${response.statusText}`);
		}

		const result = await response.json();
		console.log("Phenoml API response:", result);
		
		// Phenoml returns a single FHIR resource, wrap it in arrays
		const observations = result.resourceType === "Observation" ? [result] : [];
		const conditions = result.resourceType === "Condition" ? [result] : [];
		
		return {
			observations,
			conditions,
			success: true,
			message: "FHIR conversion completed successfully"
		};
	}

	/**
	 * Check if service is properly configured
	 */
	isConfigured(): boolean {
		return !!(this.baseUrl && this.email && this.password);
	}
}

export const phenomlService = new PhenomlService();
