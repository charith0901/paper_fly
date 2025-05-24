import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import NewspaperList from '../components/newspaper/NewspaperList';
import AddNewspaper from '../components/newspaper/AddNewspaper';
import EditNewspaper from '../components/newspaper/EditNewspaper';
import ProtectedRoute from '../components/common/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/newspapers" element={<NewspaperList />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/newspapers/add" element={<AddNewspaper />} />
            <Route path="/newspapers/edit/:id" element={<EditNewspaper />} />
          </Route>
          
          {/* Admin routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            {/* Add admin-only routes here */}
          </Route>
          
          {/* Redirect to newspapers list as home page */}
          <Route path="/" element={<Navigate to="/newspapers" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;