import React, { useEffect, useState } from 'react';
import UpSertModal from '../UpSertModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';
import CreateRestaurantModal from '../CreateRestaurantModal';
import { type } from '@testing-library/user-event/dist/type';


const Home = () => {
  // Dummy data for McDonald's menu
  const navigate = useNavigate();

  // State for filtering and sorting
  const [filter, setFilter] = useState('all'); // 'all', 'veg', 'nonveg', 'Burgers', 'Fries', 'Drinks'
  const [sortBy, setSortBy] = useState('price'); // 'price'
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [upsertModalVisible, setUpsertModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [createRestaurantModalVisible, setCreateRestaurantModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newItem, setNewItem] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try{
        const response = await axios.get("http://localhost:5000/restaurants")
        setIsAdmin(localStorage.getItem("isAdmin") === "true")
        console.log(response)
        console.log(response.data)
        setRestaurants(response.data.data)
        setSelectedRestaurant(response.data.data[0])
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  // // Filtered and sorted menu items
  // const filteredMenu = selectedRestaurant.products.map(section => ({
  //   products: section.products.filter(item => {

  //     if (filter !== 'all' && item.type !== filter) return false;

  //     // Filter by vegetarian or non-vegetarian
  //     if (filter === 'veg' && !item.veg) return false;
  //     if (filter === 'nonveg' && item.veg) return false;
  
  //     return true;
  //   })
  // }));


  // // // Sort menu items based on selected sorting
  // filteredMenu.forEach(section => {
  //   section.products.sort((a, b) => {
  //     if (sortBy === 'price') return a.price - b.price;
  //     return 0;
  //   });
  // });

   // Function to handle opening edit modal
   const handleUpsert = (item=null) => {
    console.log(item)
    setSelectedItem(item);
    setUpsertModalVisible(true);
  };

  const handleCreateRestaurant = () => {
    console.log("Create Restaurant..")
    setCreateRestaurantModalVisible(true);
  }

  const handleRestaurantAdd = async (item=null) => {
    console.log("Restaurant Created..", item)
    try {
      var response = await axios.post('http://127.0.0.1:5000/restaurants/', {name:item})
      setCreateRestaurantModalVisible(false);
    } catch(e) {
      console.log(e)
    }
  }

  // Function to handle saving changes
  const handleSaveChanges = async (editedItem) => {
    console.log('Saving changes:', editedItem);
      try {
        if(editedItem._id != null) {
          var response;
          response = await axios.patch('http://127.0.0.1:5000/products/', editedItem)
          const updatedProducts = selectedRestaurant.products.map(item => {
            if (item._id === editedItem._id) {
              return editedItem; // Replace the item with the updated item
            }
            return item;
          });
          setSelectedRestaurant({...selectedRestaurant, products: updatedProducts});
        } else {
          editedItem = {...editedItem, restaurantId:selectedRestaurant._id}
          console.log(editedItem)
          response = await axios.post('http://127.0.0.1:5000/products/', editedItem)
          console.log()
          setSelectedRestaurant({...selectedRestaurant, products : [...selectedRestaurant.products, editedItem]})
        }
        setUpsertModalVisible(false);
      } catch(e) {
        console.log(e)
      }
    setSelectedItem(null)
    // Add your logic here to save changes
  };

  // Function to handle opening delete confirmation modal
  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  // Function to handle confirming deletion
  const handleConfirmDelete = async (item) => {
    console.log(item)
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/products/${item['_id']}`)
      const updatedProducts = selectedRestaurant.products.filter(product => product._id !== item._id);
      setSelectedRestaurant({...selectedRestaurant, products: updatedProducts});
    } catch(e) {
      console.log(e)
    }
    console.log('Deleting:', selectedItem);
    // Add your logic here to delete item
    setDeleteModalVisible(false);
  };

  // Function to handle canceling edit/delete operation
  const handleCancel = () => {
    setSelectedItem(null);
    setUpsertModalVisible(false);
    setDeleteModalVisible(false);
  };

  const itemIsInCart = (item) => {
    return cartItems.some(cartItem => cartItem._id === item._id)
  }


  // Handler for adding item to cart
  const handleAddToCart = async (item) => {
    try{
      const cartItem = {
        count: 1,
        customerId: localStorage.getItem("id"),
        productId: item._id
        // restaurantId: item.restaurantId
      }
      const response = await axios.post("http://localhost:5000/cart/", cartItem)
      console.log(item)
      setCartItems(prevItems => [...prevItems, item]);
    }catch(e) {
      console.log(e)
    }
  };

  const GoToCart = () => {navigate("/cart")}

  if(loading) {
    return <Loading />;
  }

  return (
    <div className="container mt-5 pb-5">
      {/* Filter, sort buttons, and restaurant selection dropdown */}
      {/* Rest of your code */}
      <div className="d-flex justify-content-between mb-4">
        {/* Filter and sort buttons */}
        <div>
        <div className="mb-4">
        {/* <button className={`btn btn-outline-primary me-2 ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`btn btn-outline-primary me-2 ${filter === 'veg' ? 'active' : ''}`} onClick={() => setFilter('veg')}>Veg</button>
        <button className={`btn btn-outline-primary me-2 ${filter === 'nonveg' ? 'active' : ''}`} onClick={() => setFilter('nonveg')}>Non Veg</button>
        <button className={`btn btn-outline-primary ${sortBy === 'price' ? 'active' : ''}`} onClick={() => setSortBy('price')}>Sort by Price</button> */}
      </div>
        </div>
        <div className="d-flex align-items-center">
        <div className="dropdown me-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedRestaurant.name} <span className="circle"></span>
          </button>
          <ul className={`dropdown-menu${showDropdown ? ' show' : ''}`} aria-labelledby="dropdownMenuButton">
            {restaurants?.map((restaurant, index) => (
              <li key={index}>
                <button
                  className={`dropdown-item${selectedRestaurant.name === restaurant.name ? ' active' : ''}`}
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setShowDropdown(false);
                  }}
                >
                  {restaurant.name} <span className="circle"></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {isAdmin && (
          <>
            <button className="btn btn-primary" onClick={() => handleUpsert()}>Add Product</button>
            {/* <button className="btn btn-primary" onClick={() => handleCreateRestaurant()}>Add Restaurant</button> */}
          </> 
          )}
        </div>
        {/* Restaurant selection dropdown */}
        
      </div>
      {/* Menu sections */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {selectedRestaurant?.products.map((item, index) => (
          true && (
            <div key={index} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Price: ${item.price}</p>
                  <p className="card-text">Type: {item.veg ? 'Veg' : 'Non Veg'}</p>
                  {/* Add Edit and Delete buttons for Admin role */}
                  {isAdmin && (
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-outline-primary me-2" onClick={() => handleUpsert(item)}>Edit</button>
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(item)}>Delete</button>
                    </div>
                  )}
                  {/* Add to Cart button */}
                  {!isAdmin && (
                    <button className="btn btn-primary mt-2" onClick={() => itemIsInCart(item) ? GoToCart() : handleAddToCart(item)}>
                      {cartItems.some(cartItem => cartItem._id === item._id) ? "Go To Cart" : "Add to Cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      <UpSertModal
        visible={upsertModalVisible}
        item={selectedItem}
        onSave={handleSaveChanges}
        onCancel={handleCancel}
      />


      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        item={selectedItem}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />

    <CreateRestaurantModal
      visible={createRestaurantModalVisible}
      onClose={() => setCreateRestaurantModalVisible(false)}
      onCreate={handleRestaurantAdd}
    />
    </div>
  );
};

export default Home;