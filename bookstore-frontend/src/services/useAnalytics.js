import { useEffect, useState } from "react";
import api from "./axios";

const useAnalytics = () => {
    const [data, setData] = useState({ orders: [], genres: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async() => {
            try {
                const res1 = await api.get("/analytics/orders");
                const res2 = await api.get("/analytics/genres");

                setData({
                    orders: Array.isArray(res1.data) ? res1.data : [],
                    genres: Array.isArray(res2.data) ? res2.data : [],
                });
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                setData({ orders: [], genres: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data, loading };
};

export default useAnalytics;