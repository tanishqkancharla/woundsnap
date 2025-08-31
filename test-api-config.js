#!/usr/bin/env node

// Test script to check API configuration status
console.log('=== API Configuration Status Test ===\n');

// Check environment variables directly
console.log('Environment Variables Status:');
console.log('1. MedGemma (Google AI):', process.env.VITE_GOOGLE_MEDGEMMA_API_KEY ? '✓ Configured' : '✗ Not configured');
console.log('2. Phenoml:', process.env.VITE_PHENOML_EMAIL && process.env.VITE_PHENOML_PASSWORD ? '✓ Configured' : '✗ Not configured');
console.log('3. Canvas Medical:', process.env.VITE_CANVAS_CLIENT_ID && process.env.VITE_CANVAS_CLIENT_SECRET ? '✓ Configured' : '✗ Not configured');
console.log('4. Metriport:', process.env.VITE_METRIPORT_API_KEY ? '✓ Configured' : '✗ Not configured');
console.log('5. Keragon:', process.env.VITE_KERAGON_CRITICAL_WEBHOOK_URL ? '✓ Configured' : '✗ Not configured');
console.log('6. eKare.ai:', process.env.VITE_EKARE_API_KEY ? '✓ Configured' : '✗ Not configured');

console.log('\n=== Service Configuration Details ===');

// Check each specific env var
const envVars = [
    'VITE_CANVAS_CLIENT_ID',
    'VITE_CANVAS_CLIENT_SECRET', 
    'VITE_CANVAS_INSTANCE_URL',
    'VITE_PHENOML_API_BASE_URL',
    'VITE_PHENOML_EMAIL',
    'VITE_PHENOML_PASSWORD',
    'VITE_METRIPORT_API_KEY',
    'VITE_GOOGLE_MEDGEMMA_API_KEY',
    'VITE_KERAGON_CRITICAL_WEBHOOK_URL',
    'VITE_KERAGON_STANDARD_WEBHOOK_URL',
    'VITE_KERAGON_FOLLOWUP_WEBHOOK_URL',
    'VITE_EKARE_API_KEY',
    'VITE_KEYWELL_SSO_USERNAME',
    'VITE_KEYWELL_SSO_PASSWORD',
    'VITE_KEYWELL_PAT_TOKEN',
    'VITE_KEYWELL_RETOOL_USERNAME',
    'VITE_KEYWELL_RETOOL_PASSWORD'
];

envVars.forEach(varName => {
    const value = process.env[varName];
    const status = value && value.trim() !== '' && !value.includes('<') && !value.includes('""') ? 
        '✓ Set' : '✗ Not set/empty';
    console.log(`${varName}: ${status}`);
});

console.log('\n=== Summary ===');
const configuredCount = envVars.filter(varName => {
    const value = process.env[varName];
    return value && value.trim() !== '' && !value.includes('<') && !value.includes('""');
}).length;

console.log(`Configured environment variables: ${configuredCount}/${envVars.length}`);
