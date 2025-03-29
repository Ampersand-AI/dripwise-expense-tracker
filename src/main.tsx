import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

// Import publishable key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Ensure the key exists
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env file.")
}

// Combine Clerk's dark theme with our customizations
const customAppearance = {
  baseTheme: dark,
  elements: {
    // Remove Clerk branding
    footer: "hidden",
    logoBox: "hidden",
    logoImage: "hidden",
    socialButtonsIconButton: "bg-black text-white hover:bg-black/80 border-none",
    socialButtonsBlockButton: "bg-black text-white hover:bg-black/80 border-none",
    socialButtonsProviderIcon: "text-white",
  }
};

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    appearance={customAppearance}
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    afterSignInUrl="/"
    afterSignUpUrl="/"
  >
    <App />
  </ClerkProvider>
);
