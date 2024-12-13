import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("[LOG] Checking token validity on app load...");
    const storedToken = localStorage.getItem('verificationToken');
    if (storedToken) {
      const { expiry } = JSON.parse(storedToken);
      if (new Date().getTime() < expiry) {
        console.log("[LOG] Token found and is still valid.");
        setIsVerified(true);
        return;
      }
      console.log("[LOG] Token found but expired.");
    } else {
      console.log("[LOG] No token found in localStorage.");
    }
    setIsVerified(false);
  }, []);

  const handleVerify = async () => {
    setIsLoading(true);
    setErrorMessage("");
    console.log("[LOG] Initiating verification process...");
    const apiKey = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = `${window.location.origin}/?verified=true`;
    console.log("[DEBUG] API Key:", apiKey);
    console.log("[DEBUG] Callback URL:", callbackUrl);

    try {
      const response = await fetch("https://gplinks.in/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api: apiKey,
          url: callbackUrl,
        }),
      });

      const data = await response.json();
      console.log("[LOG] API Response:", data);

      if (response.ok && data.status === "success" && data.shortenedUrl) {
        console.log("[LOG] Verification URL generated successfully:", data.shortenedUrl);
        setIsLoading(false);
        window.location.href = data.shortenedUrl;
      } else {
        console.error("[ERROR] API did not return a successful status:", data);
        setIsLoading(false);
        setErrorMessage(data.message || "Failed to generate verification URL.");
      }
    } catch (error) {
      console.error("[ERROR] Fetch failed:", error);
      setIsLoading(false);
      setErrorMessage("An error occurred while contacting the server. Please try again later.");
    }
  };

  const handleTokenVerification = () => {
    console.log("[LOG] User redirected back with verification. Saving token...");
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem('verificationToken', JSON.stringify({ token: 'valid-token', expiry: expiryTime }));
    setIsVerified(true);
  };

  useEffect(() => {
    console.log("[LOG] Checking for verification callback...");
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      console.log("[LOG] Verification callback detected. Marking user as verified.");
      handleTokenVerification();
    } else {
      console.log("[LOG] No verification callback detected.");
    }
  }, []);

  return (
    <div>
      {!isVerified ? (
        <div>
          <h1>Verification Required</h1>
          <p>Please verify your account to access the homepage.</p>
          {errorMessage && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              {errorMessage}
            </div>
          )}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <button onClick={handleVerify}>Verify via GPLinks</button>
          )}
        </div>
      ) : (
        <div>
          <h1>Welcome to the Home Page!</h1>
          <p>You have successfully verified your account and can now access the content.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
