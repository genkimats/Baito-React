import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaitoContext } from '../context/BaitoProvider';
import { Button } from '@mui/material';
import '../css/NavBar.css';

function NavBar() {
  const { currentUser, logout } = useContext(BaitoContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-link">
          <span style={{ color: 'rgb(100, 181, 246)' }}>My</span>
          <span style={{ color: 'rgb(2, 136, 209)' }}>Baito</span>
        </Link>
      </div>
      <div className="navbar-links">
        {currentUser ? (
          <>
            <Link to="/" className="nav-link">
              Manage Workdays
            </Link>
            <Link to="/salary" className="nav-link">
              Check Salary
            </Link>
            <Link to="/settings" className="nav-link">
              Settings
            </Link>
            <Button
              variant="outlined"
              size="small"
              onClick={handleLogout}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
