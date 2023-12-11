import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const tableId = localStorage.getItem("table_id");
      const tableAccessKey = localStorage.getItem("table_access_key");

      if (tableId && tableAccessKey) {
        try {
          const responseTableAccessKey = await axios.get(
            `${process.env.REACT_APP_BE_URL}/api/table/${tableId}`
          );
          if (responseTableAccessKey.data.tableAccessKey !== tableAccessKey) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        } catch (error) {
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/tableOrderedError" />;
  }

  return children;
};

export default ProtectedRoute;
