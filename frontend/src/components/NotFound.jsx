import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 className="display-4">404 - Not Found</h1>
          <p className="lead">Sorry, the page you are looking for does not exist.</p>
          <img src="notfound.avif" style={{height:300, width:300}}  alt="Page not found" className="img-fluid" />
          <br></br>
          <Link to="/" className="btn btn-primary mt-3">Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
