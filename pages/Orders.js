import Layout from '@/components/Layout';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [sortOption, setSortOption] = useState('time');
  const [byStatus, setByStatus] = useState('all');


  useEffect(() => {
    axios.get('/api/Orders')
      .then(res => {
        setOrders(res.data);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Orders</h1>

      <div className="overflow-x-auto">
        <div className="mb-4">
          <label className="mr-2 font-semibold">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="paid">Paid First</option>
            <option value="time">Newest First</option>
            <option value="total">Total High to Low</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="mr-2 font-semibold">Filter by status:</label>
          <select
            value={byStatus}
            onChange={(e) => setByStatus(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <table className="w-full text-gray-700">
          <thead className="bg-gray-700 text-white">
            <tr className="text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Items</th>
              <th className="p-3">Address</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              [...orders].sort((a, b) => {
                if (sortOption === 'paid') {
                  return (b.paid === true) - (a.paid === true); // paid first
                } else if (sortOption === 'time') {
                  return new Date(b.createdAt) - new Date(a.createdAt); // newest first
                } else if (sortOption === 'total') {
                  return b.total - a.total; // highest total first
                }
                return 0;
              })
              .filter(order => byStatus === 'all' ? true : order.status === byStatus)
              .map(order => (
                <tr key={order._id} className="border-b border-gray-300 hover:bg-gray-500 transition">
                  <td className="p-3">{(new Date(order.createdAt)).toLocaleString()}</td>
                  <td className="p-3">
                    {order.line_items.map(lineItem => (
                      <p key={lineItem.productId} className="text-sm">
                        {lineItem.quantity} × {lineItem.title}
                      </p>
                    ))}
                  </td>
                  <td className="p-3">{order.address}</td>
                  <td className={`p-3 font-bold ${order.paid ? 'text-green-600' : 'text-black'}`}>
                    {order.paid ? 'Paid' : 'Not Paid'}
                  </td>
                  <td className="p-3">{order.total} L.E</td>
                  <td className="p-3">
                    <Link
                      href={`/Orders/${order._id}`}
                      className="inline-block bg-black hover:bg-black text-white px-4 py-2 rounded-md transition"
                    >
                      View
                    </Link>
                  </td>
                  <td className="p-3 font-bold">
                    <p className={
                      "px-1  rounded-md text-center "
                      + (order.status === 'Pending' ? 'bg-gray-200 ' :
                        order.status === 'Confirmed' ? 'bg-yellow-200 ' :
                        order.status === 'Shipped' ? 'bg-blue-200 ' :
                        order.status === 'Delivered' ? 'bg-green-200 ' :
                        order.status === 'Cancelled' ? 'bg-red-200 ' : '')
                    }>
                      {order.status}
                    </p>
                  </td>
                  <td className="p-3">
                    {order.cancellationRequest?.status === 'requested' ? (
                      <span className="text-yellow-600">Cancellation Requested</span>
                    ) : order.cancellationRequest?.status === 'approved' ? (
                      <span className="text-green-600">Cancellation Approved</span>
                    ) : order.cancellationRequest?.status === 'denied' ? (
                      <span className="text-red-600">Cancellation Denied</span>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
