import { useState } from "react";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerification = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message
    try {
      const apiKey = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // Your API key
      const callbackUrl = "https://noble-stevena-madhan-4575059f.koyeb.app/"; // Replace with your website URL

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

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (data?.shortenedUrl) {
        window.location.href = data.shortenedUrl; // Redirect user to GPLinks shortened URL
      } else {
        throw new Error("No shortened URL received from server.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("An error occurred while contacting the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <h1>Please verify your account to access the homepage.</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button
          onClick={handleVerification}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify via GPLinks"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      <p>You have successfully verified your account.</p>
    </div>
  );
}
