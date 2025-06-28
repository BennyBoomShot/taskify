import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

const RequireAuth = ({ children}: { children: JSX.Element }) => {
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? children : <Navigate to="/login" />;
};

export default RequireAuth;