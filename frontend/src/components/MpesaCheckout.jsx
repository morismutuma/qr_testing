import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

const MpesaCheckout = ({ session, onClose }) => {
  const [activeTab, setActiveTab] = useState('stk') // 'stk' or 'qr'
  const [phone, setPhone] = useState(session?.phone || '')
  const [stkStatus, setStkStatus] = useState('idle') // 'idle', 'sending', 'sent', 'success', 'failed'
  const [qrCode, setQrCode] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('pending') // 'pending', 'completed', 'failed'
  const [receipt, setReceipt] = useState('')
  const [errorDetails, setErrorDetails] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  
  const pollingIntervalRef = useRef(null)
  const pollCountRef = useRef(0)

  // Start polling backend for session payment status
  const startPolling = () => {
    stopPolling()
    pollCountRef.current = 0
    
    pollingIntervalRef.current = setInterval(() => {
      pollCountRef.current += 1
      
      // Stop polling after 90 seconds (30 attempts) to avoid infinite loops
      if (pollCountRef.current > 30) {
        stopPolling()
        if (stkStatus === 'sent') {
          setStkStatus('failed')
          setErrorDetails('Transaction timed out. Please try initiating again.')
        }
        return
      }

      api.get(`/api/payment-session/${session.id}/status/`)
        .then(res => {
          const { status, mpesa_receipt_number, result_desc } = res.data
          if (status === 'completed') {
            stopPolling()
            setPaymentStatus('completed')
            setReceipt(mpesa_receipt_number || '')
            setStkStatus('success')
          } else if (status === 'failed') {
            stopPolling()
            setPaymentStatus('failed')
            setStkStatus('failed')
            setErrorDetails(result_desc || 'Payment request failed or was cancelled.')
          }
        })
        .catch(err => {
          console.error("Error polling payment status:", err)
        })
    }, 3000)
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  useEffect(() => {
    // Start polling automatically if STK is sent or QR is open
    if (stkStatus === 'sent' || activeTab === 'qr') {
      startPolling()
    } else {
      stopPolling()
    }
    return () => stopPolling()
  }, [stkStatus, activeTab])

  // Fetch QR Code from API when switching to QR tab
  useEffect(() => {
    if (activeTab === 'qr' && !qrCode) {
      setQrLoading(true)
      setErrorDetails('')
      api.get(`/api/payment-session/${session.id}/qr-code/`)
        .then(res => {
          if (res.data.qr_code) {
            setQrCode(res.data.qr_code)
          } else {
            setErrorDetails(res.data.warning || 'Dynamic QR code generation failed.')
          }
        })
        .catch(err => {
          console.error("Error fetching QR Code:", err)
          setErrorDetails("Failed to fetch dynamic M-Pesa QR code.")
        })
        .finally(() => {
          setQrLoading(false)
        })
    }
  }, [activeTab, session.id])

  // Trigger STK Push Prompt
  const handleStkPush = () => {
    setStkStatus('sending')
    setErrorDetails('')
    setStatusMessage('Sending payment request to Safaricom Daraja...')

    api.post(`/api/payment-session/${session.id}/stk-push/`, { phone })
      .then(res => {
        setStkStatus('sent')
        setStatusMessage('Payment request sent! Please check your phone for the M-Pesa PIN prompt.')
      })
      .catch(err => {
        console.error("STK Push error:", err)
        setStkStatus('failed')
        const details = err.response?.data?.details || err.response?.data?.error || 'Could not trigger STK Push.'
        setErrorDetails(details)
      })
  }

  // Simulate payment callback for offline development
  const handleSimulateSuccess = () => {
    api.post(`/api/payment-session/${session.id}/simulate-success/`)
      .then(res => {
        setPaymentStatus('completed')
        setReceipt(res.data.mpesa_receipt_number || 'MOCK_SUCCESS')
        setStkStatus('success')
      })
      .catch(err => {
        console.error("Simulation error:", err)
        alert("Failed to simulate payment success.")
      })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gray-900/95 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-lilac-600/50 shadow-2xl space-y-6 max-w-xl mx-auto w-full text-white"
    >
      <div className="flex items-center justify-between border-b border-lilac-600/30 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-lilac-300">M-Pesa Checkout</h2>
          <p className="text-gray-400 text-xs mt-1">Session Reference: #{session.id}</p>
        </div>
        <button 
          onClick={onClose} 
          className="text-lilac-400 hover:text-white transition text-lg bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between bg-lilac-900/20 p-4 rounded-xl border border-lilac-600/30">
        <div>
          <p className="text-gray-400 text-xs">Total Amount due</p>
          <p className="text-2xl font-extrabold text-white">{session.currency} {parseFloat(session.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <span className="bg-lilac-600/30 text-lilac-200 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          {session.payment_method}
        </span>
      </div>

      {stkStatus !== 'success' && stkStatus !== 'failed' && (
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('stk')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${activeTab === 'stk' ? 'bg-lilac-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            STK Push (Prompt)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${activeTab === 'qr' ? 'bg-lilac-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Scan Dynamic QR
          </button>
        </div>
      )}

      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        {stkStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-4xl border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              ✓
            </div>
            <h3 className="text-2xl font-extrabold text-white">Payment Received!</h3>
            <p className="text-gray-300 text-sm max-w-sm mx-auto">
              Your M-Pesa transaction has been processed successfully.
            </p>
            <div className="bg-gray-800 p-4 rounded-xl border border-lilac-600/20 max-w-xs mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Receipt No:</span>
                <span className="font-mono font-bold text-green-400">{receipt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="font-bold">{session.currency} {session.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="font-bold text-green-400 uppercase">Completed</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 bg-lilac-600 hover:bg-lilac-700 text-white font-bold rounded-lg transition shadow-lg w-full max-w-xs"
            >
              Back to Home
            </button>
          </motion.div>
        ) : stkStatus === 'failed' ? (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-4xl border border-red-500">
              ✕
            </div>
            <h3 className="text-2xl font-extrabold text-white">Payment Failed</h3>
            <p className="text-red-300 text-sm max-w-xs mx-auto">
              {errorDetails || "We couldn't confirm your transaction."}
            </p>
            <div className="flex gap-4 max-w-sm mx-auto mt-4">
              <button
                onClick={() => {
                  setStkStatus('idle')
                  setErrorDetails('')
                }}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg border border-lilac-600/30 transition"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-lilac-600 hover:bg-lilac-700 text-white font-bold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : activeTab === 'stk' ? (
          <motion.div
            key="stk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-300">
              We will send an instant M-Pesa payment prompt (STK Push) directly to the phone number below. Make sure your phone is unlocked, enter your PIN when prompted, and tap OK.
            </p>
            
            <div className="space-y-2">
              <label className="block text-lilac-300 text-xs font-semibold">M-PESA PHONE NUMBER</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="w-full bg-gray-800 text-white border border-lilac-600/40 rounded-lg p-3 outline-none focus:ring-2 focus:ring-lilac-500 transition font-bold"
                disabled={stkStatus === 'sending' || stkStatus === 'sent'}
              />
            </div>

            {stkStatus === 'idle' && (
              <button
                onClick={handleStkPush}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold rounded-lg transition shadow-lg text-lg flex items-center justify-center gap-2"
              >
                <span>📱</span> Send M-Pesa Prompt
              </button>
            )}

            {(stkStatus === 'sending' || stkStatus === 'sent') && (
              <div className="space-y-4 py-4 text-center">
                <div className="flex justify-center items-center gap-2 text-lilac-300 font-medium">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{statusMessage}</span>
                </div>
                {stkStatus === 'sent' && (
                  <p className="text-xs text-gray-400 italic">
                    Polling for payment confirmation... (Will automatically complete once you enter your PIN)
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="qr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 text-center flex flex-col items-center justify-center"
          >
            <p className="text-sm text-gray-300 text-left w-full">
              Scan the dynamic Safaricom M-Pesa QR code below using the **M-PESA App** or **MySafaricom App** on your phone to automatically pre-fill details and complete payment.
            </p>

            <div className="relative bg-white p-4 rounded-xl border-4 border-lilac-400/30 my-2 shadow-[0_0_20px_rgba(147,112,255,0.15)] flex items-center justify-center w-64 h-64">
              {qrLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-gray-800">
                  <svg className="animate-spin h-8 w-8 text-lilac-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs font-semibold text-gray-500">Generating QR...</span>
                </div>
              ) : qrCode ? (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="relative group"
                >
                  <img 
                    src={`data:image/png;base64,${qrCode}`} 
                    alt="M-Pesa Dynamic QR Code" 
                    className="w-56 h-56 object-contain"
                  />
                  {/* Glowing scanner line animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-green-500/80 shadow-[0_0_8px_#22c55e] animate-bounce top-0 pointer-events-none" style={{ animationDuration: '3s' }} />
                </motion.div>
              ) : (
                <div className="text-center p-4">
                  <span className="text-3xl">⚠️</span>
                  <p className="text-xs text-gray-500 mt-2 font-semibold">Daraja QR API not configured.</p>
                  <p className="text-[10px] text-gray-400 mt-1">Please use the Sandbox simulation below to test.</p>
                </div>
              )}
            </div>

            {errorDetails && (
              <p className="text-xs text-yellow-400 bg-yellow-950/20 border border-yellow-800/30 rounded p-2 text-left w-full">
                {errorDetails}
              </p>
            )}

            <div className="w-full flex items-center justify-between text-xs text-gray-400 border-t border-lilac-600/20 pt-4">
              <span>Merchant Name: RealEdge Africa</span>
              <span>Account Ref: REF{session.id}</span>
            </div>
            
            <p className="text-xs text-gray-400 italic mt-1">
              Once scanned and paid, your screen will automatically redirect.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sandbox Controls Section */}
      {stkStatus !== 'success' && (
        <div className="border-t border-lilac-600/30 pt-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 bg-yellow-500 rounded-full animate-ping"></span>
              Sandbox Mode
            </span>
            <span className="text-gray-400 text-[10px]">Testing utility only</span>
          </div>
          <p className="text-xs text-gray-400 mb-3 text-left leading-relaxed">
            Since webhook callbacks from Safaricom require a public server, click below to mock a successful payment response.
          </p>
          <button
            type="button"
            onClick={handleSimulateSuccess}
            className="w-full py-2.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-200 border border-yellow-600/40 rounded-lg text-xs font-extrabold transition shadow flex items-center justify-center gap-1.5"
          >
            ⚡ Simulate Webhook Success (Test Completion)
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default MpesaCheckout
