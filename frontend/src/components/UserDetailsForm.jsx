import React from 'react'
import CountrySelect from './CountrySelect'
import PhoneInput from './PhoneInput'

const UserDetailsForm = ({ register, setValue, errors, watch }) => {
  return (
    <div className="space-y-5">
      <div className="bg-lilac-900/30 border border-lilac-600 rounded-lg p-4">
        <p className="text-lilac-200 text-xs leading-relaxed">
          ✓ Please complete all fields below. Your details are required before you can proceed with any payment method.
        </p>
      </div>
      
      <h2 className="text-2xl font-bold text-lilac-300">Your Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-lilac-300 text-xs font-semibold mb-2">FIRST NAME</label>
          <input 
            {...register('firstName', { required: true })} 
            placeholder="John" 
            className="w-full bg-gray-700 text-white border border-lilac-600 rounded-lg p-3 focus:ring-2 focus:ring-lilac-500 focus:border-transparent outline-none transition" 
          />
          {errors.firstName && <span className="text-red-400 text-xs mt-1 block">First name is required</span>}
        </div>
        
        <div>
          <label className="block text-lilac-300 text-xs font-semibold mb-2">MIDDLE NAME <span className="text-lilac-400">(Optional)</span></label>
          <input 
            {...register('middleName')} 
            placeholder="David" 
            className="w-full bg-gray-700 text-white border border-lilac-600 rounded-lg p-3 focus:ring-2 focus:ring-lilac-500 focus:border-transparent outline-none transition" 
          />
        </div>
        
        <div>
          <label className="block text-lilac-300 text-xs font-semibold mb-2">LAST NAME</label>
          <input 
            {...register('lastName', { required: true })} 
            placeholder="Doe" 
            className="w-full bg-gray-700 text-white border border-lilac-600 rounded-lg p-3 focus:ring-2 focus:ring-lilac-500 focus:border-transparent outline-none transition" 
          />
          {errors.lastName && <span className="text-red-400 text-xs mt-1 block">Last name is required</span>}
        </div>
      </div>
      
      <div>
        <label className="block text-lilac-300 text-xs font-semibold mb-2">EMAIL ADDRESS</label>
        <input 
          type="email" 
          {...register('email', { required: true })} 
          placeholder="john.doe@example.com" 
          className="w-full bg-gray-700 text-white border border-lilac-600 rounded-lg p-3 focus:ring-2 focus:ring-lilac-500 focus:border-transparent outline-none transition" 
        />
        {errors.email && <span className="text-red-400 text-xs mt-1 block">Valid email is required</span>}
      </div>
      
      <PhoneInput setValue={setValue} watch={watch} />
      
      <CountrySelect setValue={setValue} />
    </div>
  )
}

export default UserDetailsForm