import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppSidebar, AppHeader } from '../../../components/index';

const Services = () => {
  const [thumbnail, setThumbnail] = useState(null); // State for thumbnail
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [message, setMessage] = useState('');
  const [services, setservices] = useState([]);

  // Handle thumbnail file selection
  const onThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // Handle service upload
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', thumbnail);
    formData.append('tittle', title);
    formData.append('discription', description);
    formData.append('price', cost);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/consult/set-service`, // Adjusted endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(res);
      setMessage('Service uploaded successfully');
      // Reset form fields after successful submission
      setThumbnail(null);
      setTitle('');
      setDescription('');
      setCost('');
      
      // Fetch services again after posting
      fetchservices();
    
      
    } catch (err) {
      if (err.response.status === 400) {
        setMessage('No thumbnail selected');
      } else {
        setMessage('Error uploading service');
      }
    }
  };

  // Fetch uploaded services (now services)

    const fetchservices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/consult/get-services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res,"my")
        setservices(res.data.services); // Changed to services
        console.log("service data", res.data.services); // Changed to services
      } catch (err) {
        console.error(err);
      }
    };
    useEffect(() => {
    fetchservices();
  }, []);

  // Handle service delete
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      await axios.delete(`${import.meta.env.VITE_BASE_URL}/consult/delete-service/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("deleted card");

      // Immediately update the services state to remove the deleted service
      setservices(services.filter((service) => service._id !== id)); // Use _id or whatever identifier you use

      setMessage('Service deleted successfully'); // Changed to services
    } catch (err) {
      console.error('Error deleting service:', err); // Changed to services
      setMessage('Error deleting service'); // Changed to services
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="mt-1 mx-3">
            <h1>Upload a Service</h1>
            <form onSubmit={onSubmit}>
              <div>
                <label className="form-label mt-3">Select Thumbnail Image</label>
                <input
                  className="form-control"
                  type="file"
                  name="thumbnail"
                  onChange={onThumbnailChange}
                />
                {!thumbnail && (
                  <small className="form-text text-muted">
                    Please select a thumbnail image to upload
                  </small>
                )}
              </div>
              <input
                className="form-control mt-3"
                type="text"
                name="title"
                placeholder="Enter Service Title" // Changed to Service
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="form-control mt-3"
                name="description"
                placeholder="Enter Service Description" // Changed to Service
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <input
                className="form-control mt-3"
                type="number"
                name="cost"
                placeholder="Enter service price" // Changed to Service
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
              <input
                className="form-control bg-primary text-white w-25 mt-3"
                type="submit"
                value="Upload"
              />
            </form>
            {message && <p>{message}</p>}

            <h1>Uploaded Services</h1> {/* Changed to Services */}
            <div className="row">
              {services &&
                services.map((service, index) => (
                  <div className="col-md-4 mt-5" key={index}>
                    <div className="card">
                      <img
                        src={service.image}
                        alt="image"
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{service.tittle}</h5>
                        <p className="card-text">{service.discription}</p>
                        <p>Cost: ${service.price}</p>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(service._id)}
                        >
                          Delete
                        </button> 
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
