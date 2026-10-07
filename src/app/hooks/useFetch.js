import { useEffect, useState } from 'react';

function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(url));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return undefined;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url, { ...options, signal: controller.signal });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const result = await response.json();
                if (controller.signal.aborted) {
                    return;
                }
                setData(result);
            } catch (err) {
                if (controller.signal.aborted || err.name === 'AbortError') {
                    return;
                }
                setError(err);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [url]);

    return { data, loading, error };
}

export default useFetch;