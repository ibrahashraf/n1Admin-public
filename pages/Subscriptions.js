import Layout from '@/components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function SubscriptionsPage() {
    const [numbers, setNumbers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState([])
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await axios.get('/api/numbers')
                setNumbers(data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
    
        fetchTestimonials()
      }, [])

      if (loading) return <Layout><p>Loading...</p></Layout>
      if (error) return <Layout><p className="text-black">{error}</p></Layout>

    const handleCopy = (number) => {
        navigator.clipboard.writeText(number)
        setCopied(prev => [...prev, number])
    }
    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Subscriptions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {numbers.map(number => (
                    <div key={number._id} className="bg-gray-100 p-4 rounded-md flex items-center justify-between">
                        <div>
                            <p className="text-gray-700 font-bold tracking-wider">{number.phone}</p>
                            <p className="text-gray-500">{number.createdAt.slice(0, 10)}</p>
                        </div>
                        <button onClick={() => handleCopy(number.phone)} className=" text-white font-semibold py-2 px-4 rounded-md transition">
                            { copied.includes(number.phone) ? <DoneAllIcon sx={{ color: 'green' }} /> : <ContentCopyIcon sx={{ color: 'gray' }} />}
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    )
}
