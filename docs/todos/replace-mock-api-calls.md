# Replace Mock API Implementations with Real API Calls

## Overview

Currently all 6 sponsor APIs (MedGemma, Canvas, Phenoml, Keragon, Metriport, eKare.ai) are using mock data implementations. This task involves switching to real API calls where credentials and endpoints are available.

## Current State Analysis

### 1. MedGemma (Google Health AI) - `src/services/medgemmaService.ts`
- **Status:** Mock implementation only
- **Issue:** Using placeholder endpoint `https://api.example.com/medgemma`
- **Credentials:** `VITE_KEYWELL_PAT_TOKEN` available
- **Real Implementation:** Stub exists in `callMedGemmaAPI()` method
- **Needs:** Real Keywell/Google Vertex AI endpoint configuration

### 2. Canvas Medical (EHR/FHIR) - `src/services/canvasService.ts`
- **Status:** Real implementation exists with mock fallback
- **Implementation:** OAuth 2.0 + FHIR R4 API calls ready
- **Credentials:** `VITE_CANVAS_CLIENT_ID`, `VITE_CANVAS_CLIENT_SECRET`, `VITE_CANVAS_INSTANCE_URL`
- **Behavior:** Auto-falls back to mock in demo mode
- **Action:** Should work with real credentials if properly configured

### 3. Phenoml (Lang2FHIR) - `src/services/phenomlService.ts` 
- **Status:** Real implementation exists with mock fallback
- **Endpoint:** `https://phenoml-hackathon.app.pheno.ml`
- **Credentials:** `VITE_PHENOML_EMAIL`, `VITE_PHENOML_PASSWORD`
- **Implementation:** `callLang2FHIR()` method ready
- **Action:** Should work with real credentials if available

### 4. Keragon (Workflow Automation) - `src/services/keragonService.ts`
- **Status:** Mock implementation only (webhook-based)
- **Credentials:** Webhook URLs: `VITE_KERAGON_CRITICAL_WEBHOOK_URL`, etc.
- **Issue:** Requires manual workflow configuration in Keragon web platform
- **Action:** Need webhook URLs to trigger real workflows

### 5. Metriport (Patient Data) - `src/services/metriportService.ts`
- **Status:** Real implementation exists with mock fallback  
- **Endpoint:** `https://api.sandbox.metriport.com`
- **Credentials:** `VITE_METRIPORT_API_KEY`
- **Action:** Should work with real API key if available

### 6. eKare.ai (Advanced Analytics) - `src/services/ekareService.ts`
- **Status:** Mock implementation only
- **Issue:** Using placeholder endpoint `https://api.ekare.ai/v1`
- **Credentials:** None configured (requires direct contact with eKare)
- **Action:** Need real endpoint and API key

## Implementation Plan

### Phase 1: Enable Existing Real APIs
1. **Test Canvas API integration** - verify OAuth and FHIR calls work with real credentials
2. **Test Phenoml API integration** - verify Lang2FHIR conversion works
3. **Test Metriport API integration** - verify patient data retrieval works

### Phase 2: Research Missing Endpoints  
1. **Research MedGemma/Keywell integration** - find correct endpoint for Google Health AI
2. **Contact eKare.ai** - determine API access process and endpoint configuration
3. **Configure Keragon webhooks** - set up workflow triggers in platform

### Phase 3: Remove Mock Fallbacks
1. Remove mock data generation from services that have working real APIs
2. Add proper error handling for API failures
3. Test end-to-end workflow with real data

## Success Criteria

- [ ] Real APIs return different results based on uploaded wound images
- [ ] Each service can be tested independently with real credentials  
- [ ] Error handling works gracefully when APIs are unavailable
- [ ] End-to-end workflow processes real data through all available APIs
- [ ] Mock fallbacks remain for APIs without real access (eKare, potential others)

## Risks & Blockers

- **Missing credentials:** Some environment variables may not be configured in actual .env file
- **API access issues:** Some APIs may require additional setup beyond credentials
- **Rate limiting:** Real APIs may have usage limits affecting testing
- **Authentication complexity:** OAuth flows may require additional debugging

## Implementation Progress

### Completed ✅

**1. Enabled Real API Attempts for All Configured Services**
- Modified `canvasService.ts` to attempt real FHIR API calls instead of auto-falling back to demo mode
- Updated `medgemmaService.ts` to attempt real Google Vertex AI calls with proper endpoint format
- Enhanced `metriportService.ts` to allow sandbox mode API calls
- Added `ekareService.ts` real API call attempts with proper error handling

**2. Enhanced Console Logging**
- Added detailed logging to show when real API calls are attempted vs mocks used
- Clear success/failure/fallback messages for debugging
- Color-coded emoji indicators for easy identification

**3. Improved Error Handling**
- CORS error detection and graceful fallback for Canvas
- Authentication failure handling for MedGemma
- Graceful degradation to mock data when APIs fail

**4. Integrated Metriport into Main Workflow**
- Added as Step 5 in the 7-step wound analysis workflow
- Proper progress tracking and error handling
- Better integration with patient context data

### API Status Summary

| API | Status | Real Calls | Issues |
|-----|--------|------------|---------|
| **Phenoml** | ✅ Working | Yes | None - fully functional |
| **MedGemma** | 🔄 Attempting | Yes | 401 auth error, falls back to mock |
| **Canvas** | 🔄 Attempting | Yes | CORS policy blocking, graceful fallback |
| **Metriport** | 🔄 Attempting | Yes | Using sandbox, falls back to mock |
| **Keragon** | 🎭 Mock only | No | Configured for mock mode (webhook setup needed) |
| **eKare.ai** | ⚠️ Mock only | No | No API key configured |

## Progress

### Investigation Results
From testing the application, I found:

1. **Phenoml** ✅ - Already making real API calls to `https://phenoml-hackathon.app.pheno.ml`
2. **Canvas Medical** - Has real implementation but falls back to demo mode (need to verify auth)
3. **Metriport** - Has real implementation but currently using mock mode fallback
4. **Keragon** - Explicitly in mock mode (webhook URLs not configured)
5. **MedGemma** - Using mock implementation (placeholder endpoint)
6. **eKare.ai** - Using mock implementation (placeholder endpoint)

### Implementation Strategy

**Phase 1: Enable APIs with Real Implementations**
1. Test Canvas Medical authentication and FHIR API calls
2. Test Metriport consolidated data API calls  
3. Force real API mode instead of demo fallbacks

**Phase 2: Research Missing Real APIs**
1. Research MedGemma/Keywell endpoint configuration
2. Contact eKare.ai for API access (requires direct contact)
3. Configure Keragon webhook URLs (manual platform setup)

**Phase 3: Remove Mock Fallbacks**
1. Remove automatic fallback to mock data for working APIs
2. Add proper error handling for missing credentials
3. Test end-to-end with real data where possible
