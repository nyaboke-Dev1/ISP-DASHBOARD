import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Redirects to the sign-in page when there is no active staff session.
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  return {
    checked: !loading,
    signedIn: Boolean(user),
  };
}