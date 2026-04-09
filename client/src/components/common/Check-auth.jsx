import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "superadmin") {
        return <Navigate to="/superadmin/dashboard" />;
      } else if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "superadmin") {
      return <Navigate to="/superadmin/dashboard" />;
    } else if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Block non-superadmin from superadmin routes
  if (
    isAuthenticated &&
    user?.role !== "superadmin" &&
    location.pathname.includes("/superadmin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Block non-admin (and non-superadmin) from admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    user?.role !== "superadmin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Block admin from shop
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Block superadmin from shop
  if (
    isAuthenticated &&
    user?.role === "superadmin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/superadmin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
