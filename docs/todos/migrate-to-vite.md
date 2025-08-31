# Migrate to Vite from Parcel

## Current Setup Analysis

### Current Parcel Configuration
- **Build command:** `parcel build src/index.html`
- **Dev command:** `parcel src/index.html`
- **Entry point:** `src/index.html`
- **TypeScript:** Configured with React JSX support
- **Dependencies:** React 17, TypeScript, React Router DOM

### Why Migrate to Vite?
- Faster cold starts and hot module replacement
- Better TypeScript integration
- Modern build tool with better ecosystem support
- Native ES modules support
- Better development experience

## Migration Plan

### Step 1: Install Vite Dependencies
- Remove Parcel
- Install Vite + React plugin + TypeScript plugin
- Install necessary dev dependencies

### Step 2: Configuration Files
- Create `vite.config.ts` with React plugin
- Update `tsconfig.json` for Vite compatibility
- Move HTML entry point to project root

### Step 3: Update Scripts
- Replace Parcel commands with Vite equivalents
- Update dev server script in `.agents/toolbox/`

### Step 4: File Structure Changes
- Move `index.html` from `src/` to project root
- Update HTML template for Vite conventions
- Ensure all imports work with Vite's ES module system

### Step 5: Testing & Verification
- Test dev server functionality
- Test build process
- Verify all existing functionality works
- Run Playwright tests to ensure no regressions

## Research Notes

### Vite vs Parcel Key Differences
1. **Entry Point:** Vite expects `index.html` in root, Parcel can have it anywhere
2. **Module Resolution:** Vite uses native ES modules, may need import path updates
3. **Environment Variables:** Vite uses `VITE_` prefix for client-side env vars
4. **Build Output:** Different default output structure

### Compatibility Considerations
- React 17 is fully supported by Vite
- TypeScript configuration should work with minimal changes
- React Router DOM should work without changes
- Existing CSS and asset imports should work

## Implementation Steps

1. **Backup Current State:** Ensure git is clean before starting
2. **Install Dependencies:** Remove Parcel, add Vite ecosystem
3. **Create Config:** Set up `vite.config.ts`
4. **Move Files:** Restructure entry point (move index.html to root)
5. **Update Scripts:** Change package.json commands
6. **Update Dev Server Script:** Modify `.agents/toolbox/dev_server.sh`
7. **Test Everything:** Ensure no functionality is broken

## Detailed Implementation Plan

### Dependencies to Remove
- `parcel`

### Dependencies to Add
- `vite`
- `@vitejs/plugin-react`

### File Changes
- Move `src/index.html` to project root
- Update HTML template to use `/src/index.tsx` instead of `./index.tsx`
- Create `vite.config.ts` in project root

### Script Updates
- `dev`: `vite` (default serves from root, looks for index.html)
- `build`: `vite build`
- `serve`: `vite preview`

## Expected Challenges
- Import path resolution differences
- HTML template adjustments
- Dev server script updates
- Build output path changes for deployment

## Progress

### Completed Steps ✅
1. **Dependencies Updated:** Removed Parcel, installed Vite + @vitejs/plugin-react
2. **Configuration Created:** Set up vite.config.ts with React plugin, proper env handling
3. **File Structure Updated:** Moved index.html to root, updated asset paths
4. **Scripts Updated:** Changed package.json to use Vite commands
5. **Environment Variables Fixed:** Configured envPrefix and process.env mapping
6. **Dev Server Script:** Updated comments, works with Vite seamlessly

### Test Results ✅
- **Dev server:** Starts correctly on port 1234
- **Build process:** Completes successfully (370ms build time)
- **Welcome screen:** Loads and renders properly
- **Navigation:** React Router working correctly
- **Dashboard:** Full functionality preserved
- **Photo Capture:** Screen accessible and functional
- **No JavaScript errors:** Console clean except expected React Router warnings

### Key Changes Made
- Removed `parcel` dependency, added `vite` and `@vitejs/plugin-react`
- Created `vite.config.ts` with proper React plugin and environment variable support
- Moved `src/index.html` → `index.html` and updated asset paths to `/src/`
- Updated package.json scripts: `dev`, `build`, `serve` now use Vite
- Configured `envPrefix` to allow Canvas, Phenoml, Keywell, Keragon, Metriport environment variables
- Added `define: { 'process.env': 'import.meta.env' }` to handle Node.js globals

## Success Criteria ✅
- ✅ Dev server starts and works correctly
- ✅ Build process completes successfully 
- ✅ All existing functionality preserved
- ✅ Navigation and React components working
- ✅ Environment variables properly handled
