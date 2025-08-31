# Add React Router, Axios, Camera Libraries

## Research Summary

### 1. React Router
- **Recommended**: React Router v6 (latest stable)
- **Package**: `react-router-dom`
- **Compatibility**: Works with React 17+
- **Features needed**: 
  - Browser routing for SPA navigation
  - Route protection (authenticated routes)
  - Navigation between screens (Welcome → Login → Dashboard, etc.)

### 2. HTTP Client
- **Recommended**: Axios
- **Package**: `axios` 
- **Why**: 
  - Better error handling than fetch
  - Request/response interceptors for auth tokens
  - Built-in JSON handling
  - Good TypeScript support
- **Alternative**: Native fetch with custom wrapper

### 3. Camera Library
- **Recommended**: `react-webcam`
- **Package**: `react-webcam`
- **Why**:
  - Most mature and stable
  - Good mobile support
  - Simple API for photo capture
  - Works with MediaDevices API
- **Alternative**: `react-camera-pro` (newer but less mature)
- **Requirements**:
  - HTTPS required for camera access (except localhost)
  - getUserMedia API support
  - Photo capture with constraints (resolution, format)

### 4. Additional Libraries to Consider
- **TypeScript types**: `@types/react-router-dom`
- **Camera permissions**: Handled by browser APIs
- **Image processing**: May need `canvas-api` utilities

## Installation Plan

```bash
npm install react-router-dom axios react-webcam
npm install --save-dev @types/react-router-dom
```

## Implementation Notes
- Router setup needed in main App component
- Axios interceptors for Canvas Medical OAuth tokens
- Camera component will need permission handling
- HTTPS requirement for camera on production (Vercel handles this)

## Progress

### Completed
- [x] Research React Router v6 compatibility
- [x] Research HTTP client options (Axios vs fetch)  
- [x] Research camera libraries for React
- [x] Documented installation plan
- [x] Install packages via npm
- [x] Test build compatibility
- [x] Update package.json

### Installation Results
- **React Router v6** (6.30.1): Successfully installed, compatible with React 17
- **Axios** (1.11.0): Successfully installed
- **React Webcam** (7.2.0): Successfully installed
- **TypeScript types**: @types/react-router-dom (5.3.3) installed

### Build Test
- `npm run build` passes successfully
- All libraries integrated without conflicts
- Build size: 131KB (reasonable for SPA with routing)

### Next Steps
- Ready for implementation in components
- Router setup needed in App.tsx
- Camera permissions handling required for mobile
