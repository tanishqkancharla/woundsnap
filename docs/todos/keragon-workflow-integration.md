# Keragon Workflow Integration for Woundsnap

## Overview
Configure webhook-triggered workflows in Keragon platform for care team notifications and patient communication. This is a critical path item for the hackathon that will complete the end-to-end clinical workflow automation.

## Research Summary

### Current Status
- ✅ Account manually created and active
- ✅ Platform access confirmed 
- ✅ Comprehensive research completed (see docs/Hackathon/Keragon.md)
- ❌ No API implementation exists yet
- ❌ No webhook configuration implemented
- ❌ No environment variables set up

### Keragon Platform Capabilities
- **No-code workflow builder** with visual interface
- **300+ healthcare integrations** including EHRs, SMS, email
- **Webhook support** for real-time event handling
- **HIPAA compliant** with audit trails
- **AI Co-pilot** for workflow generation

### Integration Architecture for Woundsnap
```
Photo → MedGemma AI → Canvas FHIR → Keragon Workflows → [Patient SMS, Care Team Alerts, Follow-up Scheduling]
```

## Implementation Plan

### Phase 1: Core Webhook Setup
1. **Create Keragon service** (`src/services/keragonService.ts`)
2. **Configure webhook endpoints** to receive Canvas FHIR events
3. **Set up environment variables** for Keragon API access
4. **Implement basic workflow triggers** for wound analysis completion

### Phase 2: Workflow Configuration
1. **Care Team Notification Workflow**
   - Trigger: High-risk wound detected (infection indicators)
   - Actions: SMS to clinician, email to wound care specialist
   
2. **Patient Communication Workflow**
   - Trigger: Analysis complete with normal findings
   - Actions: SMS with results summary, treatment instructions
   
3. **Follow-up Scheduling Workflow**
   - Trigger: Wound healing progress assessment
   - Actions: Schedule next appointment, send calendar invite

### Phase 3: Integration Points
1. **Canvas Medical Integration**
   - Receive FHIR Observation webhooks
   - Parse wound assessment data
   - Trigger appropriate workflows based on severity
   
2. **Patient Context Integration**
   - Use Metriport data for patient history context
   - Personalize communication based on medical history
   
3. **Error Handling**
   - Fallback for failed workflows
   - Retry mechanisms for critical notifications
   - Logging and monitoring

## Technical Implementation

### 1. Keragon Service Creation

**File**: `src/services/keragonService.ts`

Key features needed:
- Webhook endpoint registration
- Workflow trigger functions
- Patient communication methods
- Care team notification system
- Error handling and logging

### 2. Environment Variables

Add to `.env.example`:
```
KERAGON_API_KEY=""
KERAGON_WORKSPACE_ID=""
KERAGON_WEBHOOK_SECRET=""
```

### 3. Workflow Types to Implement

#### Critical Risk Workflow
- **Trigger**: Infection risk > 70%, severe wound classification
- **Actions**: 
  - Immediate SMS to on-call clinician
  - Email to wound care specialist with photo and analysis
  - Create urgent task in Canvas Medical
  - Log alert in audit trail

#### Standard Care Workflow  
- **Trigger**: Normal wound analysis completion
- **Actions**:
  - SMS to patient with results summary
  - Email treatment instructions
  - Schedule follow-up reminder (7-14 days)
  - Update patient portal

#### Follow-up Workflow
- **Trigger**: Scheduled follow-up time reached
- **Actions**:
  - SMS reminder to upload new photo
  - Email with progress tracking link
  - Generate care team summary if requested

### 4. Integration with Existing Services

**Canvas Medical Integration**:
```typescript
// After FHIR data is stored in Canvas
await keragonService.triggerWorkflow({
  workflowType: 'wound-analysis-complete',
  patientId: patient.id,
  analysisData: medgemmaResults,
  riskLevel: calculateRiskLevel(medgemmaResults)
});
```

**Patient Context from Metriport**:
```typescript
// Use patient history to personalize workflows
const patientHistory = await metriportService.getPatientHistory(patientId);
await keragonService.triggerWorkflow({
  workflowType: 'personalized-follow-up',
  patientContext: patientHistory,
  woundStatus: currentAnalysis
});
```

## Testing Strategy

### 1. Mock Implementation
- Create mock Keragon service for development
- Simulate webhook responses
- Test workflow trigger conditions

### 2. Live Testing
- Use Keragon platform's test workflows
- Send real webhook events from Canvas Medical
- Verify SMS and email notifications

### 3. Error Scenarios
- Test failed webhook delivery
- Verify retry mechanisms
- Confirm fallback notifications

## Success Criteria

### Minimum Viable Product (MVP)
- [ ] Keragon service created and integrated
- [ ] Basic webhook endpoint functional  
- [ ] One workflow type working (critical risk notifications)
- [ ] Environment variables configured
- [ ] Error handling implemented

### Demo-Ready Features
- [ ] Critical risk workflow (clinician SMS alerts)
- [ ] Patient communication workflow (results SMS)
- [ ] Follow-up scheduling workflow  
- [ ] Integration with Canvas Medical webhooks
- [ ] Mock data testing successful

### Full Implementation
- [ ] All three workflow types functional
- [ ] Metriport patient context integration
- [ ] Comprehensive error handling and retry logic
- [ ] Audit logging and monitoring
- [ ] Performance optimization

## Progress

### ✅ Completed
- Comprehensive research and planning documented
- Keragon service implementation created (`src/services/keragonService.ts`)
- Mock workflow system implemented for development/demo
- Integration architecture designed and documented

### 🔄 Manual Configuration Required
Keragon is a **no-code workflow builder platform** that requires manual configuration through their web interface. The following manual steps need to be completed by a human user:

#### Required Manual Steps in Keragon Platform:
1. **Login to Keragon**: https://app.keragon.com
2. **Create 3 Workflow Templates**:
   - **Critical Risk Workflow**: SMS to clinician + email to specialist for high-risk wounds
   - **Standard Care Workflow**: SMS to patient + treatment instructions for normal findings  
   - **Follow-up Reminder Workflow**: Automated reminders for progress check-ins

3. **Configure Webhook Triggers**: Set up webhook endpoints that Woundsnap can POST to
4. **Set up Communication Channels**: Configure SMS/email providers (Twilio, etc.)
5. **Test Workflows**: Verify notifications are sent correctly

#### What's Already Built:
- ✅ `keragonService.ts` - Ready to send webhook data to Keragon workflows
- ✅ Mock implementation - Works for demo purposes without manual configuration
- ✅ Integration points - Ready to trigger workflows from wound analysis results

### 🎯 For Demo/Development
The mock implementation is fully functional and demonstrates:
- Critical risk workflow triggers
- Patient communication workflows
- Care team notifications
- Integration with existing Canvas/MedGemma/Phenoml pipeline

## Next Steps (Manual Work Required)
1. **Human operator** logs into Keragon platform
2. **Manually build** the 3 workflow templates using their visual editor
3. **Configure webhook URLs** and provide them as environment variables
4. **Test live workflows** with real SMS/email notifications

## Dependencies
- ✅ Canvas Medical FHIR implementation 
- ✅ MedGemma AI analysis
- ✅ Keragon platform access
- ⚠️ **Manual workflow configuration** in Keragon platform (requires human)
- ⚠️ **SMS/Email provider setup** in Keragon (requires human)

## Resources
- Keragon Platform: https://app.keragon.com (requires manual login)
- Documentation: docs/Hackathon/Keragon.md
- Trial Setup: docs/todos/keragon-trial.md
- Service Implementation: src/services/keragonService.ts ✅
