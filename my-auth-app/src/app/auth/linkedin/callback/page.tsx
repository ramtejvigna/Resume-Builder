"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LinkedInCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socialLogin } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      if (error) {
        console.error("LinkedIn auth error:", error);
        router.push("/login?error=linkedin_auth_failed");
        return;
      }

      if (code && state) {
        // Verify state
        const storedState = localStorage.getItem("linkedin_state");
        if (state !== storedState) {
          console.error("State mismatch");
          router.push("/login?error=state_mismatch");
          return;
        }

        try {
          // Exchange code for access token
          const response = await fetch("/api/auth/linkedin-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();

          if (data.access_token) {
            await socialLogin("linkedin", data.access_token);
          } else {
            throw new Error("No access token received");
          }
        } catch (error) {
          console.error("LinkedIn token exchange error:", error);
          router.push("/login?error=linkedin_token_failed");
        } finally {
          localStorage.removeItem("linkedin_state");
          setIsProcessing(false);
        }
      }
    };

    handleCallback();
  }, [router, searchParams, socialLogin]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {isProcessing && (
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      )}
    </div>
  );
}
