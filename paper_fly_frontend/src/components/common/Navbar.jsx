import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
import { Menu, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined, HomeOutlined, ReadOutlined } from '@ant-design/icons';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="username" icon={<UserOutlined />}>
        Hello, {user?.username}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav style={{ background: '#1677ff', padding: '0 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        <Link to="/" style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', textDecoration: 'none' }}>
          PaperFly
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff' }}>
            <HomeOutlined /> Home
          </Link>
          <Link to="/newspapers" style={{ color: '#fff' }}>
            <ReadOutlined /> Newspapers
          </Link>
          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <Button type="link" style={{ color: '#fff' }} icon={<UserOutlined />}>
                {user.username}
              </Button>
            </Dropdown>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff' }}>
                <LoginOutlined /> Login
              </Link>
              <Link to="/register" style={{ color: '#fff' }}>
                <UserAddOutlined /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
