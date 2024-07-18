import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Register from './components/account/register/Register';
import Login from './components/account/login/login';
import Cart from './components/cart/cart';
import Checkout from './components/Checkout/Checkout';
import PrivateRoute from './components/PrivateRoute';
import MyOrders from './components/orderHistory/OrderHistory';
import Loading from './components/Loading/Loading';
import NotFound from './components/NotFound';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      const isLoggedIn = localStorage.getItem('firstName') !== null;
      setIsAuthenticated(isLoggedIn);
    }, 2000);

    return () => clearTimeout(delay);
  }, []);

  if (isAuthenticated === null) {
    return <Loading />; // Render the loading animation
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute element={Home} isAuthenticated={isAuthenticated}/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/cart' element={<PrivateRoute element={Cart} isAuthenticated={isAuthenticated}/>} />
          <Route path='/checkout' element={<PrivateRoute element={Checkout} isAuthenticated={isAuthenticated}/>} />
          <Route path='/orders' element={<PrivateRoute element={MyOrders} isAuthenticated={isAuthenticated}/>} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
        <Footer />
        
      </div>
    </Router>
  );
};


export default App;
