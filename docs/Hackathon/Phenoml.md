# Phenoml Research Report for Woundsnap

## Executive Summary

Phenoml is a healthcare AI platform that bridges natural language processing with FHIR (Fast Healthcare Interoperability Resources) standards. Their platform offers three core APIs that could significantly enhance Woundsnap's wound analysis capabilities by converting unstructured clinical data into structured FHIR resources and enabling AI-powered clinical documentation.

## Company Overview

**Website:** https://www.phenoml.com/
**Developer Portal:** https://developer.pheno.ml/
**Mission:** "FHIR tools for devs using LLM" - making healthcare AI applications accessible through structured data conversion

Phenoml positions itself as the bridge between Large Language Models (LLMs) and healthcare interoperability standards, specifically focusing on transforming unstructured healthcare language into structured FHIR resources.

## Core FHIR + LLM Integration Tools

### 1. Lang2FHIR API
**Purpose:** Transforms unstructured healthcare language into FHIR resources

**Key Capabilities:**
- Converts physician notes, patient intake forms, call transcripts, and secure messages into structured FHIR resources
- Enables natural language searches converted to FHIR queries (e.g., "Find next available appointment" → `Appointment?status=available`)
- Facilitates structured FHIR search queries for patient cohort analysis
- **Performance:** Claims 100% success rate vs 30-60% for commercial APIs
- Better latency than Anthropic and OpenAI

**Woundsnap Integration Potential:**
- Convert wound descriptions into structured FHIR Observation/Condition resources
- Transform AI analysis results into standardized clinical formats
- Enable natural language queries about wound history and treatment outcomes

### 2. Construe API
**Purpose:** Medical Retrieval-Augmented Generation (RAG) system for data extraction

**Key Capabilities:**
- Extracts structured medical codes (SNOMED, ICD, LOINC, custom vocabularies)
- Defines and queries patient cohorts from natural language descriptions
- Automatically generates FHIR search queries and SQL queries
- Configurable medical knowledge base

**Woundsnap Integration Potential:**
- Extract wound-specific medical codes from AI analysis
- Categorize wound types, stages, and treatments automatically
- Generate cohort queries for similar wound cases
- Support research and quality improvement initiatives

### 3. PhenoAgent API
**Purpose:** Healthcare AI agents and assistants with healthcare context understanding

**Key Capabilities:**
- Real-time interaction with patient data and system context
- Leverages Lang2FHIR and Construe APIs for comprehensive language processing
- Integrates with existing healthcare systems (Medplum, Google Healthcare, Canvas, HAPI)
- Coming soon: EPIC, Cerner, Athena Health, Elation, Healthie

**Woundsnap Integration Potential:**
- Create AI-powered clinical assistants for wound care
- Enable conversational interfaces for wound documentation
- Integrate with existing EHR systems for seamless workflow

## Specific APIs for Wound Analysis

### Medical Code Extraction
- **SNOMED CT codes** for wound types, locations, and characteristics
- **ICD-10 codes** for wound classifications and complications
- **LOINC codes** for wound measurements and assessments
- **Custom vocabularies** for specialized wound care terminology

### Clinical Documentation Enhancement
- Convert Woundsnap's AI analysis into structured clinical notes
- Generate FHIR-compliant wound assessment resources
- Create standardized wound care plans and recommendations
- Track wound healing progress through structured data

### Integration Architecture
```
Woundsnap Photo Analysis → Lang2FHIR API → FHIR Observation Resources
                        ↓
                    Construe API → Medical Codes (SNOMED/ICD/LOINC)
                        ↓
                   PhenoAgent API → Clinical Decision Support
```

## Healthcare System Integrations

**Currently Supported:**
- Medplum (FHIR-native platform)
- Google Healthcare API
- Canvas Medical
- HAPI FHIR Server

**Coming Soon:**
- EPIC
- Cerner
- Athena Health
- Elation
- Healthie

## Pricing Structure

### Experiment Plan - $50/month
- **Target:** Researchers, students, hobby projects
- **Features:** Construe API, Lang2FHIR API
- **Limitation:** Non-PHI only
- **Trial:** 14-day free trial
- **Best for:** Woundsnap prototype development and hackathon

### Core Plan - $500/month + usage
- **Target:** Production applications
- **Features:** PhenoAgent, Lang2FHIR API (custom IG support), Construe API (custom coding), PhenoTools
- **Compliance:** HIPAA compliant
- **Additional instances:** $500 each
- **Coming:** Private LLM support

### Enterprise Plan - Contact for pricing
- **Features:** Self-hosted (GCP), multiple dedicated instances
- **Security:** HIPAA compliant, built-in privacy, fully modular
- **Customization:** Tailored solutions

## Technical Requirements

### Authentication
- API key-based authentication (inferred from developer portal structure)
- HIPAA-compliant security measures for PHI handling

### API Limits
- Not explicitly specified in public documentation
- Likely usage-based pricing model for production plans

### Development Resources
- **Developer Portal:** https://developer.pheno.ml/
- **API Reference:** Available through developer portal
- **Code Examples:** Sample code available via GitHub repository
- **HL7 Course:** Sponsored agent development course (Oct. 21-22)

## Woundsnap Integration Strategy

### Phase 1: Prototype (Experiment Plan)
1. Use Lang2FHIR to convert wound analysis into FHIR Observation resources
2. Implement Construe API for medical code extraction from wound descriptions
3. Create structured wound documentation pipeline

### Phase 2: Production (Core Plan)
1. Integrate PhenoAgent for AI-powered clinical assistants
2. Enable EHR system integration for seamless workflow
3. Implement HIPAA-compliant wound data management

### Phase 3: Scale (Enterprise Plan)
1. Self-hosted deployment for maximum security
2. Custom medical vocabularies for specialized wound care
3. Private LLM integration for enhanced privacy

## Developer Program and Hackathon Resources

### Educational Resources
- **HL7-Sponsored Course:** Only healthcare AI startup with official HL7 agent course
- **Documentation:** Comprehensive API reference and integration guides
- **Code Examples:** GitHub repository with sample implementations

### Hackathon Benefits
- **14-day free trial** perfect for hackathon timeline
- **Experiment plan** pricing accessible for student/researcher projects
- **API-first approach** enables rapid prototyping
- **FHIR compliance** adds clinical validity to hackathon projects

## Competitive Advantages

1. **Performance:** 100% success rate vs 30-60% for commercial APIs
2. **Healthcare Focus:** Purpose-built for medical applications
3. **Standards Compliance:** Deep FHIR integration and HL7 support
4. **Integration Ready:** Pre-built connectors for major EHR systems
5. **Developer-Friendly:** Comprehensive API documentation and examples

## Risks and Considerations

1. **Pricing:** $500/month minimum for production with PHI
2. **Vendor Lock-in:** Proprietary APIs may create dependency
3. **Limited Examples:** No specific wound care use cases documented
4. **Integration Complexity:** EHR integration may require significant development
5. **Data Privacy:** PHI handling requires careful compliance management

## Recommendations for Woundsnap

### Immediate Actions (Hackathon)
1. **Sign up** for Experiment plan 14-day free trial
2. **Test Lang2FHIR** with sample wound descriptions
3. **Experiment with Construe** for medical code extraction
4. **Prototype** FHIR Observation resource creation from wound analysis

### Medium-term Strategy
1. **Evaluate** Core plan for production deployment
2. **Integrate** with Medplum or Canvas Medical for EHR connectivity
3. **Develop** PhenoAgent-powered clinical assistants
4. **Establish** HIPAA compliance framework

### Long-term Vision
1. **Consider Enterprise** plan for scalable, secure deployment
2. **Implement** custom medical vocabularies for wound care
3. **Integrate** with major EHR systems (EPIC, Cerner)
4. **Develop** comprehensive wound care AI ecosystem

## Conclusion

Phenoml offers a compelling platform for enhancing Woundsnap's clinical capabilities through structured data conversion and FHIR compliance. Their APIs could transform Woundsnap from a simple wound analysis tool into a comprehensive clinical documentation and decision support system. The 14-day free trial provides an excellent opportunity to evaluate the platform's capabilities during the hackathon phase.

The combination of Lang2FHIR, Construe, and PhenoAgent APIs offers a complete toolkit for building healthcare AI applications that integrate seamlessly with existing clinical workflows. For Woundsnap, this could mean the difference between a demonstration app and a production-ready clinical tool that healthcare providers can actually adopt and integrate into their practice.
