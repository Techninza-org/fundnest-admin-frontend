import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppSidebar, AppHeader } from '../../../components/index';

const PriceSet = () => {
  const [ideaPrice, setIdeaPrice] = useState('');
  const [profilePrice, setProfilePrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the current prices on component load
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/get-price`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Set the input fields with fetched data
        setIdeaPrice(res.data.ideaPrice);
        setProfilePrice(res.data.profilePrice);
      } catch (err) {
        setError('Failed to fetch prices. Please try again later.');
      }
    };

    fetchPrices();
  }, []);

  const validateInputs = () => {
    if (!ideaPrice || !profilePrice) {
      setError('Both Idea Price and Profile Price are required');
      return false;
    }
    if (isNaN(ideaPrice) || isNaN(profilePrice)) {
      setError('Prices must be valid numbers');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateInputs()) {
      return; // Stop submission if validation fails
    }

    setLoading(true); // Start loading

    const formData = {
      ideaPrice,
      profilePrice,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/set-price`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessage(res.data.message || 'Prices updated successfully');
      setIdeaPrice(''); // Clear the form on success
      setProfilePrice('');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Failed to update prices. Please check your input.');
      } else if (err.response && err.response.status === 401) {
        setError('Unauthorized request. Please log in again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="mt-1 mx-3">
            <h1>Set Prices</h1>
            <form onSubmit={onSubmit}>
              <label className="form-label">Idea Price ($)</label>
              <input
                className="form-control mt-1"
                type="number"
                name="ideaPrice"
                placeholder="Enter Idea View Price"
                value={ideaPrice}
                onChange={(e) => setIdeaPrice(e.target.value)}
              />

              <label className="form-label mt-3">Profile Price ($)</label>
              <input
                className="form-control mt-1"
                type="number"
                name="profilePrice"
                placeholder="Enter Profile View Price"
                value={profilePrice}
                onChange={(e) => setProfilePrice(e.target.value)}
              />

              <input
                className="form-control bg-primary text-white w-25 mt-3"
                type="submit"
                value={loading ? 'Submitting...' : 'Submit'}
                disabled={loading}
              />
            </form>

            {/* Display success or error messages */}
            {message && <p className="text-success mt-3">{message}</p>}
            {error && <p className="text-danger mt-3">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceSet;
