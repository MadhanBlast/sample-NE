// /hooks/useFetchData.js
import axios from "axios";
import { useEffect, useState } from "react";
import { useError } from "@/contexts/ErrorContext"; // Import the useError hook

function useFetchData(apiEndpoint) {
  const [alldata, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const { setNetworkError } = useError(); // Access the error setter from the context

  useEffect(() => {
    if (initialLoad) {
      // Set initialLoad to false to prevent the API call on subsequent renders
      setInitialLoad(false);
      setLoading(false);
      return; // Exit early if initialLoad is true
    }

    // Set loading to true to indicate data fetching is in progress
    setLoading(true);

    const fetchAllData = async () => {
      try {
        const res = await axios.get(apiEndpoint);
        const alldata = res.data;
        setAllData(alldata);
        setLoading(false); // Set loading to false after data is fetched
        setNetworkError(null); // Clear network error if the request is successful
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setLoading(false); // Set loading to false if there's an error
        setNetworkError("Network Error: Unable to fetch data"); // Set the global network error message
      }
    };

    if (apiEndpoint) {
      fetchAllData(); // Only fetch data if the API endpoint exists
    }
  }, [initialLoad, apiEndpoint, setNetworkError]); // Trigger useEffect when initialLoad or apiEndpoint changes

  return { alldata, loading };
}

export default useFetchData;
