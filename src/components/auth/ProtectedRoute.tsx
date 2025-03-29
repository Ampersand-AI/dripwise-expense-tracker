import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  // Prepare redirect URL with current location
  const redirectToSignIn = () => {
    const redirectUrl = encodeURIComponent(window.location.href);
    return <Navigate to={`/sign-in?redirect_url=${redirectUrl}`} replace />;
  };

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        {redirectToSignIn()}
      </SignedOut>
    </>
  );
};

export default ProtectedRoute; 