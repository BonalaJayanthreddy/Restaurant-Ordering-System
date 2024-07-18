import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UpSertModal = ({ visible, item, onSave, onCancel, isAdd }) => {
  const [editedItem, setEditedItem] = useState({veg:true});

  // Initialize the editedItem state with the item prop when the component mounts
  useEffect(() => {
    console.log(item, "Upsert Modela")
    if(item){
      setEditedItem(item);
    } else {
      setEditedItem({veg:true})
    }
  }, [item]); // Add item as a dependency to update the state when it changes

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // If the field is 'veg', convert the value to boolean
    const updatedValue = name === 'veg' ? value === 'Veg' : name === "price" ? parseFloat(value) : value;
    setEditedItem(prevState => ({
      ...prevState,
      [name]: updatedValue
    }));
    console.log(name, updatedValue)
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedItem);
    setEditedItem(null)
  };

  return (
    <Modal show={visible} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{isAdd ? 'Add' : 'Edit'} Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="editFormName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editedItem?.name || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="editFormPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              value={editedItem?.price || ''}
              onChange={handleChange}
            />
          </Form.Group>
          {/* Dropdown for selecting type */}
          <Form.Group controlId="editFormType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              name="veg" 
              value={editedItem?.veg ? 'Veg' : 'Non-Veg'} 
              onChange={handleChange}
            >
              <option value="Non-Veg">Non-Veg</option>
              <option value="Veg">Veg</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      {/* Fix styling issue */}
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpSertModal;
