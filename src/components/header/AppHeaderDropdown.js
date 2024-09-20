import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const[first_letter, setFirstLetter] = useState('')
  useEffect(() => {
    let loggedIn = false;
    if (localStorage.getItem('user')) {
      loggedIn = true;
    }
    // if (loggedIn) {
    //   const user_name = JSON.parse(localStorage.getItem('user')).name;
    //   setFirstLetter(user_name.charAt(0).toUpperCase())
    // }
    if (!loggedIn) {
      navigate('/login')
    }
  }, [])


  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    navigate('/login')
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar color="primary" textColor="white">A</CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* <CDropdownItem onClick={() => navigate('/profile')} style={{'cursor': "pointer"}} >
          <CIcon icon={cilUser} className="me-2 cursot-pointer" />
          Profile
        </CDropdownItem> */}
        <CDropdownItem onClick={handleLogout} style={{'cursor': "pointer"}} >
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
