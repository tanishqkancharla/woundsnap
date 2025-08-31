# User Feedback: Treatment Plan Button Changes

## Task Description

Implement user feedback changes for the dashboard Quick Actions section:

1. **Move "customize treatment plan" from Treatment Plan to Clinician Review section**
   - Currently: Treatment Plan has full AI analysis results + customizable form 
   - Change to: Move the customizable form functionality to Clinician Review

2. **Add "generate clinical summary" button to Clinician Review**
   - New functionality for clinicians to generate summary reports

3. **Change Treatment Plan button headline to "Patient Summary/Treatment Instructions"** 
   - Currently: "Treatment Plan" with "Care instructions" description
   - Change to: "Patient Summary/Treatment Instructions" 

## Current State Analysis

### Dashboard Quick Actions (src/screens/Dashboard.tsx, lines 202-215)
- **Clinician Review**: Links to `/clinician`, shows "Professional verification" 
- **Treatment Plan**: Links to `/treatment`, shows "Care instructions"

### Treatment Plan Screen (src/screens/TreatmentPlan.tsx)
- Has AI analysis results display (lines 64-88)
- Has treatment instructions (lines 90-99) 
- Has warning signs (lines 101-111)
- Has **"Customize Treatment Plan" form** (lines 113-216) with:
  - Medication settings (name, oral/topical)
  - Dressing frequency 
  - Interventions (elevation, compression)
  - Priority slider
  - Submit button

### Clinician Verification Screen (src/screens/ClinicianVerification.tsx)
- Very basic placeholder with just header and minimal content
- Needs to be enhanced with the customization form + generate summary functionality

## Implementation Plan

1. **Update Dashboard button text**: Change Treatment Plan to "Patient Summary/Treatment Instructions"

2. **Refactor TreatmentPlan.tsx**: 
   - Keep AI analysis results, treatment steps, warning signs
   - Remove "Customize Treatment Plan" form section 
   - Focus on patient-facing summary and instructions

3. **Enhance ClinicianVerification.tsx**:
   - Add the customization form from Treatment Plan
   - Add "Generate Clinical Summary" button and functionality
   - Rename to be more clinician-focused

## Expected Outcome

- Treatment Plan becomes patient-focused summary/instructions
- Clinician Review becomes the professional editing interface
- Clear separation between patient and clinician workflows

## Implementation Complete

**Status**: ✅ Completed successfully

### Changes Made

1. **Dashboard.tsx**: Updated button text from "Treatment Plan" to "Patient Summary/Treatment Instructions"

2. **TreatmentPlan.tsx**: 
   - Updated header from "Treatment Plan" to "Patient Summary/Treatment Instructions"
   - Removed entire "Customize Treatment Plan" form section
   - Now focuses purely on patient-facing summary with AI results, treatment steps, and warning signs

3. **ClinicianVerification.tsx**: 
   - Added "Generate Clinical Summary" button in new "Clinical Documentation" section
   - Moved complete "Customize Treatment Plan" form from TreatmentPlan.tsx
   - Enhanced with proper form state management and submission handling
   - Now serves as the professional editing interface for clinicians

### Testing Results

Playwright testing confirmed:
- Dashboard button correctly shows "Patient Summary/Treatment Instructions"
- Patient Summary screen shows clean patient-focused content without customization form
- Clinician Review screen has both "Generate Clinical Summary" button and full customization form
- All form functionality (medication, dressing, interventions, priority) works correctly
- Clear separation between patient and clinician workflows achieved

### User Experience Improvements

- **Patients** see simplified instructions and summary without complex forms
- **Clinicians** have dedicated interface for customization and clinical documentation
- **Workflow clarity** improved with proper role-based screen separation
