import React, { useEffect, useState } from 'react'

import { CCard, CCardBody, CCardHeader, CCardTitle } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const baseUrl = 'http://localhost:4000'

const Dashboard = () => {
  const [entrepreneurCount, setentrepreneurCount] = useState(0)
  const [investorCount, setInvestorCount] = useState(0)
  const [bookingCount, setBookingCount] = useState(0)
  const [webinarCount, setWebinarCount] = useState(0)
  const [webinarBookingCount, setWebinarBookingCount] = useState(0)
  const [faqsCount, setFaqsCount] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    let loggedIn = false
    if (localStorage.getItem('user')) {
      loggedIn = true
    }
    if (!loggedIn) {
      navigate('/login')
    }
    if (loggedIn) {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      async function getentrepreneurs() {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/getentrepreneurs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setentrepreneurCount(res.data.length)
      }
      async function getInvestors() {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/getInvestors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setInvestorCount(res.data.length)
      }
      async function getBookings() {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/getAppointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setBookingCount(res.data.length)
      }
      async function getWebinars() {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/videos/upload`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setWebinarCount(res.data.length)
      }
      async function getWebinarsBooking() {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/getWebinarBooking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setWebinarBookingCount(res.data.length)
      }
      async function getFAQs() {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/faqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setFaqsCount(res.data.length)
      }

      getentrepreneurs()
      getInvestors()
      getBookings()
      getWebinars()
      getWebinarsBooking()
      getFAQs()
    }
  }, [])

  return (
    <div className="row gap-5">
      <CCard textBgColor={'primary'} className="mb-3 col-md-6" style={{ maxWidth: '18rem' }}>
        <CCardHeader>entrepreneurs</CCardHeader>
        <CCardBody>
          <CCardTitle>Total entrepreneurs: {entrepreneurCount}</CCardTitle>
        </CCardBody>
      </CCard>
      <CCard textBgColor={'secondary'} className="mb-3 col-md-6" style={{ maxWidth: '18rem' }}>
        <CCardHeader>Investors</CCardHeader>
        <CCardBody>
          <CCardTitle>Total Investors: {investorCount} </CCardTitle>
        </CCardBody>
      </CCard>
      <CCard textBgColor={'secondary'} className="mb-3 col-md-6" style={{ maxWidth: '18rem' }}>
        <CCardHeader>Consultancy Bookings</CCardHeader>
        <CCardBody>
          <CCardTitle>Consultancy Bookings: {bookingCount} </CCardTitle>
        </CCardBody>
      </CCard>
      <CCard textBgColor={'secondary'} className="mb-3 col-md-6" style={{ maxWidth: '18rem' }}>
        <CCardHeader>Webinar Videos</CCardHeader>
        <CCardBody>
          <CCardTitle>Webinar Videos: {webinarCount} </CCardTitle>
        </CCardBody>
      </CCard>
      <CCard textBgColor={'secondary'} className="mb-3 col-md-6" style={{ maxWidth: '18rem' }}>
        <CCardHeader>Webinar Bookings</CCardHeader>
        <CCardBody>
          <CCardTitle>Webinar Bookings: {webinarBookingCount} </CCardTitle>
        </CCardBody>
      </CCard>
      <CCard textBgColor={'secondary'} className="mb-3 col-md-6" style={{ maxWidth: '18rem' }}>
        <CCardHeader>FAQs</CCardHeader>
        <CCardBody>
          <CCardTitle>FAQs: {faqsCount} </CCardTitle>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Dashboard
