import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalAmount = location.state ? location.state.totalPrice : 0;

  // State for Address Details Form
  const [addressFormData, setAddressFormData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  // State for Checkout Form
  const [checkoutFormData, setCheckoutFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [addressFormErrors, setAddressFormErrors] = useState({});
  const [checkoutFormErrors, setCheckoutFormErrors] = useState({});
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [isAutoFill, setIsAutoFill] = useState(true);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try{
        var user_id = localStorage.getItem("id")
        
      } catch (error) {
        console.log(error)
      }
    }

    fetchUserAddress()
  }, [])

  const handleAutoFillChange = (e) => {
    setIsAutoFill(!isAutoFill);
    if(isAutoFill) {
      setAddressFormData({
        streetAddress : localStorage.getItem("street"),
        city: localStorage.getItem("city"),
        state: localStorage.getItem("state"),
        postalCode: localStorage.getItem("postal"),
        country: 'United States'
      })
    } else {
      setAddressFormData({
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States'
      })
    }
  }

  // Handle changes in Address Details Form
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value
    });
  };

  // Handle changes in Checkout Form
  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutFormData({
      ...checkoutFormData,
      [name]: value
    });
  };

  // Validate address form fields
  const validateAddressForm = () => {
    const errors = {};
    if (!addressFormData.streetAddress.trim()) {
      errors.streetAddress = 'Street Address is required';
    }
    if (!addressFormData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!addressFormData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!addressFormData.postalCode.trim()) {
      errors.postalCode = 'Postal Code is required';
    } else if (!/^\d{5}$/.test(addressFormData.postalCode.trim())) {
      errors.postalCode = 'Invalid Postal Code';
    }
    setAddressFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate checkout form fields
  const validateCheckoutForm = () => {
    const errors = {};
    if (!checkoutFormData.nameOnCard.trim()) {
      errors.nameOnCard = 'Name on Card is required';
    }
    if (!checkoutFormData.cardNumber.trim()) {
      errors.cardNumber = 'Card Number is required';
    } else if (!/^\d{16}$/.test(checkoutFormData.cardNumber.trim())) {
      errors.cardNumber = 'Invalid Card Number';
    }
    if (!checkoutFormData.expiryDate.trim()) {
      errors.expiryDate = 'Expiry Date is required';
    } else {
      const today = new Date();
      var [expMonth, expYear] = checkoutFormData.expiryDate.split("/")
      const expiryDate = new Date(`20${expYear}`, expMonth-1);
      console.log(expiryDate)
      if (expiryDate <= today) {
        errors.expiryDate = 'Expiry Date must be in the future';
      }
    }
    if (!checkoutFormData.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3}$/.test(checkoutFormData.cvv.trim())) {
      errors.cvv = 'Invalid CVV';
    }
    setCheckoutFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      if(validateAddressForm()) {
        // const response = await axios.post('http://localhost:5000/customerAddresses/', {...addressFormData, customerId:localStorage.getItem('id')})
        setIsAddressSaved(true)
        setAddressId(null)
        // console.log(response)
      }
    } catch(e) {
      console.log('Address Add error', e)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isCheckoutFormValid = validateCheckoutForm();
    if (isCheckoutFormValid) {
      // Your checkout logic goes here
      try {
        // This should delete all records in cart collection with the given user id
        console.log(checkoutFormData)
        const response = await axios.post('http://localhost:5000/transactions/', { customerId: localStorage.getItem("id"), amount: totalAmount, cardDetails: checkoutFormData, deliveryAddress: addressFormData})
        console.log(response)
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false); // Hide modal after 3 seconds
          navigate('/'); // Redirect to home page
        }, 3000);
      } catch (error) {
        console.error('Checkout Error:', error);
      }
    }
  };

  return (
    <div className="checkout-container">
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={5} className="address-details">
            <h2 className="text-center mb-4">Address Details</h2>
            <Form onSubmit={handleAddAddress}>
              <Form.Check type='checkbox' id='autoFill' label="Autofill" className="mb-3" onChange={handleAutoFillChange} />
              <Form.Group controlId="formStreetAddress" className="mb-3">
                <Form.Label>Street Address</Form.Label>
                <Form.Control type="text" placeholder="Enter street address" name="streetAddress" value={addressFormData.streetAddress} onChange={handleAddressChange} required />
                {addressFormErrors.streetAddress && <Form.Text className="text-danger">{addressFormErrors.streetAddress}</Form.Text>}
              </Form.Group>
              <Form.Group controlId="formCity" className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="Enter city" name="city" value={addressFormData.city} onChange={handleAddressChange} required />
                {addressFormErrors.city && <Form.Text className="text-danger">{addressFormErrors.city}</Form.Text>}
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" placeholder="Enter state" name="state" value={addressFormData.state} onChange={handleAddressChange} required />
                  {addressFormErrors.state && <Form.Text className="text-danger">{addressFormErrors.state}</Form.Text>}
                </Col>
                <Col>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control type="text" placeholder="Enter postal code" name="postalCode" value={addressFormData.postalCode} onChange={handleAddressChange} required />
                  {addressFormErrors.postalCode && <Form.Text className="text-danger">{addressFormErrors.postalCode}</Form.Text>}
                </Col>
              </Row>
              <Form.Group controlId="formCountry" className="mb-4">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" placeholder="United States" disabled />
              </Form.Group>
              {isAddressSaved ? 
              <Button variant="success" className="w-100 mb-3" disabled>
                Address Saved <FaCheck />
              </Button>
              :
              <Button variant="primary" type="submit" className="w-100 mb-3">
                Deliver to this Address
              </Button>
            }
              
            </Form>
          </Col>
          <Col md={1} className="vertical-line"></Col>
          <Col md={5} className="checkout-details">
            <h2 className="text-center mb-4">Checkout</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNameOnCard" className="mb-3">
                <Form.Label>Name on Card</Form.Label>
                <Form.Control type="text" placeholder="Enter name on card" name="nameOnCard" value={checkoutFormData.nameOnCard} onChange={handleCheckoutChange} required />
                {checkoutFormErrors.nameOnCard && <Form.Text className="text-danger">{checkoutFormErrors.nameOnCard}</Form.Text>}
              </Form.Group>
              <Form.Group controlId="formCardNumber" className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" placeholder="Enter card number" name="cardNumber" value={checkoutFormData.cardNumber} onChange={handleCheckoutChange} required />
                {checkoutFormErrors.cardNumber && <Form.Text className="text-danger">{checkoutFormErrors.cardNumber}</Form.Text>}
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control type="text" placeholder="MM/YY" name="expiryDate" value={checkoutFormData.expiryDate} onChange={handleCheckoutChange} required />
                  {checkoutFormErrors.expiryDate && <Form.Text className="text-danger">{checkoutFormErrors.expiryDate}</Form.Text>}
                </Col>
                <Col>
                  <Form.Label>CVV</Form.Label>
                  <Form.Control type="text" placeholder="CVV" name="cvv" value={checkoutFormData.cvv} onChange={handleCheckoutChange} required />
                  {checkoutFormErrors.cvv && <Form.Text className="text-danger">{checkoutFormErrors.cvv}</Form.Text>}
                </Col>
              </Row>
              <Form.Group controlId="formTotalAmount" className="mb-4">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control type="text" disabled value={`$${totalAmount}`} />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3" disabled={!isAddressSaved}>
                Confirm Payment
              </Button> 
            </Form>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Placed Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="tick-container">
            <div className="tick">&#10004;</div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Checkout;
