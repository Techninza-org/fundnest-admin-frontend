import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CCloseButton, CImage, CSidebar, CSidebarBrand, CSidebarHeader } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import logo from '../assets/images/logo.png'

// sidebar nav config
import navigation from '../_nav'
import CIcon from '@coreui/icons-react'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* className="border-bottom" */}
      <CSidebarHeader>
        <CSidebarBrand to="/">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Brandneers Logo" style={{ height: '40px', width: '30px' }} />
            <h2>randneers</h2>
          </div>
          {/* <CIcon customClassName="sidebar-brand-full" height={32} /> */}
          {/* <CImage src={'https://res.cloudinary.com/dr4iluda9/image/upload/v1719553407/ezio_vendor/logo.svg'} height={'50px'} width={50} fluid /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
