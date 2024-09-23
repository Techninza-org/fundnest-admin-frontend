import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../../../components/index'
const baseUrl = 'http://localhost:4000'
const UserForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/eiuser`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessage(response.data.message)

      navigate('/dashboard')
      // console.log(response.data);
    } catch (error) {
      // console.log(error.response.data.error);
      setMessage(error.response.data.error)
    }
  }

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="mt-1 mx-3">
            <div className="container mt-5">
              <h1>Add User</h1>
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter your name.</div>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter a valid email address.</div>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter your password.</div>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="role">Role:</label>
                  <select
                    className="form-control"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="investor">Investor</option>
                  </select>
                  <div className="invalid-feedback">Please select a role.</div>
                </div>
                <div className="mt-5">
                  <button type="submit" className="btn btn-primary">
                    Add User
                  </button>
                </div>
              </form>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserForm
