"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Chrome } from "lucide-react";

// Add type declaration for google global object
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string | undefined;
            callback: (response: { credential: string }) => Promise<void>;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme: string;
              size: string;
              width: string;
              text: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleAuth() {
  const { socialLogin } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Client ID is configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setError("Google Client ID not configured");
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables");
      return;
    }

    if (typeof window !== "undefined" && window.google) {
      initializeGoogleSignIn();
    } else {
      // Load Google Sign-In script
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        setError("Failed to load Google Sign-In script");
      };
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "sign_in_with_google",
        });

        console.log("Google Sign-In initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
        setError("Failed to initialize Google Sign-In");
      }
    }
  };

  const handleGoogleResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Google credential received, attempting login...");
      const result = await socialLogin("google", response.credential);
      
      if (!result.success) {
        setError(result.error || "Google authentication failed");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      setError("Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full p-3 border border-red-300 rounded-md bg-red-50 text-red-700 text-sm">
        Google Sign-In Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={googleButtonRef} 
        className={`w-full ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      />
      {isLoading && (
        <div className="text-center text-sm text-gray-600 mt-2">
          Signing in with Google...
        </div>
      )}
    </div>
  );
}