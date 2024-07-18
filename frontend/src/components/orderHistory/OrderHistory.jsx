import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';

const MyOrders = () => {
  const [isAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("isAdmin", isAdmin)
        const response = await axios.get(`http://localhost:5000/orders/user`, {
          params: { customerId: localStorage.getItem("id"), admin: isAdmin }
        });
        console.log(response)
        setOrders(response.data.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (e) {
        console.log(e);
      }
    };

    fetchOrders();
  }, []);

  const [selectedStatus, setSelectedStatus] = useState({});

  const handleStatusChange = async (orderId, status) => {
    // Update the order status
    try{
      const response = await axios.patch("http://localhost:5000/orders/", {_id:orderId, orderStatus:status})
      console.log(`Order ID: ${orderId}, Status: ${status}`);
      setSelectedStatus({ ...selectedStatus, [orderId]: status });
    } catch(e) {
      console.log(e)
    }
    
  };

  const getStatusColor = (status) => {
    console.log(status)
    switch (status) {
      case 'preparing':
        return {text:'text-danger', button:"danger", bg:"badge bg-danger"}
      case 'ready for delivery':
        return {text:'text-warning', button:"warning", bg:"badge bg-warning"};
      case 'order picked':
        return {text:'text-info', button:"info", bg:"badge bg-info"};
      case 'delivered':
        return {text:'text-success', button:"success", bg:"badge bg-success"};
      default:
        return {text:'', button:"primary", bg:"badge bg-primary"};
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">My Orders</h2>
      <Row xs={1} md={2} className="g-4">
        {orders.map(order => (
          <Col key={order._id}>
            <Card className="mb-4">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <p className="fw-bold mb-0">Ordered Date: {new Date(order?.orderDate).toDateString()}</p>
                    <p className="fw-bold mb-0 mt-2">Delivery Address: {order.address.streetAddress}, {order.address.city}</p>
                  </Col>
                  <Col md={6} className="text-end">
                    {isAdmin ? 
                      <DropdownButton id="dropdown-basic-button" title={selectedStatus[order._id] || "Order Status"} variant={getStatusColor(selectedStatus[order._id]).button}>
                        <Dropdown.Item onClick={() => handleStatusChange(order._id, 'preparing')} className={getStatusColor('preparing').text}>Preparing</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange(order._id, 'ready for delivery')} className={getStatusColor('ready for delivery').text}>Ready for Delivery</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange(order._id, 'order picked')} className={getStatusColor('order picked').text}>Order Picked Up</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange(order._id, 'delivered')} className={getStatusColor('delivered').text}>Delivered</Dropdown.Item>
                      </DropdownButton>
                    :
                      <p className={getStatusColor(order?.orderStatus).bg}>{order?.orderStatus.toUpperCase() || "Approved"}</p>
                    }
                    
                  </Col>
                </Row>
                <hr />
                <Row className="mt-3">
                  <Col md={6}>
                    <h5>Items:</h5>
                    <p>{order.product.map(item => item.name).join(', ')}</p>
                  </Col>
                  <Col md={6} className="text-end">
                    <h5>Total Price: ${order.orderTotal}</h5>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MyOrders;
