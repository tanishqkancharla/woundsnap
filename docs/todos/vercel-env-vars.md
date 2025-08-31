# Vercel Environment Variables Setup

## Task Overview
Set up environment variables in Vercel for the WoundSnap project deployment to ensure all API integrations work correctly in production.

## Research Findings

### Current Environment Variables Required
Based on `.env.example`, the following environment variables need to be configured in Vercel:

1. **Canvas Medical Integration:**
   - `CANVAS_CLIENT_ID` - OAuth2 client ID for Canvas Medical API
   - `CANVAS_CLIENT_SECRET` - OAuth2 client secret for Canvas Medical API

2. **Phenoml Integration:**
   - `PHENOML_API_BASE_URL="https://phenoml-hackathon.app.pheno.ml"`
   - `PHEONML_EMAIL` - Account email for Phenoml API
   - `PHENOML_PASSWORD` - Account password for Phenoml API

3. **Metriport Integration:**
   - `METRIPORT_API_KEY` - API key for Metriport sandbox

### Vercel Configuration Status
- Project has `vercel.json` with basic configuration (`cleanUrls: true`)
- Package.json includes Vercel CLI (`vercel: ^24.0.0`) and deploy script
- No environment variables currently configured in Vercel

### Implementation Plan
1. Check if Vercel project exists and is linked
2. Use Vercel CLI to add environment variables
3. Verify deployment works with environment variables
4. Document the process for future reference

## Implementation

### Step 1: Verify Vercel Project Status
Need to check if the project is already linked to a Vercel deployment.

### Step 2: Add Environment Variables
Will use Vercel CLI to add the required environment variables for production deployment.

### Step 3: Test Deployment
Verify that the deployment works with the configured environment variables.

## Progress
- [x] Research current environment variable requirements
- [x] Verified Vercel CLI authentication
- [x] Confirmed project is linked to Vercel
- [x] Verified no existing environment variables
- [x] Successfully added all 6 environment variables to production

## Implementation Complete
Successfully added all required environment variables to Vercel production environment:
- ✅ CANVAS_CLIENT_ID
- ✅ CANVAS_CLIENT_SECRET  
- ✅ PHENOML_API_BASE_URL
- ✅ PHEONML_EMAIL
- ✅ PHENOML_PASSWORD
- ✅ METRIPORT_API_KEY

**Solution Used:** Sourced local `.env` file and piped values directly to `vercel env add` commands.

## Remaining Manual Steps
The project is now linked to Vercel. Complete the setup with these steps:

**Add environment variables** (run each command and provide the value from your `.env` file when prompted):
```bash
npx vercel env add CANVAS_CLIENT_ID production
npx vercel env add CANVAS_CLIENT_SECRET production  
npx vercel env add PHENOML_API_BASE_URL production
npx vercel env add PHEONML_EMAIL production
npx vercel env add PHENOML_PASSWORD production
npx vercel env add METRIPORT_API_KEY production
```

**Verify the environment variables were added:**
```bash
npx vercel env ls
```

**Test deployment:**
```bash
npx vercel deploy
```

## Alternative Approach
Environment variables can also be set through the Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select the woundsnap project
3. Go to Settings → Environment Variables
4. Add each variable with Production, Preview, and Development scopes as needed
