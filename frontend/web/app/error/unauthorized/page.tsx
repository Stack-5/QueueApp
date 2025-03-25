import React from 'react'

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Unauthorized Access</h1>
      <h1 className="text-2xl font-bold text-red-500">Scan a valid qr code or ask a staff for information </h1>
    </div>
  )
}

export default Unauthorized