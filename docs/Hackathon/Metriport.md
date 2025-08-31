# Metriport Research Report for Woundsnap Hackathon

## Company Overview

**Metriport** is a healthcare data company that provides a universal API for accessing comprehensive patient medical data. They position themselves as a solution to make patient data accessible "in seconds, not weeks" through their FHIR-native, open-source platform.

### Key Differentiators:
- **Universal API**: Single integration point for multiple health information networks
- **Open-source approach**: Transparent, community-driven development
- **FHIR R4 native**: Standardized healthcare data format
- **Speed**: Real-time data access vs traditional weeks-long processes  
- **Security**: SOC 2 Type II and HIPAA compliant
- **Comprehensive coverage**: Integrates with major HIEs, EHRs, and consumer health platforms

## Core Products & Services

### 1. Medical API
- **Primary offering**: FHIR-native API for patient medical data access
- **Data formats**: FHIR R4, C-CDA, PDF
- **Coverage**: Health Information Networks (CommonWell, Carequality), EHRs, consumer devices
- **Integration methods**: Webhooks (recommended) or API polling

### 2. Dashboard
- No-code provider interface for medical record access
- AI-powered medical record summaries
- Patient document management
- Clinical history insights

### 3. EHR Apps
Pre-built integrations with:
- athenaOne®
- Canvas®
- Elation®

### 4. Consumer Health Integrations
- Apple Health
- Google Fit
- Fitbit, Garmin, Oura, WHOOP, Withings

## Relevant APIs for Wound Care Applications

### FHIR Resources Supported (Relevant to Woundsnap):

#### Direct Wound Care Relevance:
- **Observation**: Critical for wound assessments, measurements, stage tracking
- **DiagnosticReport**: Wound biopsies, cultures, diagnostic imaging results
- **DocumentReference**: Wound care documentation, treatment plans, progress notes
- **Condition**: Wound diagnoses, chronic conditions affecting healing
- **Procedure**: Wound treatments, debridements, surgical interventions

#### Supporting Resources:
- **Patient**: Core patient demographics and identifiers
- **Encounter**: Healthcare visits where wound care occurred
- **Practitioner**: Healthcare providers involved in wound care
- **MedicationRequest/Statement**: Wound care medications, antibiotics
- **AllergyIntolerance**: Important for wound care product selection
- **Binary**: Wound images and documents
- **Goal**: Wound healing objectives and targets

### Key API Endpoints:
- **Create Facility**: Set up healthcare locations
- **Create Patient**: Register patients in the system
- **Start Document Query**: Initiate patient data retrieval
- **Start Consolidated Data Query**: Get standardized FHIR data
- **Create Patient's Consolidated Data**: Contribute new clinical data
- **Upload Document**: Submit wound images/documentation

## Authentication & Security

### Authentication:
- **API Key based**: Generated through developer dashboard
- **Single key per application**: Treat as password, store securely
- **Production access**: Requires approval call with Metriport team

### Security Features:
- **HMAC SHA-256 webhook signatures**: Verify webhook authenticity
- **SOC 2 Type II compliance**
- **HIPAA compliance**
- **MFA and VPN support**
- **Webhook signature verification**: Using unique webhook keys

## Integration Architecture

### Webhook Implementation (Recommended):
```json
{
  "ping": "<random-sequence>",
  "meta": {
    "messageId": "<message-id>",
    "when": "<timestamp-iso-8601>",
    "type": "ping|medical-api-type"
  },
  "data": { /* patient data payload */ }
}
```

### Webhook Requirements:
- Publicly accessible endpoint
- POST request handling
- 200 OK response within 4 seconds  
- Idempotent processing
- No HTTP redirects
- HMAC signature verification

### Alternative: API Polling
- Manual status checking
- Higher latency vs webhooks
- More development overhead

## Development Resources

### SDKs & Libraries:
- **Primary**: TypeScript/JavaScript SDK (`@metriport/api-sdk`)
- **CommonWell SDK**: Specific integration package
- **NPM packages**: Ready-to-use API client wrappers

### Sample Code:
- **TypeScript Express sample**: Webhook implementation reference
- **Mock webhook utility**: Testing webhook protocols  
- **FHIR uploader utility**: Synthetic data insertion

### Documentation:
- Comprehensive developer docs at docs.metriport.com
- FHIR resource specifications
- API reference documentation
- Integration guides and tutorials

## Sandbox Environment

### Testing Capabilities:
- **De-identified clinical data**: Multiple test patients with comprehensive records
- **Multiple data formats**: C-CDA XML, FHIR JSON, PDF documents, medical images (TIFF/JPEG)
- **Pre-defined demographics**: Test patients (Jane Smith, Chris Smith, Ollie Brown, etc.)
- **Webhook testing**: Patient admission/transfer/discharge events
- **SDK integration**: Sandbox flag in API client

### Test Data Includes:
- Clinical documents
- Medical images (relevant for wound imaging)
- Structured FHIR data
- Unstructured clinical notes

## Pricing & Limits

**Note**: Specific pricing tiers and rate limits are not publicly documented. Access requires:
1. Developer account creation
2. API access request approval
3. Intro call with Metriport team for production use

**Sandbox**: Available for testing and development (specific limits not documented)

## Developer Community & Support

### Community Resources:
- **Slack Community**: Active developer chat (join link provided)
- **GitHub**: Open-source repository with issues/feature requests
- **24/7 Support**: Mentioned for developer assistance

### Contributing:
- Open-source model encourages contributions
- GitHub issues for feature requests and bug reports
- Developer Certificate of Origin (DCO) required

## Integration Strategy for Woundsnap

### High-Value Use Cases:

1. **Patient History Retrieval**:
   - Fetch existing wound care records
   - Access previous diagnostic reports
   - Review medication allergies affecting treatment

2. **Clinical Context**:
   - Obtain relevant medical conditions (diabetes, circulation issues)
   - Access current medications that may affect healing
   - Review provider notes from previous wound treatments

3. **Documentation Storage**:
   - Store wound analysis results as FHIR Observations
   - Submit wound images as Binary resources
   - Create diagnostic reports for AI analysis results

4. **Care Coordination**:
   - Share wound progress with existing care team
   - Integrate with EHR workflows
   - Maintain comprehensive wound healing timeline

### Implementation Recommendations:

1. **Start with Sandbox**: Test with provided clinical data and wound-related observations
2. **Focus on Observation Resources**: Primary vehicle for wound assessment data
3. **Implement Webhooks**: Real-time updates when new wound-related data becomes available
4. **Use Binary Resources**: Store and retrieve wound images
5. **Leverage DocumentReference**: Link to detailed wound care plans and reports

### Technical Architecture:
```
Woundsnap App → Metriport Medical API → HIE Networks
     ↓                    ↓                    ↓
  AI Analysis      FHIR Resources      EHR Systems
     ↓                    ↓                    ↓
Wound Insights → Store as Observations → Care Team Access
```

## Potential Challenges & Considerations

1. **Data Availability**: Not all healthcare providers may be connected to HIE networks
2. **Wound-Specific Data**: General medical records may lack detailed wound assessment data
3. **Real-time Updates**: Depends on when healthcare providers submit data to HIEs
4. **Production Access**: Requires approval process and business validation
5. **Pricing**: Custom pricing may be significant for hackathon/early-stage projects

## Next Steps for Hackathon

1. **Sign up for Metriport developer account**
2. **Explore sandbox environment** with focus on Observation and Binary resources
3. **Review sample TypeScript application** for webhook implementation
4. **Test FHIR data structures** relevant to wound care
5. **Design integration architecture** for Woundsnap's AI analysis workflow
6. **Plan data contribution strategy** (reciprocal sharing requirement)

## Key Documentation Links

- [Getting Started Guide](https://docs.metriport.com/medical-api/getting-started/quickstart)
- [FHIR Resources List](https://docs.metriport.com/medical-api/fhir/resources)  
- [Webhook Implementation](https://docs.metriport.com/medical-api/getting-started/webhooks)
- [Sandbox Environment](https://docs.metriport.com/medical-api/getting-started/sandbox)
- [GitHub Repository](https://github.com/metriport/metriport)
- [TypeScript SDK](https://www.npmjs.com/package/@metriport/api-sdk)

---

**Summary**: Metriport offers a robust platform for healthcare data integration that could significantly enhance Woundsnap's capabilities by providing access to comprehensive patient medical histories, enabling better clinical context for wound analysis, and facilitating integration with existing healthcare workflows. The FHIR-native approach and strong developer resources make it well-suited for healthcare hackathon projects.
