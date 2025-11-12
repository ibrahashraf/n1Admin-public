import Layout from "@/components/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function ShippingCosts() {
  const [editedShipping, setEditedShipping] = useState(null);
  const [governorate, setGovernorate] = useState('');
  const [cost, setCost] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [shippingList, setShippingList] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchShipping();
  }, []);
  useEffect(() => {
    async function fetchOrders() {
      await axios.get('/api/Orders').then(res => {
        setOrders(res.data);
      })
    }
    fetchOrders();
  }, [])

  function fetchShipping() {
    axios.get('/api/Shipping').then(res => {
      const sortedData = res.data.sort((a, b) => a.cost - b.cost);
      setShippingList(sortedData);
    });
    setEditedShipping(null);
    setGovernorate('');
    setCost('');
    setEstimatedDeliveryTime('');
  }

  async function saveShipping(ev) {
    ev.preventDefault();
    const data = {
      governorate,
      cost: parseFloat(cost),
      estimatedDeliveryTime,
    };

    if (editedShipping) {
      data._id = editedShipping._id;
      await axios.put('/api/Shipping', data);
    } else {
      await axios.post('/api/Shipping', data);
    }
    setGovernorate('');
    setCost('');
    setEstimatedDeliveryTime('');
    fetchShipping();
  }

  function editShipping(item) {
    setEditedShipping(item);
    setGovernorate(item.governorate);
    setCost(item.cost);
    setEstimatedDeliveryTime(item.estimatedDeliveryTime);
    window.scrollTo(0, 0);
  }

  async function deleteShipping(item) {
    const res = await Swal.fire({
      title: `Delete shipping for "${item.governorate}"?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "red",
      denyButtonColor: "#000000",
    });

    if (res.isConfirmed) {
      await axios.delete(`/api/Shipping?_id=${item._id}`);
      fetchShipping();
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Shipping Costs</h1>

      <h2 className="font-semibold text-black mb-4 px-2">
        {editedShipping ? `Edit shipping for: ${editedShipping.governorate}` : 'Add New Shipping Cost'}
      </h2>

      <form onSubmit={saveShipping} className="mb-8">
        <div className="flex sm:items-center sm:gap-4 max-sm:flex-col max-sm:gap-4">
          <input
            onChange={ev => setGovernorate(ev.target.value)}
            value={governorate}
            type="text"
            placeholder="Governorate name"
            required
            className="border border-gray-700 px-4 py-2 rounded-md w-full"
          />
          <input
            onChange={ev => setCost(ev.target.value)}
            value={cost}
            type="number"
            placeholder="Cost in EGP"
            required
            className="border border-gray-700 px-4 py-2 rounded-md w-full"
          />
          <input
            onChange={ev => setEstimatedDeliveryTime(ev.target.value)}
            value={estimatedDeliveryTime}
            type="text"
            placeholder="Estimated Delivery Time (optional)"
            className="border border-gray-700 px-4 py-2 rounded-md w-full"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-black hover:bg-black text-white px-6 py-2 rounded-md transition"
          >
            Save
          </button>
          {editedShipping && (
            <button
              onClick={() => {
                setEditedShipping(null);
                setGovernorate('');
                setCost('');
              }}
              type="button"
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-gray-700">
          <thead className="bg-gray-700 text-white">
            <tr className="text-left">
              <th className="p-3">Governorate</th>
              <th className="p-3">Cost (EGP)</th>
              <th className="p-3">Estimated Delivery Time</th>
              <th className="p-3">Actions</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {shippingList.map((item) => (
              <tr key={item._id} className="border-b border-gray-300 hover:bg-red-50 transition">
                <td className="p-3">{item.governorate}</td>
                <td className="p-3">{item.cost}</td>
                <td className="p-3">{item.estimatedDeliveryTime || '___'}</td>
                <td className="flex gap-4 items-center p-3">
                  <button onClick={() => editShipping(item)}>
                    <EditNoteIcon
                      sx={{ fontSize: 30 }}
                      className="hover:bg-gray-300 rounded-full p-1 transition"
                    />
                  </button>
                  <button onClick={() => deleteShipping(item)}>
                    <DeleteForeverIcon
                      sx={{ fontSize: 30 }}
                      className="hover:bg-black rounded-full p-1 transition"
                    />
                  </button>
                </td>
                <td className="p-3">
                  {orders.filter(order => 
                    ( order.status === "Shipped" || order.status === "Delivered" )
                    && order.governorate === item.governorate).length} shipments
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default ShippingCosts;
