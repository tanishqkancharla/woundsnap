// Phenoml FHIR Conversion Service Tests

import { expect } from 'chai';
import { phenomlService, FHIRConversionRequest, FHIRObservation, FHIRCondition } from '../services/phenomlService';

describe('PhenomlService FHIR Conversion', () => {
	describe('Mock FHIR Conversion', () => {
		it('should convert clinical text to valid FHIR Observation resources', async () => {
			const request: FHIRConversionRequest = {
				clinicalText: "Stage 2 pressure ulcer identified in the sacral region. The wound measures approximately 2.3 cm in length and 1.8 cm in width. Partial thickness skin loss involving epidermis and dermis.",
				patientId: "test-patient-123",
				resourceTypes: ["Observation", "Condition"]
			};

			const result = await phenomlService.convertToFHIR(request);

			// Validate response structure
			expect(result).to.have.property('success', true);
			expect(result).to.have.property('observations');
			expect(result).to.have.property('conditions');
			expect(result).to.have.property('message');

			// Validate FHIR Observation structure
			expect(result.observations).to.be.an('array');
			expect(result.observations).to.have.length.greaterThan(0);

			const observation = result.observations[0];
			expect(observation).to.have.property('resourceType', 'Observation');
			expect(observation).to.have.property('status');
			expect(['final', 'preliminary', 'registered']).to.include(observation.status);
			expect(observation).to.have.property('code');
			expect(observation.code).to.have.property('coding');
			expect(observation.code.coding).to.be.an('array');
			expect(observation).to.have.property('subject');
			expect(observation.subject).to.have.property('reference', 'Patient/test-patient-123');
		});

		it('should create FHIR Observation with wound measurements', async () => {
			const request: FHIRConversionRequest = {
				clinicalText: "Wound measurement: 2.3cm length, 1.8cm width",
				patientId: "test-patient-123"
			};

			const result = await phenomlService.convertToFHIR(request);

			expect(result.success).to.be.true;
			
			const observation = result.observations[0];
			expect(observation).to.have.property('component');
			expect(observation.component).to.be.an('array');
			expect(observation.component).to.have.length.greaterThan(0);

			// Check for length measurement component
			const lengthComponent = observation.component?.find(comp => 
				comp.code.coding.some(coding => coding.display.includes('Length'))
			);
			expect(lengthComponent).to.exist;
			expect(lengthComponent?.valueQuantity).to.have.property('value', 2.3);
			expect(lengthComponent?.valueQuantity).to.have.property('unit', 'cm');

			// Check for width measurement component  
			const widthComponent = observation.component?.find(comp =>
				comp.code.coding.some(coding => coding.display.includes('Width'))
			);
			expect(widthComponent).to.exist;
			expect(widthComponent?.valueQuantity).to.have.property('value', 1.8);
			expect(widthComponent?.valueQuantity).to.have.property('unit', 'cm');
		});

		it('should create FHIR Condition resources for wound diagnoses', async () => {
			const request: FHIRConversionRequest = {
				clinicalText: "Stage 2 pressure ulcer diagnosed",
				patientId: "test-patient-123"
			};

			const result = await phenomlService.convertToFHIR(request);

			expect(result.success).to.be.true;
			expect(result.conditions).to.be.an('array');
			expect(result.conditions).to.have.length.greaterThan(0);

			const condition = result.conditions[0];
			expect(condition).to.have.property('resourceType', 'Condition');
			expect(condition).to.have.property('clinicalStatus');
			expect(condition.clinicalStatus).to.have.property('coding');
			expect(condition).to.have.property('code');
			expect(condition.code).to.have.property('coding');
			expect(condition).to.have.property('subject');
			expect(condition.subject).to.have.property('reference', 'Patient/test-patient-123');
		});

		it('should handle SNOMED CT coding properly', async () => {
			const request: FHIRConversionRequest = {
				clinicalText: "Pressure ulcer stage 2",
				patientId: "test-patient"
			};

			const result = await phenomlService.convertToFHIR(request);
			
			// Check for SNOMED CT codes in conditions
			if (result.conditions.length > 0) {
				const condition = result.conditions[0];
				const snomedCoding = condition.code.coding.find(coding => 
					coding.system === 'http://snomed.info/sct'
				);
				expect(snomedCoding).to.exist;
				expect(snomedCoding?.code).to.be.a('string');
				expect(snomedCoding?.display).to.be.a('string');
			}

			// Check for SNOMED CT codes in observations  
			if (result.observations.length > 0) {
				const observation = result.observations[0];
				if (observation.component) {
					observation.component.forEach(comp => {
						const snomedCoding = comp.code.coding.find(coding =>
							coding.system === 'http://snomed.info/sct'
						);
						if (snomedCoding) {
							expect(snomedCoding.code).to.be.a('string');
							expect(snomedCoding.display).to.be.a('string');
						}
					});
				}
			}
		});

		it('should handle errors gracefully', async () => {
			const request: FHIRConversionRequest = {
				clinicalText: "",
				patientId: ""
			};

			try {
				const result = await phenomlService.convertToFHIR(request);
				// Even with empty input, should return valid structure
				expect(result).to.have.property('success');
				expect(result).to.have.property('observations');
				expect(result).to.have.property('conditions');
			} catch (error) {
				// If it throws, make sure it's a proper error
				expect(error).to.be.an('error');
			}
		});
	});

	describe('Service Configuration', () => {
		it('should report configuration status correctly', () => {
			const isConfigured = phenomlService.isConfigured();
			// Should be a boolean
			expect(typeof isConfigured).to.equal('boolean');
		});
	});

	describe('FHIR Resource Validation', () => {
		it('should create compliant FHIR R4 structure', async () => {
			const request: FHIRConversionRequest = {
				clinicalText: "Test wound analysis",
				patientId: "patient-123"
			};

			const result = await phenomlService.convertToFHIR(request);

			// Validate FHIR R4 compliance
			result.observations.forEach((obs: FHIRObservation) => {
				// Required fields for FHIR R4 Observation
				expect(obs).to.have.property('resourceType', 'Observation');
				expect(obs).to.have.property('status');
				expect(obs).to.have.property('code');
				expect(obs).to.have.property('subject');
				
				// Validate coding structure
				expect(obs.code.coding).to.be.an('array');
				obs.code.coding.forEach(coding => {
					expect(coding).to.have.property('system');
					expect(coding).to.have.property('code');
					expect(coding).to.have.property('display');
				});

				// Validate subject reference format
				expect(obs.subject.reference).to.match(/^Patient\/.*$/);
			});

			result.conditions.forEach((cond: FHIRCondition) => {
				// Required fields for FHIR R4 Condition
				expect(cond).to.have.property('resourceType', 'Condition');
				expect(cond).to.have.property('clinicalStatus');
				expect(cond).to.have.property('code');
				expect(cond).to.have.property('subject');

				// Validate subject reference format
				expect(cond.subject.reference).to.match(/^Patient\/.*$/);
			});
		});
	});
});
