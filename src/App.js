import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import Entrepreneur from './views/pages/services/Enterprenuer'
import Investor from './views/pages/services/Investor'
import Bookings from './views/pages/services/Bookings'
import AddUser from './views/pages/services/AddUser'
import Webinars from './views/pages/services/Webinars'
import WebinarsBooking from './views/pages/services/WebinarsBooking'
import FAQs from './views/pages/services/FAQs'
import Consults from './views/pages/services/Consults'
import MyCourse from './views/pages/services/MyCourse'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/entrepreneur/all" name="entrepreneur" element={<Entrepreneur />} />
          <Route exact path="/investor/all" name="investor" element={<Investor />} />
          <Route exact path="/bookings/all" name="booking" element={<Bookings />} />
          <Route exact path="/adduser" name="user" element={<AddUser />} />
          <Route exact path="/webinars/upload" name="webinar" element={<Webinars />} />
          <Route exact path="/webinarsbooking/all" name="webinar" element={<WebinarsBooking />} />
          <Route exact path="/blog" name="faqs" element={<FAQs />} />
          <Route exact path="/consult/all" name="consult" element={<Consults/>} />
          <Route exact path="/mycourse/all" name="mycourse" element={<MyCourse/>} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
