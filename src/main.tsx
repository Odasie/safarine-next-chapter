import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = "pk_live_Y2xlcmsuc2FmYXJpbmUuY29tJA"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function ensureDesignTokens() {
  try {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const primary = computed.getPropertyValue('--primary');
    if (!primary || primary.trim() === '') {
      if (!document.getElementById('design-token-fallback')) {
        const s = document.createElement('style');
        s.id = 'design-token-fallback';
        s.textContent = `
:root{
  --background: 0 0% 100%;
  --foreground: 0 0% 20%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 20%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 20%;
  --primary: 124 55% 24%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 20%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 40%;
  --accent: 34 100% 50%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 124 55% 24%;
  --radius: 0.5rem;
}
body{background-color:hsl(var(--background));color:hsl(var(--foreground));}
header[data-fallback="1"]{background-color:hsl(var(--primary));color:hsl(var(--primary-foreground));}
`;
        document.head.appendChild(s);
        console.warn('Design token fallback injected (index.css not detected).');
      }
    }
  } catch {
    // no-op
  }
}
ensureDesignTokens();

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
