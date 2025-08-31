# Login Screen

## Purpose
Authentication interface for users to securely access their WoundSnap Lite account. Provides username/password entry fields and secure login functionality for both patients and healthcare providers.

## Navigation
- **Entry Point**: App launch (if not logged in)
- **Alternative Entry**: Settings > Sign Out > Login Again
- **Session Timeout**: Automatic redirect after inactivity

## Available Functions
- Username/email and password input
- "Remember Me" toggle for persistent login
- Forgot password recovery
- Account type selection (Patient/Healthcare Provider)
- Biometric login (fingerprint/face recognition)
- Social login options (Google, Apple ID)
- Create new account registration
- Terms of service and privacy policy access

## Possible Transitions
- **Patient Login**: Welcome Screen or Dashboard (returning users)
- **Healthcare Provider**: Clinician Verification Screen (first time) or Dashboard
- **Registration**: Account creation flow
- **Password Recovery**: Email verification process
- **Biometric Setup**: Device authentication settings
