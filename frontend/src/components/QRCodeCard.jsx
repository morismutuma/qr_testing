import React from 'react'
import QRCode from 'react-qr-code'
import { motion } from 'framer-motion'

const QRCodeCard = () => {
  // QR code points to the payment page on the production domain
  const qrUrl = 'https://realedgeafricatours.com/payment-page/'

  const handleClick = () => {
    // Open payment page when QR code is clicked
    window.location.href = '/pay'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full mx-4"
    >
      <h2 className="text-2xl font-bold text-lilac-800 mb-2">Scan to Pay</h2>
      <p className="text-gray-600 mb-6 text-sm">Use your phone camera or payment app to scan</p>
      
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block cursor-pointer p-4 bg-lilac-50 rounded-lg hover:bg-lilac-100 transition border-2 border-lilac-200"
        aria-label="Click to open payment page"
      >
        <QRCode 
          value={qrUrl} 
          size={220}
          level="H"
          includeMargin={true}
          fgColor="#7d4fff"
          bgColor="#ffffff"
        />
      </motion.button>
      
      <p className="text-sm text-gray-500 mt-6">
        Tap the QR code or <a href="/pay" className="text-lilac-600 hover:text-lilac-800 font-semibold">click here</a> to pay
      </p>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          Secure Payment
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          Instant Confirmation
        </span>
      </div>
    </motion.div>
  )
}

export default QRCodeCard