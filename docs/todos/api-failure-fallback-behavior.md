# API Failure Fallback Behavior

## Objective
Test app behavior when each API is unavailable to ensure graceful degradation vs. hard failures. This is critical for demo reliability since APIs may fail during presentation.

## Research Phase

### Current API Integration Points
1. **Canvas Medical** - OAuth authentication and FHIR storage
2. **MedGemma** - AI wound analysis 
3. **Phenoml** - FHIR data conversion
4. **Keragon** - Workflow automation
5. **Metriport** - Patient context data
6. **eKare** - Analytics and measurements

### Analysis Required
- Review current error handling patterns in each service
- Identify hard failure points vs. graceful degradation
- Document fallback strategies (mock data, retry logic, user messaging)
- Create test scenarios for each API failure mode

## Implementation Plan
TBD after research

## Progress
- [ ] Research current error handling in each service file
- [ ] Document existing fallback mechanisms  
- [ ] Identify areas needing improvement
- [ ] Implement enhanced error handling
- [ ] Test failure scenarios with Playwright
