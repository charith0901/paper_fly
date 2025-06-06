import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NewspaperList from './components/newspaper/NewspaperList';
import AddNewspaper from './components/newspaper/AddNewspaper';
import EditNewspaper from './components/newspaper/EditNewspaper';
import ProtectedRoute from './components/common/ProtectedRoute';
import DailyReceiveForm from './components/dailyReceive/DailyReceiveForm';
import BillList from './components/bill/BillList';
import BillDetail from './components/bill/BillDetail';
import BillForm from './components/bill/BillForm';
import DailyReceiveDetail from './components/dailyReceive/DailyReceiveDetail';
import BillEditForm from './components/bill/BillEditForm';
import HomePage from './components/landing_page/Home_Page';

const { Content, Header, Footer } = Layout;

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isHome && (
        <Header style={{ background: '#fff', padding: 0 }}>
          <Navbar />
        </Header>
      )}
      <Content>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />



          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/newspapers/add" element={<AddNewspaper />} />
            <Route path="/newspapers/edit/:id" element={<EditNewspaper />} />
            <Route path="/newspapers" element={<NewspaperList />} />
            
            {/* Daily receive routes */}
            <Route path='/receive/new' element={<DailyReceiveForm />} />
            <Route path='/receive/edit/:id' element={<DailyReceiveForm />} />
            <Route path='/receive/:id' element={<DailyReceiveDetail />} />

            {/* Bill routes */}
            <Route path="/bills" element={<BillList />} />
            <Route path="/bills/:id" element={<BillDetail />} />
            <Route path="/bills/new" element={<BillForm />} />
            <Route path="/bills/edit/:id" element={<BillEditForm />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            {/* Add admin-only routes here */}
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', marginTop: 50 }}>
                <NotificationOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
                <div style={{ marginTop: 16, fontSize: 18 }}>Page not found</div>
              </div>
            }
          />
        </Routes>
      </Content>
      {!isHome && (
        <Footer style={{ textAlign: 'center' }}>Paper Fly ©2024</Footer>
      )}
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;