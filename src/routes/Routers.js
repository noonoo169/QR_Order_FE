import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import AllFoods from "../pages/AllFoods";
import FoodDetails from "../pages/FoodDetails";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import TableOrderedError from "../pages/TableOrderedError";
import Register from "../pages/Register";
import ProtectedRoute from "../components/AuthTable/ProtectedRoute";
import Order from "../pages/Order";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/:table_id" element={<Home />} />
      <Route path="/foods" element={<ProtectedRoute> <AllFoods /> </ProtectedRoute>} />
      <Route path="/foods/:id" element={<ProtectedRoute> <FoodDetails /> </ProtectedRoute>} />
      <Route path="/order" element={< ProtectedRoute><Order /> </ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute> <Checkout /> </ProtectedRoute>} />
      <Route path="/tableOrderedError" element={<TableOrderedError />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Routers;
