import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div
      className="min-vh-100 position-fixed w-100 zindex-5 d-flex justify-content-center align-items-center"
      style={{ top: 0, right: 0, bottom: 0, left: 0, backdropFilter: 'blur(2px)' }}
    >
      <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#1E8A9A"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}

export default Loader
