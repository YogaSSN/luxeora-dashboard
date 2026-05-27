import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Admin Pages
import DashboardHome from './pages/DashboardHome';
import ProductsManager from './pages/ProductsManager';
import ShowroomManager from './pages/ShowroomManager';
import OrdersManager from './pages/OrdersManager';

export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="zones" element={<ShowroomManager />} />
          <Route path="orders" element={<OrdersManager />} />
        </Route>
      </Route>
    </Routes>
  );
}
