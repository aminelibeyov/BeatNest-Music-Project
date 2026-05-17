import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const response = await axios.get(url, { headers })
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchData()
    }
  }, [url, token])

  return { data, loading, error }
}
