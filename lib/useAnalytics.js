import { useEffect, useState } from "react";
import axios from "axios";

export default function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/Analytics").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
