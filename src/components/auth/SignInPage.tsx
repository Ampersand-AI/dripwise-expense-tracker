import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { dark } from "@clerk/themes";

const SignInPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect_url') || '/';
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>
        
        <SignIn 
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "mx-auto w-full flex items-center justify-center",
              card: "bg-background shadow-lg",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsIconButton: "bg-black text-white hover:bg-black/80 border-none",
              socialButtonsBlockButton: "bg-black text-white hover:bg-black/80 border-none",
              socialButtonsProviderIcon: "text-white",
              dividerLine: "bg-border",
              formFieldInput: "bg-background border border-input",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              footerAction: "text-muted-foreground",
              identityPreviewEditButton: "text-primary",
              formFieldWarning: "text-destructive text-sm",
              formFieldError: "text-destructive text-sm",
              footer: "hidden",
              logoBox: "hidden",
              logoImage: "hidden"
            }
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl={redirectUrl}
        />
      </motion.div>
    </div>
  );
};

export default SignInPage; 