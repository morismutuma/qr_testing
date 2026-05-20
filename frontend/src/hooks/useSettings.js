import { useState, useEffect } from 'react'
import api from '../services/api'

const useSettings = () => {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    api.get('/settings/').then(res => setSettings(res.data))
  }, [])

  return settings
}

export default useSettings