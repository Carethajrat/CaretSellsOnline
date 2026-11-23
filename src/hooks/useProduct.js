import { useCallback, useEffect, useState } from "react";
import { getProductBySlug } from "../api/productService.js";

// status is always explicit: "loading" | "ready" | "not-found" | "error"
// ("not-found" is this view's resolved-but-empty state; Checkpoint rule 2).
export function useProduct(slug) {
  const [state, setState] = useState({ status: "loading", product: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading", product: null, error: null });

    getProductBySlug(slug)
      .then((product) => {
        if (!active) return;
        setState({ status: "ready", product, error: null });
      })
      .catch((error) => {
        if (!active) return;
        setState({ status: error?.status === 404 ? "not-found" : "error", product: null, error });
      });

    return () => { active = false; };
  }, [slug, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
