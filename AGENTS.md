# Woundsnap - AI Wound Care Analysis

**Project:** React/TypeScript app for AI-powered wound analysis with clinical workflow automation
**Goal:** Integrate 6 sponsor APIs (Canvas Medical, Google MedGemma, Phenoml, Keragon, Metriport, eKare.ai) for hackathon

## Commands
- `npm run dev` - Start development server (Parcel)
- `npm run build` - Build for production  
- `npm run test` - Run all tests (Mocha + TSX)
- `npm run deploy` - Deploy to Vercel

## Dev Server Script
- `.agents/toolbox/dev_server.sh start` - Start dev server in background with logging
- `.agents/toolbox/dev_server.sh stop` - Stop background dev server
- `.agents/toolbox/dev_server.sh tail -f` - Follow server logs in real-time
- **Logs:** `/tmp/dev_server/server.log`
- **PID:** `/tmp/dev_server/pid.txt`

## Architecture
- **Frontend:** React 17 + TypeScript, Parcel bundler, deployed on Vercel
- **APIs:** 6 healthcare integrations for complete clinical workflow
- **Flow:** Photo capture → MedGemma AI analysis → Canvas FHIR storage → Keragon automation
- **Structure:** `/src` main code, `/docs/Hackathon` for specs, TODO.md for task tracking

## Code Style
- **Format:** Prettier with tabs (tabWidth: 2), strict TypeScript
- **Imports:** ES modules with esModuleInterop
- **Files:** Use `.tsx` for React components, `.ts` for utilities
- **Naming:** PascalCase for components, camelCase for functions/variables
- **Testing:** Mocha tests in `*.test.ts` files alongside source
