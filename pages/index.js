import { useEffect, useState } from "react";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle verification via gplinks.com
  const handleVerify = async () => {
    const apiKey = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // Your gplinks API Key
    const callbackUrl = `${window.location.origin}/?verified=true`;

    try {
      // Request shortened URL from gplinks
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
      console.log(data); // Log the response for debugging

      if (response.ok && data.status === "success" && data.shortenedUrl) {
        // Redirect user to gplinks verification page
        window.location.href = data.shortenedUrl;
      } else {
        throw new Error("Failed to generate verification URL. Please try again.");
      }
    } catch (error) {
      console.error("Error generating gplinks URL:", error);
      setErrorMessage("An error occurred while trying to generate the verification URL. Please try again later.");
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const isVerifiedParam = params.get("verified");
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("expiry");

        console.log("Token:", token);
        console.log("Expiry:", expiry);
        console.log("Verified param:", isVerifiedParam);

        // If the URL has 'verified=true' (after the user verifies via gplinks), generate a new token
        if (isVerifiedParam === "true") {
          // Generate and store a new token valid for 24 hours
          const newToken = Math.random().toString(36).substr(2); // Create a random token
          const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
          localStorage.setItem("token", newToken);
          localStorage.setItem("expiry", expiryTime.toString());
          setIsVerified(true);
          setLoading(false); // Done loading
        } else if (token && expiry && new Date().getTime() < Number(expiry)) {
          // If token exists and is still valid, mark as verified
          setIsVerified(true);
          setLoading(false); // Done loading
        } else {
          // If no token or expired token, show the verification dialog
          setLoading(false); // Done loading
          setShowVerifyDialog(true); // Show the verification dialog
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
        setErrorMessage("An error occurred while checking the verification status. Please try again later.");
        setLoading(false); // Done loading even on error
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading text while waiting for the verification status
  }

  if (showVerifyDialog) {
    // Show the verification dialog if not verified
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Verification Required</h1>
        <p>You must verify your account to access the homepage.</p>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Display error message */}
        <button
          onClick={handleVerify}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Verify via gplinks.com
        </button>
      </div>
    );
  }

  // Once verified, show the homepage content
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>You have successfully verified your account.</p>
    </div>
  );
}
