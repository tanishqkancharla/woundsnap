# Phenoml 14-Day Free Trial Setup

## Research Summary

**What is Phenoml?**
- Healthcare AI developer platform for building workflows, agents, and applications
- Provides AI-native healthcare APIs and tools
- Integrates with EHRs and FHIR servers including Canvas Medical sandbox
- Offers medical code extraction capabilities
- Available in Python and Java SDKs

**Key APIs for WoundSnap:**
- **Lang2FHIR API**: Converts natural language to FHIR resources (perfect for clinical notes)
- **Construe API**: Medical code extraction (SNOMED, ICD-10)
- **PhenoAgent**: AI agents for healthcare workflows
- **PhenoTools**: Additional healthcare-specific tools

**Pricing & Trial:**
- Experiment Plan: $50/mo with 14-day free trial
- Includes Lang2FHIR API, Construe API, Non-PHI data
- Target: Researchers, students, hobby projects
- Sign up at: https://www.phenoml.com/pricing

**Integration Points for WoundSnap:**
1. **Text-to-FHIR conversion**: Convert wound assessment notes to structured FHIR
2. **Medical coding**: Extract SNOMED/ICD-10 codes from clinical descriptions
3. **Clinical note structuring**: Organize unstructured wound data
4. **FHIR validation**: Ensure proper FHIR resource formatting

## Task Execution

**Status**: ⏳ In Progress - Located signup form but requires payment card

**Steps Taken**:
1. Researched Phenoml platform and capabilities
2. Identified relevant APIs for wound care workflow  
3. Visited https://www.phenoml.com/pricing
4. Selected "Experiment" plan with 14-day free trial
5. Reached Stripe checkout form at https://billing.phenoml.com/b/28o4hvadfdJI06I9AF

**Current Situation**:
- Successfully navigated to the signup form
- Form shows 14-day free trial with $50/month after trial ends
- Requires credit card information to start trial (typical for SaaS)
- Cannot proceed without actual payment information

**API Keys & Setup**:
- Account signup pending payment card entry
- API keys will be provided after account creation
- Documentation available at: [Phenoml Developer Docs](https://docs.phenoml.com)

**Next Steps for Integration**:
1. Add Phenoml API keys to .env file
2. Install Python SDK: `pip install phenoml`
3. Set up Lang2FHIR for converting wound assessment text to FHIR resources
4. Configure Construe API for medical code extraction
5. Test API integration with sample wound data

## Progress

✅ Research completed
✅ Located signup form and understood pricing
⏳ Account creation (blocked - requires payment card)
⏳ Trial activation (blocked - requires payment card)
⏳ Environment variables setup (pending account creation)
⏳ SDK installation (part of broader project setup)
⏳ API integration development (future task)

## Blockers

**Payment Card Required**: The signup process requires entering credit card information to start the free trial. This is standard for SaaS services but blocks automation. A human user needs to complete this step manually.

**Workaround**: For development purposes, the team could:
1. Use mock data/stubs for Phenoml API calls initially
2. Have someone manually complete the signup with their payment card
3. Check if there are alternative access methods for hackathon participants
