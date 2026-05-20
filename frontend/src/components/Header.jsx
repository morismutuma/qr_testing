import React from 'react'
import { motion } from 'framer-motion'

const Header = ({ settings }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-lilac-500 to-lilac-700 text-white p-6 rounded-lg shadow-lg mb-6"
    >
      <div className="flex flex-col items-center">
        <div className="mb-4">
          {settings?.logo ? (
            <img src={settings.logo} alt="Logo" className="h-24 w-24 rounded-full border-4 border-white shadow-lg" />
          ) : (
            <img src="/logo1.jpeg" alt="Logo" className="h-24 w-24 rounded-full border-4 border-white shadow-lg" />
          )}
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold">{settings?.name || 'RealEdge Africa Venture ltd'}</h1>
          <p className="text-lilac-100 text-sm mt-1">{settings?.description || 'RealEdge Africa Ventures is a global travel destinations\' agent in Kenya specializing in Beach, Mountain Hiking adventures, Health & wellness, wildlife safari and Cultural experiences. We package your travel to fit your budget retaining great experience.'}</p>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        {settings?.ssl_secured && <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">SSL Secured</span>}
        {settings?.verified_business && <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Verified Business</span>}
        {settings?.secure_payment && <span className="bg-purple-500 text-white px-2 py-1 rounded text-sm">Secure Payment</span>}
      </div>
    </motion.header>
  )
}

export default Header