import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

// Import Bootstrap icons
import { BsCart } from 'react-icons/bs';

const Navbar = () => {

  // const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState(null)

  useEffect(() => {
    const fetchLoginDetails = () => {
      if(localStorage.getItem("id") !== null) {
        setIsAuthenticated(true)
        setUserName(localStorage.getItem('firstName'))
      }
    }
    fetchLoginDetails()
  }, [])

  const handleLogout = () => {
    window.location.reload();
    localStorage.removeItem('id')
    localStorage.removeItem('firstName')
    setIsAuthenticated(false)
    setUserName(null)
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Munch</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            {isAuthenticated &&
              <li className="nav-item">
              <Link className="nav-link" to="/orders">My Orders</Link>
            </li>
            }
            
          </ul>
          <ul className="navbar-nav">
            {/* Cart Icon */}
            {!isAuthenticated ?
              <>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </> : 
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <BsCart className="cart-icon" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link">Hi, {userName}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn-hover-red" onClick={handleLogout}>Logout</Link>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
