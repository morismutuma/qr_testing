import React from 'react'
import Select from 'react-select'

const countries = [
  { value: 'KE', label: '🇰🇪 Kenya' },
  { value: 'UG', label: '🇺🇬 Uganda' },
  { value: 'TZ', label: '🇹🇿 Tanzania' },
  { value: 'NG', label: '🇳🇬 Nigeria' },
  { value: 'ZA', label: '🇿🇦 South Africa' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'RW', label: '🇷🇼 Rwanda' },
  { value: 'ET', label: '🇪🇹 Ethiopia' },
  { value: 'GH', label: '🇬🇭 Ghana' },
  { value: 'EG', label: '🇪🇬 Egypt' },
  { value: 'MA', label: '🇲🇦 Morocco' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'CN', label: '🇨🇳 China' },
  { value: 'BR', label: '🇧🇷 Brazil' },
  { value: 'MX', label: '🇲🇽 Mexico' },
  { value: 'AE', label: '🇦🇪 United Arab Emirates' },
]

const CountrySelect = ({ setValue }) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: '#374151',
      borderColor: state.isFocused ? '#7d4fff' : '#9370ff',
      color: '#fff',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(147, 112, 255, 0.3)' : 'none',
      '&:hover': {
        borderColor: '#7d4fff',
      },
      minHeight: '46px',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#374151',
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#7d4fff' : state.isFocused ? '#6b3fff' : '#374151',
      color: '#fff',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#5a33cc',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: '#fff',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
    }),
    input: (base) => ({
      ...base,
      color: '#fff',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#9370ff',
      '&:hover': {
        color: '#7d4fff',
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: '#9370ff',
    }),
  }

  return (
    <div>
      <label className="block text-lilac-300 text-xs font-semibold mb-2">COUNTRY</label>
      <Select
        options={countries}
        onChange={(option) => setValue('country', option?.value || '')}
        styles={customStyles}
        placeholder="Select your country..."
        isSearchable={true}
        noOptionsMessage={() => 'No country found'}
      />
    </div>
  )
}

export default CountrySelect