import React from 'react'

const currencies = [
  { value: 'KES', label: 'KES - Kenyan Shilling', symbol: 'KSh' },
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'NGN', label: 'NGN - Nigerian Naira', symbol: '₦' },
  { value: 'ZAR', label: 'ZAR - South African Rand', symbol: 'R' },
  { value: 'INR', label: 'INR - Indian Rupee', symbol: '₹' },
  { value: 'UGX', label: 'UGX - Ugandan Shilling', symbol: 'USh' },
  { value: 'TZS', label: 'TZS - Tanzanian Shilling', symbol: 'TSh' },
  { value: 'RWF', label: 'RWF - Rwandan Franc', symbol: 'RF' },
  { value: 'AED', label: 'AED - UAE Dirham', symbol: 'د.إ' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
]

const AmountSection = ({ register, setValue, watch }) => {
  const selectedCurrency = watch?.('currency') || 'KES'
  const currencySymbol = currencies.find(c => c.value === selectedCurrency)?.symbol || ''

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-lilac-300">Amount</h2>
      
      <div className="bg-lilac-900/20 border border-lilac-600/50 rounded-lg p-4">
        <p className="text-lilac-200 text-xs leading-relaxed">
          💰 Enter the amount you wish to pay. All transactions are secured with SSL encryption.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-lilac-300 text-xs font-semibold mb-2">CURRENCY</label>
          <select 
            {...register('currency', { required: true })} 
            defaultValue="KES" 
            className="w-full bg-gray-700 text-white border border-lilac-600 rounded-lg p-3 focus:ring-2 focus:ring-lilac-500 focus:border-transparent outline-none transition appearance-none cursor-pointer"
          >
            {currencies.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-lilac-300 text-xs font-semibold mb-2">AMOUNT</label>
          <div className="relative">
            {currencySymbol && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lilac-300 font-semibold">
                {currencySymbol}
              </span>
            )}
            <input 
              type="number" 
              step="0.01" 
              min="0"
              {...register('amount', { required: true, min: 0.01 })} 
              placeholder="0.00" 
              className={`w-full bg-gray-700 text-white border border-lilac-600 rounded-lg p-3 focus:ring-2 focus:ring-lilac-500 focus:border-transparent outline-none transition ${currencySymbol ? 'pl-12' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmountSection