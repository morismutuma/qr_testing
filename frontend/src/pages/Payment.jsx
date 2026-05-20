import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Header from '../components/Header'
import UserDetailsForm from '../components/UserDetailsForm'
import AmountSection from '../components/AmountSection'
import PaymentMethods from '../components/PaymentMethods'
import MpesaCheckout from '../components/MpesaCheckout'

const Payment = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      currency: 'KES',
      country: '',
    },
  })
  const [settings, setSettings] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdSession, setCreatedSession] = useState(null)

  useEffect(() => {
    axios.get('/api/settings/').then(res => setSettings(res.data))
  }, [])

  const onSubmit = (data) => {
    setIsSubmitting(true)
    
    // Map camelCase frontend fields to snake_case backend fields
    const payload = {
      first_name: data.firstName,
      middle_name: data.middleName || '',
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      currency: data.currency,
      amount: parseFloat(data.amount),
      payment_method: paymentMethod
    }

    axios.post('/api/payment-session/', payload)
      .then(res => {
        if (paymentMethod === 'mpesa') {
          // If M-Pesa is chosen, open the interactive checkout UI
          setCreatedSession(res.data)
        } else {
          // Other payment methods
          alert(`Payment session created successfully for ${paymentMethod.toUpperCase()}!`)
        }
      })
      .catch(err => {
        console.error("Payment session creation failed:", err)
        alert('Payment session creation failed. Please check all fields and try again.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lilac-900 via-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Header settings={settings} />
        
        <AnimatePresence mode="wait">
          {createdSession && createdSession.payment_method === 'mpesa' ? (
            <MpesaCheckout 
              session={createdSession} 
              onClose={() => setCreatedSession(null)} 
            />
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)} 
              className="bg-gray-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl space-y-8 border border-lilac-600/50"
            >
              <UserDetailsForm register={register} setValue={setValue} errors={errors} watch={watch} />
              
              <div className="border-t border-lilac-600/30 pt-6">
                <AmountSection register={register} setValue={setValue} watch={watch} />
              </div>
              
              <div className="border-t border-lilac-600/30 pt-6">
                <PaymentMethods settings={settings} onSelectMethod={setPaymentMethod} register={register} watch={watch} />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full bg-gradient-to-r from-lilac-600 to-lilac-700 hover:from-lilac-700 hover:to-lilac-800 text-white py-4 rounded-lg font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? 'animate-pulse' : ''}`}
              >
                {isSubmitting ? 'Processing...' : 'Complete Payment'}
              </motion.button>
              
              <div className="text-center pt-4">
                <p className="text-lilac-400 text-xs">
                  🔒 Your payment information is encrypted and secure
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        <footer className="text-center mt-8 text-lilac-400/60 text-xs">
          <p>© {new Date().getFullYear()} {settings?.name || 'RealEdge Africa Venture ltd'}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default Payment