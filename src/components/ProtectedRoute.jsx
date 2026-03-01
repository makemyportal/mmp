import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { currentUser, userData } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && userData?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
