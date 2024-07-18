import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:5000/login/", formData)
      console.log(response.data.user)
      localStorage.setItem("id", response.data.user._id)
      localStorage.setItem("email", response.data.user.email)
      localStorage.setItem("firstName", response.data.user.firstName)
      localStorage.setItem("street", response.data.user.street)
      localStorage.setItem("city", response.data.user.city)
      localStorage.setItem("state", response.data.user.state)
      localStorage.setItem("postal", response.data.user.zipCode)
      localStorage.setItem("isAdmin", response.data.user.role === "admin" || response.data.user.role === "emp")
      console.log(response)
      setShowError(false)
      setErrorMessage(null)
      navigate('/')
      window.location.reload();
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.message)
      setShowError(true)
    }
    console.log(formData);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2 className="text-center">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            {showError && (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                  {errorMessage}
                </Alert>
              )}
            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
