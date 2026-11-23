import { useCallback, useEffect, useState } from "react";
import { getTrendingProducts } from "../api/productService.js";

// status is always explicit: "loading" | "ready" | "empty" | "error"
// (Checkpoint rule 2: never infer it from array length).
export function useTrendingProducts(limit) {
  const [state, setState] = useState({ status: "loading", products: [], error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading", products: [], error: null });

    getTrendingProducts({ limit })
      .then((products) => {
        if (!active) return;
        setState({ status: products.length > 0 ? "ready" : "empty", products, error: null });
      })
      .catch((error) => {
        if (!active) return;
        setState({ status: "error", products: [], error });
      });

    return () => { active = false; };
  }, [limit, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
