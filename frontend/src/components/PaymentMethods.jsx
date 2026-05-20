import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PaymentMethods = ({ settings, onSelectMethod, register, watch }) => {
  const [selectedMethod, setSelectedMethod] = useState('mpesa')
  const [paypalEmail, setPaypalEmail] = useState('')
  
  const tillNumber = settings?.till_number || '9984765'
  const tillName = settings?.till_name || 'RealEdge Africa Venture'
  const email = watch?.('email') || ''

  const selectMethod = (method) => {
    setSelectedMethod(method)
    onSelectMethod(method)
  }

  // Pre-select M-Pesa on load
  useEffect(() => {
    onSelectMethod('mpesa')
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-lilac-300">Payment Options</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* M-Pesa Selector Card */}
        {settings?.till_number !== false && (
          <motion.div
            onClick={() => selectMethod('mpesa')}
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-xl shadow-lg cursor-pointer border transition-all duration-300 ${
              selectedMethod === 'mpesa'
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-950/20 border-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                : 'bg-gradient-to-br from-gray-900 to-gray-800 border-lilac-600/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${selectedMethod === 'mpesa' ? 'bg-green-500' : 'bg-gray-700'}`}>
                  📱
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">M-Pesa (STK Push or QR)</h3>
                  <p className="text-lilac-300 text-xs mt-0.5">Pay instantly via phone prompt or by scanning a dynamic QR code.</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'mpesa' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-500'}`}>
                {selectedMethod === 'mpesa' && '✓'}
              </div>
            </div>

            {selectedMethod === 'mpesa' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-green-500/20 text-xs text-green-200/80 space-y-1.5"
              >
                <p>✓ **Till Number:** {tillNumber} ({tillName})</p>
                <p>✓ M-Pesa payment prompt will be sent to the phone number entered in the form above.</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* PayPal Selector Card */}
        {settings?.paypal_enabled !== false && (
          <motion.div
            onClick={() => selectMethod('paypal')}
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-xl shadow-lg cursor-pointer border transition-all duration-300 ${
              selectedMethod === 'paypal'
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-950/20 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                : 'bg-gradient-to-br from-gray-900 to-gray-800 border-lilac-600/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${selectedMethod === 'paypal' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  🅿️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Pay with PayPal</h3>
                  <p className="text-lilac-300 text-xs mt-0.5">Quick checkout using your PayPal account.</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'paypal' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-500'}`}>
                {selectedMethod === 'paypal' && '✓'}
              </div>
            </div>

            {selectedMethod === 'paypal' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-blue-500/20 space-y-3"
              >
                <div>
                  <label className="block text-lilac-300 text-xs font-semibold mb-2">PAYPAL EMAIL (OPTIONAL)</label>
                  <input
                    type="email"
                    {...register('paypalEmail')}
                    placeholder={email || 'your.paypal@example.com'}
                    className="w-full bg-gray-800 text-white border border-lilac-600/30 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-xs transition"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">If left empty, we will use your primary email address above.</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Card Selector Card */}
        {settings?.card_enabled !== false && (
          <motion.div
            onClick={() => selectMethod('card')}
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-xl shadow-lg cursor-pointer border transition-all duration-300 ${
              selectedMethod === 'card'
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-950/20 border-lilac-500 shadow-[0_0_15px_rgba(147,112,255,0.15)]'
                : 'bg-gradient-to-br from-gray-900 to-gray-800 border-lilac-600/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${selectedMethod === 'card' ? 'bg-lilac-600' : 'bg-gray-700'}`}>
                  💳
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Card Payment</h3>
                  <p className="text-lilac-300 text-xs mt-0.5">Secure payment via Visa, Mastercard, and 3D Secure.</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-lilac-500 bg-lilac-500 text-white' : 'border-gray-500'}`}>
                {selectedMethod === 'card' && '✓'}
              </div>
            </div>

            {selectedMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-lilac-600/20 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lilac-300 text-[10px] font-semibold mb-1">CARDHOLDER NAME</label>
                    <input
                      {...register('cardholderName')}
                      placeholder="John Doe"
                      className="w-full bg-gray-800 text-white border border-lilac-600/30 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-lilac-500 text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-lilac-300 text-[10px] font-semibold mb-1">CARD NUMBER</label>
                    <input
                      {...register('cardNumber')}
                      placeholder="4111 1111 1111 1111"
                      maxLength="19"
                      className="w-full bg-gray-800 text-white border border-lilac-600/30 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-lilac-500 text-xs font-mono transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lilac-300 text-[10px] font-semibold mb-1">EXPIRY (MM/YY)</label>
                    <input
                      {...register('expiry')}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full bg-gray-800 text-white border border-lilac-600/30 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-lilac-500 text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-lilac-300 text-[10px] font-semibold mb-1">CVV</label>
                    <input
                      {...register('cvv')}
                      placeholder="123"
                      maxLength="4"
                      className="w-full bg-gray-800 text-white border border-lilac-600/30 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-lilac-500 text-xs transition"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Floating WhatsApp Support Button */}
      <motion.a
        href={`https://wa.me/${settings?.whatsapp_number || '254798400295'}?text=Hi%20I%20need%20assistance%20with%20my%20payment`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl cursor-pointer transition flex items-center justify-center text-2xl z-50"
        title="Get help on WhatsApp"
      >
        💬
      </motion.a>
    </div>
  )
}

export default PaymentMethods