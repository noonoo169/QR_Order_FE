import React from 'react';
import { Navigate, Route  } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // return children

    if (localStorage.getItem("table_id")) {
        return children
    }

  return <Navigate to="/login"/>
};

export default ProtectedRoute;
