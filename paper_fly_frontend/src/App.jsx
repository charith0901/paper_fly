import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const { Content, Header, Footer } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Navbar />
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="container" style={{ padding: 24, minHeight: 360 }}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Paper Fly ©2024</Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;