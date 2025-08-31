# Woundsnap

High-level product plan:

- Patient opens app
- Taps “upload picture of wound” (or similar)
  - Opens a popup that lets them search or add a known patient injury (to pull up its history)
- Opens a screen with a camera and a “take picture” button.
  - Nice to have: a realtime preview of where we think the wound is
- Once picture is taken, screen goes into loading state. Behind the scenes we use AI to pull out any information like location, dimensions, signs of infection, etc.
- After processed, we see a screen that shows the analysis and any suggested action steps. Previous wound logs are shown below.

## Detailed Clinical Workflow (Behind the Scenes)

### 1. Photo Capture → Clinical Analysis
```
Patient uploads wound photo → MedGemma AI identifies:
- Wound dimensions (length/width/depth estimation)
- Tissue types (granulation, necrotic, slough)
- Signs of infection (erythema, purulence, odor indicators)
- Healing stage (inflammatory, proliferative, remodeling)
- Pain/drainage assessment from patient input
```

### 2. AI Insights → Medical Documentation
```
MedGemma results → Phenoml Lang2FHIR converts to:
- FHIR Observation: "Wound measures 3.2cm x 2.1cm, Stage 2 pressure ulcer"
- FHIR Condition: "L89.152 - Pressure ulcer of sacral region, stage 2"
- SNOMED codes: "399097000 | Pressure ulcer of skin |"
- Clinical notes: "Wound shows signs of healing, no infection present"
```

### 3. Clinical Context Integration
```
Metriport pulls relevant patient history:
- "Patient has diabetes - impacts healing timeline"
- "Currently taking blood thinners - affects wound care protocol"
- "Previous wound care episodes from 6 months ago"
- "Known allergies to topical antibiotics"
Provides critical clinical context the AI couldn't know from photo alone
```

### 4. Structured Data → EHR Ready
```
Canvas Medical automatically stores:
- Wound photos as FHIR Media resources
- Assessment as FHIR Observation resources  
- Diagnosis as FHIR Condition resources
- Treatment plans as FHIR Task resources
Ready to sync with any EHR system (Epic, Cerner, etc.)
```

### 5. Smart Care Coordination
```
Keragon triggers automated workflows based on analysis:
- High infection risk → Alert wound care specialist immediately + urgent appointment
- Good healing progress → Schedule routine follow-up in 2 weeks
- Patient missed scheduled photo → Send gentle reminder text with care instructions
- Treatment working well → Update care plan, notify primary care physician
- Critical findings → Generate provider alert with clinical summary
```

## Value Proposition Enhancement

**Without integration:** "Here's what your wound looks like"
**With sponsor integration:** "Here's your wound's clinical status, automatically documented in your medical record, with your care team notified and next steps scheduled"

Wound analysis structure

- Wound information
  - location
  - dimensions
- Warning signs
  - Signs of infection
  - Others?
- Clinical notes
  - To be copy-pasted into EHR
- Suggested next steps
  - E.g. specific medication or clarify proper wound care instructions for patient (can be texted)
