# Add Photo Upload Support

## Objective
Add file upload functionality to PhotoCapture component to enable testing end-to-end flows with sample wound images when camera access is not available or for consistent testing scenarios.

## Current State Analysis
- PhotoCapture.tsx currently only supports real camera capture via react-webcam
- Component handles captured photos as base64 data URIs and passes to results screen
- Camera errors are handled gracefully but no fallback upload option exists
- Sample images exist in docs/Hackathon/screens/ but no wound-specific test images

## Requirements
1. **File Upload Input**: Add HTML file input that accepts image files (jpg, png, jpeg, webp)
2. **Image Processing**: Convert uploaded files to base64 format consistent with camera captures
3. **UI Integration**: Seamlessly integrate upload option alongside camera capture
4. **File Validation**: Ensure uploaded files are valid images and reasonable size
5. **Testing Support**: Enable consistent testing with known sample images

## Implementation Plan
1. **UI Enhancement**:
   - Add "Upload Photo" button as alternative to camera capture
   - Show upload option when camera fails or as manual choice
   - Maintain existing camera-first workflow

2. **File Processing**:
   - Use FileReader API to convert File to base64 data URI
   - Apply same format as react-webcam screenshot (image/jpeg)
   - Validate file type and size limits

3. **State Management**:
   - Extend existing photo state to handle both camera and upload sources
   - Add upload-specific error handling
   - Maintain existing navigation flow to results screen

4. **Testing Assets**:
   - Create sample wound images for testing
   - Document recommended test image specifications

## Technical Considerations
- **File Size**: Limit uploads to reasonable size (e.g., 5MB) to prevent performance issues
- **Image Quality**: Maintain quality settings consistent with camera captures (0.8 quality)
- **Browser Compatibility**: Use standard File API supported in all modern browsers
- **Error Handling**: Handle file read errors, invalid formats, oversized files
- **Accessibility**: Proper labels and ARIA attributes for file input

## Success Criteria
- [ ] File upload input integrated into PhotoCapture UI
- [ ] Uploaded images converted to base64 format matching camera output
- [ ] Proper error handling for invalid files/sizes
- [ ] End-to-end flow works: Upload → Results → AI Analysis → Canvas Storage
- [ ] Existing camera functionality remains unchanged
- [ ] Mobile-responsive file upload experience

## Testing Plan
1. **Unit Testing**:
   - File conversion to base64
   - Error handling for invalid files
   - Size validation

2. **Integration Testing**:
   - Upload → Results screen flow
   - Uploaded photo analysis via MedGemma
   - FHIR conversion and Canvas storage

3. **User Experience Testing**:
   - Mobile file picker experience
   - Desktop drag-and-drop (nice to have)
   - Error message clarity

## Sample Test Images Needed
- Various wound types (chronic, acute, surgical)
- Different lighting conditions
- Various sizes and orientations
- Edge cases (very small, very large)

---

## Progress

### Research Phase ✅
- Analyzed current PhotoCapture implementation
- Identified integration points and requirements
- Created comprehensive implementation plan

### Implementation Phase ✅
- [x] Add file upload UI components
- [x] Implement file-to-base64 conversion
- [x] Add validation and error handling
- [x] Test integration with existing flow

### Testing Phase ✅
- [x] Create sample test images
- [x] Verify end-to-end functionality
- [x] Test mobile and desktop experience

### Documentation Phase ✅
- [x] Update component documentation
- [x] Document testing procedures
- [x] Update TODO.md status

## Implementation Summary

Successfully implemented comprehensive photo upload functionality in the PhotoCapture component:

### 🎯 **Core Features Delivered**
- **File Upload Input**: Hidden HTML file input with proper accept attributes for images
- **UI Integration**: "Upload Photo" button alongside existing "Take Photo" functionality
- **File Processing**: Automatic conversion of uploaded files to base64 format matching camera output
- **Validation**: File type validation (images only) and size limits (5MB max)
- **Error Handling**: Comprehensive error messages for invalid files, oversized uploads, and processing failures

### 🔧 **Technical Implementation**
- **React State Management**: Added upload-specific state variables (uploadError, isUploading)
- **Event Handlers**: Implemented handleFileUpload with FileReader API and handleUploadClick for triggering
- **UI Components**: Added upload section with proper disabled states during processing
- **CSS Styling**: Complete styling integration with existing PhotoCapture design system
- **Mobile Responsive**: Upload functionality works seamlessly on mobile and desktop

### ✅ **Testing Results**
- **End-to-End Flow**: Upload → Preview → Analyze → Results screen - All working ✅
- **File Validation**: Proper rejection of non-image files and oversized uploads ✅  
- **UI Integration**: Upload button displays alongside camera capture without conflicts ✅
- **Performance**: Fast upload processing with proper loading states ✅
- **Mobile Experience**: File picker works correctly on mobile browsers ✅

### 🚀 **Usage Instructions**
1. Navigate to PhotoCapture screen (/photo-capture)
2. Choose between "Take Photo" (camera) or "Upload Photo" (file picker)
3. For upload: Click "Upload Photo" → Select image file → Image displays in preview
4. Continue with standard flow: "Analyze Wound" → Results screen
5. Same analysis pipeline works for both camera captures and uploaded photos

This implementation enables consistent testing with known images while preserving all existing camera functionality. Perfect for hackathon demos and end-to-end testing scenarios.
