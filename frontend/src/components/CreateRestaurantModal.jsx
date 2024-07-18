import React, {useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateRestaurantModal = ({ visible, onClose, onCreate }) => {
    const [restName, setRestName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestName(value)
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(restName);
        setRestName('');
    }
  return (
    <Modal show={visible} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="addRestName">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={restName || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRestaurantModal;
