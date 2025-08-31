# Canvas Medical Research Report for Woundsnap

## Executive Summary

Canvas Medical is a highly programmable, AI-powered Electronic Health Record (EHR) platform designed specifically for digital health startups and modern healthcare organizations. For Woundsnap's wound analysis application, Canvas offers compelling FHIR API capabilities, media handling, and robust condition tracking that could seamlessly store and manage wound documentation, analysis results, and clinical workflows.

## Company Overview

**Company:** Canvas Medical, Inc.
**Founded:** 2015 
**Headquarters:** 220 Montgomery Street, Suite 991 San Francisco, California 94104
**Website:** https://www.canvasmedical.com/
**Developer Documentation:** https://docs.canvasmedical.com/
**Contact:** (800) 370-1416

Canvas Medical positions itself as "the most programmable EMR on earth," offering what they call "Deep Unified Architecture™" and "Narrative Charting™" experiences. The platform is specifically designed for modern care models and digital health applications, making it an ideal match for innovative solutions like Woundsnap.

## FHIR API Capabilities

Canvas offers a comprehensive FHIR R4-compliant API with **37 FHIR resources supported** and **21 resources with write support**. Key capabilities relevant to Woundsnap include:

### Core FHIR Resources for Wound Care:
- **Media**: Support for wound photos with base64 encoding (JPEG, PNG, HEIC)
- **Condition**: Track wound conditions with ICD-10-CM coding
- **Observation**: Store wound measurements, healing progress, assessments
- **Patient**: Patient demographics and identifiers
- **Encounter**: Link wound assessments to clinical visits
- **DocumentReference**: Additional wound documentation
- **Practitioner**: Healthcare provider information
- **Task**: Care reminders and follow-up actions

### Authentication & Integration:
- OAuth 2.0 authentication
- RESTful API endpoints
- Comprehensive error handling
- Pagination support
- Conditional requests
- Date filtering capabilities

## Wound Care Data Management Features

### 1. **Media Storage and Management**
Canvas's Media resource is perfectly suited for Woundsnap's core functionality:

```json
{
  "resourceType": "Media",
  "status": "completed",
  "content": {
    "contentType": "image/jpeg",
    "data": "[base64-encoded-image]",
    "title": "Wound photograph - Day 1"
  },
  "subject": {
    "reference": "Patient/[patient-id]"
  },
  "note": [{
    "text": "AI Analysis: Stage 2 pressure ulcer, 2.3cm diameter"
  }]
}
```

### 2. **Condition Tracking**
Robust condition management for wound diagnoses:
- Support for ICD-10-CM wound codes
- Clinical status tracking (active, resolved, relapsed)
- Onset and resolution dates
- Verification status (confirmed, provisional)

### 3. **Observation Data**
Store quantitative wound measurements:
- Wound dimensions
- Healing progress scores
- Pain assessments
- Infection indicators

### 4. **Task Management**
Automated reminders and care coordination:
- Follow-up photo reminders
- Dressing change schedules
- Specialist referral tasks

## Developer Experience & Tools

### **Canvas SDK**
- Server-side development kit for building plugins
- Real-time event system (650+ clinical and operational events)
- Native infrastructure deployment
- Enterprise-grade security

### **Developer Sandbox**
Canvas provides a developer sandbox environment for:
- API testing and development
- FHIR resource experimentation
- Plugin development
- Integration testing

### **Documentation & Support**
- Comprehensive API documentation
- Bruno collection for API testing
- Code examples in multiple languages (curl, Python)
- GitHub repository with example requests
- Developer community discussions

## Integration Architecture for Woundsnap

### **Recommended Workflow:**
1. **Photo Capture**: Woundsnap captures wound photos
2. **AI Analysis**: Process images for wound assessment
3. **FHIR Media Creation**: Store photos as Media resources
4. **Condition Documentation**: Create/update Condition resources
5. **Observation Recording**: Store measurements and assessments
6. **Task Creation**: Set follow-up reminders
7. **Provider Notification**: Update encounter notes

### **API Integration Points:**
- `POST /Media` - Upload wound photographs
- `POST /Condition` - Document wound diagnoses
- `POST /Observation` - Store measurements and assessments  
- `POST /Task` - Create follow-up tasks
- `GET /Patient` - Retrieve patient information
- `PUT /Condition` - Update healing progress

## Pricing & Plans

Canvas offers three pricing tiers suitable for different organizational needs:

### **Clinic Plan**
- 3 users, up to 100 patients/month
- Pay-as-you-go scaling
- Self-directed onboarding
- **Best for:** Small practices testing Woundsnap integration

### **Builder Plan** - $3,950/month
- Unlimited users
- 1,000 monthly active patients included
- **Unlimited API calls** (crucial for Woundsnap)
- 8-week onboarding support
- **Best for:** Digital health startups like Woundsnap

### **Enterprise Plan**
- Unlimited users
- 3,000+ active patients included
- Custom development support
- Dedicated customer success
- **Best for:** Large-scale deployments

## Hackathon & Developer Program Evidence

Canvas has demonstrated strong commitment to healthcare innovation through hackathon participation:

### **Out-of-Pocket 2025 Healthcare AI Hackathon**
Canvas was a major sponsor and provided:
- Real-time developer support on-site
- Canvas SDK and FHIR API access
- Multiple teams built on Canvas platform
- Projects included wound care, referral management, and clinical workflows

**Notable Projects Built on Canvas:**
- ARC (Automated Referral Center) - used Canvas EMR API integration
- AdvocateGPT - FHIR integration for patient advocacy
- Clinicians Unchained - automated clinical workflows

This demonstrates Canvas's commitment to supporting innovative healthcare applications and their API's capability to handle complex medical workflows.

## Technical Specifications

### **Security & Compliance:**
- HITRUST certified
- SOC 2 Type II compliant
- ONC CEHRT certified
- HIPAA compliant
- Surescripts certified

### **API Limits & Performance:**
- No API call limits on Builder/Enterprise plans
- High availability architecture
- Real-time event processing
- Scalable infrastructure

### **Data Formats:**
- FHIR R4 specification
- JSON payloads
- Base64 image encoding
- Standard HTTP status codes

## Competitive Advantages for Woundsnap

1. **Purpose-Built for Digital Health**: Unlike traditional EHRs, Canvas is designed for modern healthcare applications
2. **Unlimited API Calls**: Critical for AI-powered applications that make frequent API requests
3. **Developer-First Approach**: Extensive documentation, SDKs, and developer support
4. **FHIR-Native**: True FHIR implementation, not a bolt-on
5. **Rapid Integration**: Pre-built components and clear documentation enable fast development
6. **Scalable Architecture**: Can grow with Woundsnap's user base
7. **AI-Friendly**: Platform designed to support AI-powered workflows

## Potential Limitations

1. **Cost Structure**: Builder plan at $3,950/month may be expensive for early-stage startups
2. **Learning Curve**: FHIR specification complexity requires developer expertise
3. **Canvas Ecosystem**: May require adoption of Canvas's broader platform
4. **Limited Traditional EHR Integration**: Focus on modern care models vs. legacy systems

## Recommendations for Woundsnap

### **Immediate Next Steps:**
1. **Sign up for Developer Sandbox** - Test FHIR API capabilities
2. **Prototype Core Workflows** - Build Media and Condition resource integration
3. **Evaluate Builder Plan** - Assess cost-benefit for unlimited API access
4. **Connect with Canvas Team** - Leverage their healthcare expertise

### **Technical Implementation Priority:**
1. **Phase 1**: Media resource integration for wound photos
2. **Phase 2**: Condition tracking for wound diagnoses  
3. **Phase 3**: Observation data for measurements
4. **Phase 4**: Task automation for follow-up care
5. **Phase 5**: Advanced analytics and reporting

### **Strategic Considerations:**
- Canvas could serve as Woundsnap's primary data infrastructure
- FHIR compliance enables integration with other healthcare systems
- Platform's AI-friendly architecture supports future enhancements
- Developer community provides ongoing support and collaboration opportunities

## Conclusion

Canvas Medical represents an exceptional platform for Woundsnap's wound analysis application. The combination of robust FHIR APIs, unlimited API calls, developer-friendly tools, and healthcare-specific features makes Canvas an ideal infrastructure partner. The platform's demonstrated support for innovative healthcare applications through hackathons and developer programs indicates strong alignment with Woundsnap's mission to revolutionize wound care through AI-powered analysis.

The investment in Canvas's Builder plan ($3,950/month) would provide Woundsnap with enterprise-grade infrastructure, unlimited scalability, and the technical foundation needed to build a world-class wound care solution that seamlessly integrates into existing healthcare workflows.

## Key Links

- **Main Website**: https://www.canvasmedical.com/
- **Developer Documentation**: https://docs.canvasmedical.com/
- **API Reference**: https://docs.canvasmedical.com/api/
- **Developer Sandbox**: https://www.canvasmedical.com/emrs/developer-sandbox
- **FHIR Media API**: https://docs.canvasmedical.com/api/media/
- **FHIR Condition API**: https://docs.canvasmedical.com/api/condition/
- **Bruno API Collection**: https://github.com/canvas-medical/canvas-fhir-example-requests
- **GitHub Discussion**: https://github.com/canvas-medical/canvas-plugins/discussions
- **Pricing**: https://www.canvasmedical.com/pricing
