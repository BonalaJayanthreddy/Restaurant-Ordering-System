import React, { useState, useEffect } from 'react';
import { BsPlus, BsDash, BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  // Example cart items data
  const exampleCartItems = [
    { _id: "item_id1", name: "Big Mac", price: 5.99, count: 1, image: "https://via.placeholder.com/150" },
    { _id: "item_id2", name: "Quarter Pounder", price: 6.49, count: 1, image: "https://via.placeholder.com/150" }
    // Add more items as needed
  ];

  useEffect(() => {
    // Fetch cart items from backend or set from local storage
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cart/customer/${localStorage.getItem("id")}`)
        console.log(response)
        setCartItems(response.data.data.product)
        setCartId(response.data.data._id)
      } catch(e) {
        console.log(e)
      }
    }


    // For this example, setting example cart items
    // setCartItems(exampleCartItems);
    fetchCartItems()
  }, []);

  // Calculate total price
  const totalPrice = cartItems ? cartItems?.reduce((acc, item) => acc + item.price * item.count, 0) : 0;

  const handlePlaceOrder = () => {
    // Navigate to Checkout component and pass total price as prop
    navigate('/checkout', {state: { totalPrice }});

    // history.push('/checkout', { totalAmount: totalPrice });
  };

  const handleIncreasecount = async (item) => {
    try {
      const payLoad = {
        _id : item._id,
        productId : item.productId,
        count : item.count + 1
      }
      console.log("Payload", payLoad)
      const response = await axios.patch('http://127.0.0.1:5000/cart/', payLoad)
      console.log(response)

      setCartItems(prevItems =>
        prevItems.map(cartItem =>
          cartItem._id === item._id ? { ...cartItem, count: cartItem.count + 1 } : cartItem
        )
      );
    } catch (e) {
      console.log(e)
    }
  };

  const handleDecreasecount = async (item) => {
    try {
      const payLoad = {
        _id : item._id,
        productId : item.productId,
        count : item.count - 1
      }
      console.log("Payload", payLoad)
      const response = await axios.patch('http://127.0.0.1:5000/cart/', payLoad)
      console.log(response)

      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === item._id && item.count > 1 ? { ...item, count: item.count - 1 } : item
        )
      );
    } catch (e) {
      console.log(e)
    }
    
  };

  const handleDeleteItem = async (cartId) => {

    try {

      const response = await axios.delete(`http://localhost:5000/cart/${cartId}`)

      setCartItems(prevItems =>
        prevItems.filter(item => item._id !== cartId)
      );
    } catch(e) {

    }


  };

  return (
    <div className="container mt-5">
      
      {cartItems?.length > 0 ? 
      <>
      <h2 className="mb-4">Cart</h2>
      {cartItems?.map(item => (
        <div key={item._id} className="row border rounded mb-3 p-2 align-items-center">
          <div className="col-2">
            <img src="https://via.placeholder.com/150" className="img-fluid" alt={item.name} />
          </div>
          <div className="col-4">
            <h5>{item.name}</h5>
            <p>Price: ${item.price}</p>
          </div>
          <div className="col-3 d-flex align-items-center">
            <button className="btn btn-outline-secondary me-2" onClick={() => item.count > 1 ? handleDecreasecount(item): () => {}}><BsDash /></button>
            <span>{item.count}</span>
            <button className="btn btn-outline-secondary ms-2" onClick={() => handleIncreasecount(item)}><BsPlus /></button>
          </div>
          <div className="col-3 d-flex align-items-center justify-content-end">
            <button className="btn btn-danger me-2" onClick={() => handleDeleteItem(item._id)}><BsTrash /></button>
            <p>Total: ${(item.price * item.count).toFixed(2)}</p>
          </div>
        </div>
      ))}
      <p className="mt-3">Total Price: ${totalPrice?.toFixed(2)}</p>
      <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order</button>
      </>
      : (
        <div className="text-center mt-5">
        <h3>Your cart is empty</h3>
        <p>Start adding items to your cart to see them here.</p>
        <img src="empty_cart.svg" style={{height:330, width:330}} alt="Empty cart" className="img-fluid" />
      </div>
      )}
      
    </div>
  );
}

export default Cart;
