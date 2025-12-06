import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("dosen_auth") === "true";
  const expiresAt = localStorage.getItem("dosen_expires_at");
  const now = Date.now();

  // if !login → redirect
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/dosen/login"
        replace
      />
    );
  }

  // expiry 
  if (expiresAt && now > Number(expiresAt)) {
    localStorage.removeItem("dosen_auth");
    localStorage.removeItem("dosen_name");
    localStorage.removeItem("dosen_expires_at");

    return (
      <Navigate
        to="/dosen/login"
        replace
      />
    );
  }

  return children;
}
