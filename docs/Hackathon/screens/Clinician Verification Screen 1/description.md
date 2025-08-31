# Clinician Verification Screen

## Purpose
Screen for healthcare professionals to verify their credentials and identity before accessing the wound assessment platform. This ensures only authorized clinicians can review and validate wound documentation.

## Navigation
- **Entry Point**: Accessed from Login Screen when selecting "Healthcare Provider" login type
- **Alternative Entry**: Settings > Account Type > Switch to Clinician Mode

## Available Functions
- Professional license verification input
- Medical institution affiliation selection
- Credential document upload
- Identity verification via government ID
- Two-factor authentication setup
- Terms of service agreement for healthcare providers

## Possible Transitions
- **Success**: Patient Profile Screen (clinician view) or Treatment Plan Screen
- **Verification Pending**: Temporary limited access dashboard
- **Failed Verification**: Back to Login Screen with error message
- **Cancel**: Return to previous screen or Login Screen
