import { useEffect, useState } from "react"

const useFetch = <T>(fetchFunction : () => Promise<T> , autoFetch = true) => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
  
      setData(result);
    } catch (error) {
      console.log(error)
      //@ts-ignore
      setError(error instanceof Error ? error : "The has been an issue");
      setLoading(false);
    }finally{
      setLoading(false);
    }
  }

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  }

  useEffect(() => {
    if(autoFetch) {
      fetchData;
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData, reset};
} 