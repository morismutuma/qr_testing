import React from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const PhoneNumberField = ({ setValue, watch }) => {
  const phoneValue = watch ? watch('phone') : undefined
  return (
    <div>
      <label className="block text-lilac-300 text-xs font-semibold mb-2">PHONE NUMBER</label>
      <PhoneInput
        international
        defaultCountry="KE"
        value={phoneValue || ''}
        onChange={(value) => setValue('phone', value)}
        placeholder="Enter your phone number"
        className="w-full"
      />
    </div>
  )
}

export default PhoneNumberField