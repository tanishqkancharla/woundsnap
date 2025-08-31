# Woundsnap - AI Wound Care Analysis

**Project:** AI-powered wound analysis with clinical workflow automation
**Goal:** Integrate 6 sponsor APIs for maximum hackathon score 

## Value Proposition
Transform wound photo → complete clinical workflow:
- AI analysis → FHIR-compliant medical documentation → automated care coordination

## Required Sponsor Integrations

### Core (Essential)
1. **Canvas Medical** - FHIR storage and EHR backbone
2. **Google MedGemma** - Medical image analysis  
3. **Phenoml** - Convert AI text to FHIR resources

### Enhanced Workflow  
4. **Keragon** - No-code clinical automation
5. **Metriport** - Patient data aggregation
6. **eKare.ai** - Advanced wound analytics

## Technical Flow
```
Photo → MedGemma AI → Canvas FHIR → Webhooks → [Phenoml + Keragon + Metriport]
```

## Implementation Plan

**Day 1:** Canvas sandbox + MedGemma integration
**Day 2:** Phenoml FHIR conversion + Keragon workflows  
**Day 3:** Metriport integration + demo prep

## Quick Setup Links

- **Canvas:** https://www.canvasmedical.com/emrs/developer-sandbox (OAuth 2.0)
- **Phenoml:** https://developer.pheno.ml/ (14-day free trial)
- **Keragon:** https://www.keragon.com/healthcare-automation (14-day free trial)
- **Metriport:** https://docs.metriport.com/medical-api/getting-started/quickstart (API key)
- **eKare.ai:** Contact via website for hackathon access

## Key APIs

### Canvas Medical
- **Auth:** OAuth 2.0
- **Resources:** Media, Condition, Observation, Task
- **Cost:** Free sandbox, $3,950/month production

### MedGemma 
- **Access:** Google Vertex AI
- **Model:** MedGemma 4B multimodal
- **Cost:** Google Cloud credits

### Phenoml
- **APIs:** Lang2FHIR, Construe, PhenoAgent  
- **Trial:** 14-day free, $50/month production
- **Performance:** 100% success vs 30-60% commercial APIs

### Keragon
- **Features:** 300+ healthcare integrations, no-code workflows
- **Cost:** $99/month starter, 14-day trial

### Metriport
- **Feature:** Patient history aggregation across HIE networks
- **Auth:** API key, FHIR R4 native

## Commands

```bash
npm run dev           # Start development server
npm run test         # Run tests
npm run build        # Build for production
```

## Demo Strategy

1. **Live Demo:** Photo → AI analysis → Canvas storage → Keragon alerts
2. **Backup:** Pre-recorded videos for each vendor
3. **Mock Data:** Sample patients with wound histories

## Pre-Hackathon Setup

- [ ] Create accounts: Canvas, Phenoml, Keragon, Metriport
- [ ] Test basic integrations with sandbox data
- [ ] Prepare sample wound photos for testing
