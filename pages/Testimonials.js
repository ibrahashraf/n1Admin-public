import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';
import Layout from '@/components/Layout'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get('/api/Testimonials')
        setTestimonials(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const handleApprove = async (testimonialId, approved) => {
    try {
      await axios.put('/api/Testimonials', { testimonialId, approved })
      setTestimonials(prev =>
        prev.map(t =>
          t._id === testimonialId ? { ...t, approved } : t
        )
      )
    } catch (err) {
      setError(err)
    }
  }

  const handleDelete = async (testimonialId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      try {
        await axios.delete('/api/Testimonials', { data: { testimonialId } })
        setTestimonials(prev =>
          prev.filter(t => t._id !== testimonialId)
        )
        Swal.fire('Deleted!', 'The testimonial has been deleted.', 'success')
      } catch (err) {
        setError(err)
      }
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Testimonials</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Rating</th>
              <th className="p-3 font-medium">Comment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-black">
                  Error: {error.message}
                </td>
              </tr>
            ) : testimonials.length > 0 ? (
              testimonials.map(testimonial => (
                <tr
                  key={testimonial._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <td className="p-3">{testimonial.name}</td>
                    <td className="p-3">{testimonial.rating} ★</td>
                    <td className="p-3">{testimonial.comment}</td>
                    <td className="p-3 space-x-2">
                        <div className="inline-flex rounded-full overflow-hidden border border-gray-300">
                            <button
                                onClick={() => handleApprove(testimonial._id, true)}
                                className={`flex items-center gap-1 px-4 py-2 text-sm transition font-medium ${
                                testimonial.approved
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-green-100'
                                }`}
                            >
                                <CheckCircleIcon sx={{ fontSize: 20 }} />
                                Approve
                            </button>

                            <button
                                onClick={() => handleApprove(testimonial._id, false)}
                                className={`flex items-center gap-1 px-4 py-2 text-sm transition font-medium ${
                                !testimonial.approved
                                    ? 'bg-black text-white'
                                    : 'bg-white text-gray-700 hover:bg-red-100'
                                }`}
                            >
                                <CancelIcon sx={{ fontSize: 20 }} />
                                Unapprove
                            </button>
                        </div>
                        <button
                        onClick={() => handleDelete(testimonial._id)}
                        >
                            <DeleteForeverIcon
                                sx={{ fontSize: 30 }}
                                className="hover:bg-black rounded-full p-1 transition"
                            />
                        </button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
