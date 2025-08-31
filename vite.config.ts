import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 1234, // Match Parcel's default port for consistency
    open: false,
  },
  define: {
    'process.env': 'import.meta.env',
  },
  envPrefix: ['VITE_', 'CANVAS_', 'PHENOML_', 'KEYWELL_', 'KERAGON_', 'METRIPORT_'],
});
