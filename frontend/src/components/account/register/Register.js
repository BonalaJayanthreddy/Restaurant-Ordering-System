import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ssn: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    dob: '',
    gender: ''
  });

  const [validated, setValidated] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [registerAsEmployee, setRegisterAsEmployee] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await axios.post("http://localhost:5000/register/", {"data": formData, "isEmployee": registerAsEmployee});
        console.log(response);
        console.log(formData);
        setValidated(false);
        setShowError(false);
        navigate('/login');
      } catch (error) {
        console.log(error);
        setShowError(true);
        setErrorMessage(error.response.data.message);
      }
    }
    setValidated(true);
  };

  return (
    <div style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
      <Container>
        <Row className="justify-content-md-center mt-5">
          <Col md={6}>
            <h2 className="text-center">Register</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid first name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid last name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email address.
                </Form.Control.Feedback>
              </Form.Group>
              <Row>
                <Col>
                <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
                </Col>
                <Col>
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid confirmation password.
                </Form.Control.Feedback>
              </Form.Group>
                </Col>
              </Row>
              
              
              {registerAsEmployee ? (
                <Form.Group controlId="formSSN" className="mb-3">
                <Form.Label>SSN</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter SSN"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  required={registerAsEmployee}
                  pattern="^\d{3}-\d{2}-\d{4}$"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid SSN in the format XXX-XX-XXXX.
                </Form.Control.Feedback>
              </Form.Group>
              ) : null}
              <Row>
                <Col>
                  <Form.Group controlId="formStreet" className="mb-3">
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid street.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCity" className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                  type="text"
                  placeholder="Enter city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid city.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formState" className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid state.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formZipCode" className="mb-3">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter zip code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid zip code.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formDOB" className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter date of birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid date of birth.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formGender" className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select your gender.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          {showError && (
            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
              {errorMessage}
            </Alert>
          )}
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Register
          </Button>
          <div className="text-center">
            <Button variant="link" onClick={() => setRegisterAsEmployee(!registerAsEmployee)}>
              {registerAsEmployee ? 'Register as Customer' : 'Register as Employee'}
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  </Container>
</div>
  );
};

export default Register;
