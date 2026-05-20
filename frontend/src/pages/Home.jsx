import React from 'react'
import { motion } from 'framer-motion'
import QRCodeCard from '../components/QRCodeCard'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lilac-900 via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Quick Payment
          </h1>
          <p className="text-lilac-300 text-sm md:text-base">
            Scan the QR code to pay instantly
          </p>
        </div>
        
        <QRCodeCard />
        
        <div className="mt-8 flex items-center gap-6 text-lilac-400/80 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Secure
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Fast
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm3.707 3.347a1 1 0 010 1.414l-2 2a1 1 0 01-1.414 0l-1-1a1 1 0 011.414-1.414l.293.293 1.293-1.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            Verified
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default Home