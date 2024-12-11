import { useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/globals.css";
import { ErrorProvider } from "@/contexts/ErrorContext"; // Import the ErrorProvider
import NetworkError from "@/components/NetworkError"; // Import the NetworkError component
import Router from "next/router";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Handle browser tab close or refresh
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required to show the confirmation dialog
    };

    // Handle in-app route changes
    const handleRouteChangeStart = (url) => {
      if (!confirm("Are you sure you want to leave this page?")) {
        Router.events.emit("routeChangeError");
        throw "Navigation aborted."; // Cancel navigation
      }
    };

    // Attach event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    Router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      // Cleanup event listeners on unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
      Router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, []);

  return (
    <ErrorProvider>
      <NetworkError /> {/* Show the error message globally */}
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </ErrorProvider>
  );
}
