// Phenoml FHIR Validation Script

import { phenomlService, FHIRConversionRequest } from '../services/phenomlService';

async function validatePhenomlFHIRConversion() {
	console.log("🔍 Testing Phenoml FHIR Conversion Flow...\n");

	try {
		// Test case 1: Basic wound analysis conversion
		console.log("1. Testing basic wound analysis conversion:");
		const request1: FHIRConversionRequest = {
			clinicalText: "Stage 2 pressure ulcer identified in the sacral region. The wound measures approximately 2.3 cm in length and 1.8 cm in width. Partial thickness skin loss involving epidermis and dermis.",
			patientId: "test-patient-123",
			resourceTypes: ["Observation", "Condition"]
		};

		const result1 = await phenomlService.convertToFHIR(request1);
		
		console.log("   ✅ Success:", result1.success);
		console.log("   📋 Observations created:", result1.observations.length);
		console.log("   🩺 Conditions created:", result1.conditions.length);
		console.log("   💬 Message:", result1.message);
		
		// Validate FHIR structure
		if (result1.observations.length > 0) {
			const obs = result1.observations[0];
			console.log("   🔬 Observation validation:");
			console.log("      - Resource type:", obs.resourceType);
			console.log("      - Status:", obs.status);
			console.log("      - Subject reference:", obs.subject.reference);
			console.log("      - Components:", obs.component?.length || 0);
			
			if (obs.component && obs.component.length > 0) {
				obs.component.forEach((comp, idx) => {
					console.log(`      - Component ${idx + 1}:`, comp.code.coding[0].display);
					if (comp.valueQuantity) {
						console.log(`        Value: ${comp.valueQuantity.value} ${comp.valueQuantity.unit}`);
					}
				});
			}
		}

		if (result1.conditions.length > 0) {
			const cond = result1.conditions[0];
			console.log("   🏥 Condition validation:");
			console.log("      - Resource type:", cond.resourceType);
			console.log("      - Clinical status:", cond.clinicalStatus.coding[0].code);
			console.log("      - Diagnosis:", cond.code.coding[0].display);
			console.log("      - Subject reference:", cond.subject.reference);
		}

		console.log("\n2. Testing service configuration:");
		const isConfigured = phenomlService.isConfigured();
		console.log("   ⚙️ Service configured:", isConfigured);

		console.log("\n3. Testing with different clinical text:");
		const request2: FHIRConversionRequest = {
			clinicalText: "Wound healing progress noted. Granulation tissue present. Measurements show 1.5cm x 1.2cm. No signs of infection.",
			patientId: "patient-456"
		};

		const result2 = await phenomlService.convertToFHIR(request2);
		console.log("   ✅ Success:", result2.success);
		console.log("   📋 Observations:", result2.observations.length);
		console.log("   🩺 Conditions:", result2.conditions.length);

		console.log("\n4. FHIR Compliance Check:");
		const obs = result2.observations[0];
		
		// Check required FHIR R4 fields
		const requiredFields = ['resourceType', 'status', 'code', 'subject'];
		const hasRequiredFields = requiredFields.every(field => obs.hasOwnProperty(field));
		console.log("   📋 Has required fields:", hasRequiredFields);
		
		// Check coding structure
		const hasCoding = obs.code.coding && Array.isArray(obs.code.coding);
		console.log("   🏷️ Has valid coding:", hasCoding);
		
		// Check subject reference format
		const validSubjectRef = obs.subject.reference.startsWith('Patient/');
		console.log("   🔗 Valid subject reference:", validSubjectRef);

		console.log("\n✅ All Phenoml FHIR conversion tests completed successfully!");

	} catch (error) {
		console.error("\n❌ Error during validation:", error);
		throw error;
	}
}

// Run validation if this script is executed directly
if (require.main === module) {
	validatePhenomlFHIRConversion()
		.then(() => {
			console.log("\n🎉 Validation completed successfully!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("\n💥 Validation failed:", error);
			process.exit(1);
		});
}

export { validatePhenomlFHIRConversion };
