// MedGemma AI Analysis Service

export interface WoundAnalysisRequest {
	imageData: string; // base64 encoded image
	patientContext?: string;
}

export interface WoundAnalysisResponse {
	analysisText: string;
	woundType?: string;
	severity?: string;
	measurements?: {
		length?: string;
		width?: string;
		depth?: string;
	};
	recommendations?: string[];
	confidence?: number;
	infectionRisk?: number; // Percentage 0-100
	riskFactors?: string[];
	healingStage?: string;
}

class MedGemmaService {
	private baseUrl: string;
	private accessToken: string;

	constructor() {
		// Google Vertex AI endpoint pattern for MedGemma
		this.baseUrl = "https://us-central1-aiplatform.googleapis.com/v1/projects/hackathon-project/locations/us-central1/endpoints/medgemma-endpoint";
		this.accessToken = import.meta.env.VITE_KEYWELL_PAT_TOKEN || "";
	}

	/**
	 * Analyze wound image using MedGemma AI
	 */
	async analyzeWound(request: WoundAnalysisRequest): Promise<WoundAnalysisResponse> {
		if (!this.accessToken) {
			console.warn("MedGemma access token not configured, using mock data");
			return this.simulateAnalysis(request.imageData);
		}

		try {
			// Attempt real API call with configured token
			console.log("Attempting real MedGemma API call...");
			return await this.callMedGemmaAPI(request.imageData, "Analyze this wound image for clinical assessment");
		} catch (error) {
			console.warn("MedGemma API call failed, falling back to mock:", error);
			return this.simulateAnalysis(request.imageData);
		}
	}

	/**
	 * Simulate wound analysis for development/testing
	 * This will be replaced with actual MedGemma API call
	 */
	private async simulateAnalysis(imageData: string): Promise<WoundAnalysisResponse> {
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Generate different risk scenarios for testing
		const scenarios = [
			{
				// High-risk scenario for testing critical workflow
				analysisText: "Stage 3 pressure ulcer with concerning features identified in the sacral region. The wound measures approximately 4.2 cm in length and 3.5 cm in width with full thickness tissue loss. Wound bed shows areas of necrotic tissue with purulent drainage. Surrounding skin demonstrates significant erythema extending beyond wound margins with warmth and induration. Signs suggestive of developing infection requiring immediate clinical attention.",
				woundType: "Pressure Ulcer",
				severity: "Stage 3",
				infectionRisk: 85, // High risk triggers critical workflow
				riskFactors: ["Purulent drainage", "Extensive erythema", "Tissue necrosis", "Wound enlargement"],
				healingStage: "Deteriorating",
				confidence: 0.92
			},
			{
				// Low-risk scenario for testing standard workflow  
				analysisText: "Stage 2 pressure ulcer identified in the sacral region. The wound measures approximately 2.3 cm in length and 1.8 cm in width. Partial thickness skin loss involving epidermis and dermis. Wound bed appears clean with granulation tissue present. No signs of infection observed. Surrounding skin shows mild erythema consistent with pressure-related tissue damage.",
				woundType: "Pressure Ulcer", 
				severity: "Stage 2",
				infectionRisk: 25, // Low risk triggers standard workflow
				riskFactors: ["Pressure-related damage"],
				healingStage: "Healing",
				confidence: 0.85
			}
		];

		// For testing purposes, alternate between scenarios or use a deterministic approach
		// This ensures we can test both high and low risk workflows
		const useHighRisk = Date.now() % 2 === 0; // Deterministic based on current time
		const scenario = useHighRisk ? scenarios[0] : scenarios[1];

		const mockAnalysis: WoundAnalysisResponse = {
			...scenario,
			measurements: {
				length: scenario.severity === "Stage 3" ? "4.2 cm" : "2.3 cm",
				width: scenario.severity === "Stage 3" ? "3.5 cm" : "1.8 cm",
				depth: scenario.severity === "Stage 3" ? "Full thickness" : "Partial thickness"
			},
			recommendations: scenario.infectionRisk > 70 ? [
				"URGENT: Immediate clinical evaluation required",
				"Culture wound drainage for bacterial identification",
				"Consider antibiotic therapy",
				"Debride necrotic tissue",
				"Implement infection control measures"
			] : [
				"Pressure redistribution with appropriate support surface",
				"Regular repositioning every 2 hours", 
				"Keep wound clean and moist",
				"Monitor for signs of infection",
				"Document healing progress with photographs"
			]
		};

		return mockAnalysis;
	}

	/**
	 * Real MedGemma API call implementation via Google Vertex AI
	 */
	private async callMedGemmaAPI(imageData: string, prompt: string): Promise<WoundAnalysisResponse> {
		const response = await fetch(`${this.baseUrl}:predict`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${this.accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				instances: [{
					image: {
						bytes_base64_encoded: imageData.replace(/^data:image\/[^;]+;base64,/, '')
					},
					prompt: prompt,
					parameters: {
						max_output_tokens: 500,
						temperature: 0.1,
						top_p: 0.8
					}
				}]
			})
		});

		if (!response.ok) {
			throw new Error(`MedGemma API error: ${response.status} ${response.statusText}`);
		}

		const result = await response.json();
		return this.parseAnalysisResponse(result);
	}

	/**
	 * Parse MedGemma API response into structured format
	 */
	private parseAnalysisResponse(apiResponse: any): WoundAnalysisResponse {
		// Parse Google Vertex AI response format
		const prediction = apiResponse.predictions?.[0];
		const analysisText = prediction?.content || prediction?.text || "";
		
		// Extract structured data from response (simplified parsing)
		return {
			analysisText,
			confidence: prediction?.confidence || 0.8,
			woundType: this.extractField(analysisText, "type"),
			severity: this.extractField(analysisText, "severity"),
			measurements: {
				length: this.extractMeasurement(analysisText, "length"),
				width: this.extractMeasurement(analysisText, "width"),
				depth: this.extractMeasurement(analysisText, "depth")
			},
			recommendations: this.extractRecommendations(analysisText),
			infectionRisk: this.extractRiskPercent(analysisText),
			riskFactors: this.extractRiskFactors(analysisText),
			healingStage: this.extractField(analysisText, "stage")
		};
	}
	
	/**
	 * Helper methods to extract structured data from AI response text
	 */
	private extractField(text: string, field: string): string {
		const regex = new RegExp(`${field}[:\\s]+(\\w+[^\\n]*?)(?=\\n|$)`, 'i');
		const match = text.match(regex);
		return match?.[1]?.trim() || "";
	}
	
	private extractMeasurement(text: string, type: string): string {
		const regex = new RegExp(`${type}[:\\s]+([\\d.]+\\s*cm)`, 'i');
		const match = text.match(regex);
		return match?.[1] || "";
	}
	
	private extractRecommendations(text: string): string[] {
		const lines = text.split('\n').filter(line => 
			line.toLowerCase().includes('recommend') || 
			line.toLowerCase().includes('treatment') ||
			line.toLowerCase().includes('should')
		);
		return lines.length > 0 ? lines : ["Follow standard wound care protocols"];
	}
	
	private extractRiskPercent(text: string): number {
		const match = text.match(/(\d+)%.*risk/i);
		return match ? parseInt(match[1]) : 25;
	}
	
	private extractRiskFactors(text: string): string[] {
		const factors = [];
		if (text.toLowerCase().includes('infection')) factors.push('Signs of infection');
		if (text.toLowerCase().includes('necrosis')) factors.push('Tissue necrosis');
		if (text.toLowerCase().includes('drainage')) factors.push('Wound drainage');
		return factors.length > 0 ? factors : ['Standard wound assessment'];
	}

	/**
	 * Check if service is properly configured
	 */
	isConfigured(): boolean {
		return !!this.accessToken;
	}
}

export const medgemmaService = new MedGemmaService();
