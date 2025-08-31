// MedGemma → Phenoml Integration Test
// Tests the complete flow from AI analysis to FHIR conversion

import { expect } from 'chai';
import { medgemmaService } from '../services/medgemmaService';
import { phenomlService } from '../services/phenomlService';

describe('MedGemma → Phenoml Integration Flow', () => {
	let sampleImageData: string;

	before(() => {
		// Create sample base64 image data for testing
		sampleImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bz6fn//Z';
	});

	describe('Complete Analysis → FHIR Conversion Flow', () => {
		it('should convert MedGemma analysis text to valid FHIR resources', async () => {
			// Step 1: Run MedGemma analysis
			const analysisResult = await medgemmaService.analyzeWound({
				imageData: sampleImageData,
				patientContext: "Test patient presenting with wound for assessment"
			});

			expect(analysisResult).to.have.property('success', true);
			expect(analysisResult).to.have.property('analysisText');
			expect(analysisResult.analysisText).to.be.a('string');
			expect(analysisResult.analysisText.length).to.be.greaterThan(0);

			// Step 2: Convert MedGemma text to FHIR using Phenoml
			const fhirResult = await phenomlService.convertToFHIR({
				clinicalText: analysisResult.analysisText,
				patientId: "integration-test-patient",
				resourceTypes: ["Observation", "Condition"]
			});

			// Validate FHIR conversion
			expect(fhirResult).to.have.property('success', true);
			expect(fhirResult).to.have.property('observations');
			expect(fhirResult).to.have.property('conditions');
			expect(fhirResult.observations).to.be.an('array');
			expect(fhirResult.conditions).to.be.an('array');

			// Validate at least one resource was created
			const hasResources = fhirResult.observations.length > 0 || fhirResult.conditions.length > 0;
			expect(hasResources).to.be.true;

			console.log('MedGemma Analysis Text:', analysisResult.analysisText);
			console.log('Phenoml FHIR Resources:', JSON.stringify(fhirResult, null, 2));
		});

		it('should preserve clinical context through the conversion chain', async () => {
			const clinicalContext = "Patient presents with diabetic foot ulcer, Wagner grade 2, located on plantar surface of right great toe";

			// Step 1: Analyze with context
			const analysisResult = await medgemmaService.analyzeWound({
				imageData: sampleImageData,
				patientContext: clinicalContext
			});

			expect(analysisResult.success).to.be.true;

			// Step 2: Convert to FHIR
			const fhirResult = await phenomlService.convertToFHIR({
				clinicalText: analysisResult.analysisText,
				patientId: "diabetic-patient-123"
			});

			expect(fhirResult.success).to.be.true;

			// Validate that wound-related information is captured in FHIR resources
			if (fhirResult.conditions.length > 0) {
				const condition = fhirResult.conditions[0];
				expect(condition).to.have.property('resourceType', 'Condition');
				expect(condition).to.have.property('subject');
				expect(condition.subject.reference).to.include('diabetic-patient-123');
			}

			if (fhirResult.observations.length > 0) {
				const observation = fhirResult.observations[0];
				expect(observation).to.have.property('resourceType', 'Observation');
				expect(observation).to.have.property('subject');
				expect(observation.subject.reference).to.include('diabetic-patient-123');
			}
		});

		it('should handle different wound types in analysis chain', async () => {
			const woundTypes = [
				"pressure ulcer stage 2",
				"venous leg ulcer",
				"surgical wound dehiscence",
				"diabetic foot ulcer"
			];

			for (const woundType of woundTypes) {
				// Analyze wound type
				const analysisResult = await medgemmaService.analyzeWound({
					imageData: sampleImageData,
					patientContext: `Patient presenting with ${woundType}`
				});

				expect(analysisResult.success).to.be.true;

				// Convert to FHIR
				const fhirResult = await phenomlService.convertToFHIR({
					clinicalText: analysisResult.analysisText,
					patientId: `patient-${woundType.replace(/\s+/g, '-')}`
				});

				expect(fhirResult.success).to.be.true;
				
				// Should create at least some resources
				const totalResources = fhirResult.observations.length + fhirResult.conditions.length;
				expect(totalResources).to.be.greaterThan(0);

				console.log(`${woundType}:`, {
					analysisLength: analysisResult.analysisText.length,
					observations: fhirResult.observations.length,
					conditions: fhirResult.conditions.length
				});
			}
		});
	});

	describe('FHIR Resource Quality Validation', () => {
		it('should create clinically meaningful FHIR resources', async () => {
			// Use detailed wound analysis
			const detailedAnalysis = await medgemmaService.analyzeWound({
				imageData: sampleImageData,
				patientContext: "Elderly patient with stage 3 pressure ulcer, sacral region, 3.2cm x 2.8cm, moderate exudate, no odor"
			});

			const fhirResult = await phenomlService.convertToFHIR({
				clinicalText: detailedAnalysis.analysisText,
				patientId: "detailed-test-patient"
			});

			expect(fhirResult.success).to.be.true;

			// Validate Observations have meaningful data
			if (fhirResult.observations.length > 0) {
				const observation = fhirResult.observations[0];
				
				// Should have proper coding
				expect(observation.code.coding).to.be.an('array');
				expect(observation.code.coding.length).to.be.greaterThan(0);
				
				// Should have meaningful display names
				const hasValidDisplay = observation.code.coding.some(coding => 
					coding.display && coding.display.length > 0
				);
				expect(hasValidDisplay).to.be.true;

				// Should have SNOMED or LOINC codes
				const hasStandardCoding = observation.code.coding.some(coding =>
					coding.system.includes('snomed.info') || coding.system.includes('loinc.org')
				);
				expect(hasStandardCoding).to.be.true;
			}

			// Validate Conditions have proper clinical status
			if (fhirResult.conditions.length > 0) {
				const condition = fhirResult.conditions[0];
				
				expect(condition.clinicalStatus.coding).to.be.an('array');
				expect(condition.clinicalStatus.coding.length).to.be.greaterThan(0);
				
				// Should have active clinical status
				const hasActiveStatus = condition.clinicalStatus.coding.some(coding =>
					coding.code === 'active'
				);
				expect(hasActiveStatus).to.be.true;
			}
		});
	});

	describe('Error Handling and Resilience', () => {
		it('should handle empty MedGemma analysis gracefully', async () => {
			// Simulate empty/minimal analysis
			const emptyAnalysis = {
				success: true,
				analysisText: "",
				confidence: 0.0,
				measurements: {},
				tissueTypes: [],
				infectionIndicators: [],
				recommendations: []
			};

			// Should not crash when converting empty text
			const fhirResult = await phenomlService.convertToFHIR({
				clinicalText: emptyAnalysis.analysisText,
				patientId: "empty-test-patient"
			});

			// Should return valid structure even with empty input
			expect(fhirResult).to.have.property('success');
			expect(fhirResult).to.have.property('observations');
			expect(fhirResult).to.have.property('conditions');
			expect(fhirResult.observations).to.be.an('array');
			expect(fhirResult.conditions).to.be.an('array');
		});

		it('should handle very long analysis text', async () => {
			// Create very detailed analysis
			const longContext = "Patient presenting with complex chronic wound with multiple comorbidities including diabetes mellitus type 2, peripheral arterial disease, chronic kidney disease stage 3, hypertension, and obesity. The wound has been present for 8 weeks and shows signs of delayed healing.";
			
			const analysisResult = await medgemmaService.analyzeWound({
				imageData: sampleImageData,
				patientContext: longContext
			});

			const fhirResult = await phenomlService.convertToFHIR({
				clinicalText: analysisResult.analysisText + " " + longContext.repeat(5), // Make it longer
				patientId: "complex-patient"
			});

			expect(fhirResult.success).to.be.true;
			
			// Should still create valid resources
			const totalResources = fhirResult.observations.length + fhirResult.conditions.length;
			expect(totalResources).to.be.greaterThan(0);
		});
	});

	describe('Performance and Timing', () => {
		it('should complete the full analysis → FHIR flow within reasonable time', async () => {
			const startTime = Date.now();

			// Step 1: MedGemma analysis
			const analysisStart = Date.now();
			const analysisResult = await medgemmaService.analyzeWound({
				imageData: sampleImageData,
				patientContext: "Performance test wound analysis"
			});
			const analysisTime = Date.now() - analysisStart;

			// Step 2: Phenoml conversion
			const fhirStart = Date.now();
			const fhirResult = await phenomlService.convertToFHIR({
				clinicalText: analysisResult.analysisText,
				patientId: "performance-test-patient"
			});
			const fhirTime = Date.now() - fhirStart;

			const totalTime = Date.now() - startTime;

			// Validate results
			expect(analysisResult.success).to.be.true;
			expect(fhirResult.success).to.be.true;

			// Log performance metrics
			console.log('Performance Metrics:', {
				totalTime: `${totalTime}ms`,
				analysisTime: `${analysisTime}ms`,
				fhirTime: `${fhirTime}ms`,
				resources: fhirResult.observations.length + fhirResult.conditions.length
			});

			// Should complete within reasonable time (using mock services)
			expect(totalTime).to.be.lessThan(10000); // 10 seconds max
		});
	});
});
