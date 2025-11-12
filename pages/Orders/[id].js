import Layout from "@/components/Layout";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { useState } from "react";
import axios from "axios";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Swal from "sweetalert2";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";


export default function OrderDetailsPage({ order }) {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const statusTranslations = {
    Pending: "قيد الانتظار",
    Confirmed: "تم التأكيد",
    Shipped: "تم الشحن",
    Delivered: "تم التوصيل",
  };
  const paymentMethodTranslations = {
    "Pay on Delivery": "الدفع عند الاستلام",
    "Credit Card": "بطاقة ائتمان",
    "PayPal": "باي بال",
  };
  const generatedMessage = `عميلنا الكريم ${order.name}،

  نود إعلامكم بأنه قد تم تحديث حالة طلبكم إلى: ${statusTranslations[status]}.

  تفاصيل الطلب:
  - المبلغ الإجمالي: ${order.total} جنيه مصري.
  - طريقة الدفع: ${paymentMethodTranslations[order.paymentMethod] || order.paymentMethod}.
  - عنوان التسليم: ${order.address}، ${order.city}، ${order.governorate}.

  ${order.paid ? "تم تأكيد استلام المبلغ بنجاح." : ""}

  لمزيد من الاستفسارات أو الدعم، لا تترددوا في التواصل معنا.

  شكراً لكم على ثقتكم بنا. نتمنى لكم يوماً سعيداً.
  `;


  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await axios.put("/api/Orders", {
        orderId: order._id,
        status: newStatus,
      });
      setStatus(newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (!order) {
    return (
      <Layout>
        <div className="p-8 text-black text-center text-lg font-bold">
          Order not found.
        </div>
      </Layout>
    );
  }
  const handleApprove = async () => {
    try {
      await axios.put(`/api/orders/${order._id}/cancel`, { action: "approve" });
      order.cancellationRequest.status = "approved";
      order.status = "cancelled";
    } catch (error) {
      console.error("Error approving cancellation request:", error);
    }
  };
  const handleReject = async () => {
    try {
      await axios.put(`/api/orders/${order._id}/cancel`, { action: "reject" });
      order.cancellationRequest.status = "denied";
    } catch (error) {
      console.error("Error rejecting cancellation request:", error);
    }
  };
  
  const handleDelete = async () => {
    const res = await Swal.fire({
      title: `Delete order "${order._id}"?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "red",
      denyButtonColor: "#000000",
    });

    if (res.isConfirmed) {
      try {
        await axios.delete(`/api/orders/${order._id}/delete`);
        Swal.fire("Deleted!", "", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire("Error!", "Failed to delete order.", "error");
      }
      window.location.href = "/Orders";
    }
  }
  return (
    <Layout>
      <div className="flex p-8 gap-8">

      
        <div className=" w-2/3 mx-auto p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-700">Order Details</h1>

          <div className="space-y-3 text-gray-800">
            <p><span className="font-semibold text-gray-700">Order ID:</span> {order._id}</p>
            <p><span className="font-semibold text-gray-700">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 mr-2">Status:</span>
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={updating}
                className="border border-gray-700 rounded-md px-3 py-1 text-gray-700"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <p><span className="font-semibold text-gray-700">Payment Method:</span> {order.paymentMethod}</p>
            <p>
              <span className="font-semibold text-gray-700">Paid:</span> 
              {order.paid ? <span className="text-green-600"> Yes<CheckIcon /></span> : <span className="text-black"> No<ClearIcon /></span>}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-black mb-3">Customer Info</h2>
            <div className="space-y-2 text-gray-800">
              <p><span className="font-semibold text-gray-700">Name:</span> {order.name}</p>
              <p><span className="font-semibold text-gray-700">Phone:</span> {order.phone}</p>
              <p><span className="font-semibold text-gray-700">Address:</span> {order.address}, {order.city}, {order.governorate}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-black mb-3">Items</h2>
            <div className="space-y-2 text-gray-800">
              {order.line_items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.quantity} × {item.title}</span>
                  <span>{item.price} L.E each</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xl font-bold text-gray-700">
            <p className="mb-3">Subtotal: <span className="text-black text-">{order.subtotal} L.E</span></p>
            <p className="mb-3">ShippingCost: <span className="text-black">{order.shippingCost} L.E</span></p>
            <p className="mb-3">Total: <span className="text-black">{order.total} L.E</span></p>
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={handleDelete}
              className="bg-black hover:bg-black transition text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              Delete Order
              <DeleteForeverIcon />
            </button>
          </div>
          <div>
            <PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`invoice${order._id}.pdf`}>
                {({ loading }) => (loading ? "جاري التحميل..." : "تحميل الفاتورة")}
              </PDFDownloadLink>
          </div>
        </div>
          <div className="mt-6 w-1/3 mx-auto">
            {order.cancellationRequest?.status === "requested" ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
                <p className="font-semibold">Cancellation Request:</p>
                <p>{order.cancellationRequest.reason}</p>
                <p className="text-sm">Requested on: {new Date(order.cancellationRequest.requestedAt).toLocaleString()}</p>
                <p className="text-sm">Status: {order.cancellationRequest.status}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleApprove}
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-black text-white px-4 py-2 rounded-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : ( order.cancellationRequest?.status === "denied" ) ? (
              <div className="bg-red-100 border-l-4 border-black text-black p-4 mb-4 rounded-md">
                <p className="font-semibold">Cancellation Request Denied</p>
                <p>{order.cancellationRequest.reason}</p>
                <p className="text-sm">Status: {order.cancellationRequest.status}</p>
              </div>
            ) : ( order.cancellationRequest?.status === "approved") ? (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
                <p className="font-semibold">Cancellation Request Approved</p>
                <p>{order.cancellationRequest.reason}</p>
                <p className="text-sm">Status: {order.cancellationRequest.status}</p>
              </div>
            ) : null}
              <h2 className="text-xl font-semibold text-black mb-2">Generated Message</h2>
              <div className="flex gap-2">
                <textarea
                  value={generatedMessage}
                  className="w-full h-96 border border-gray-700 rounded-md p-3 text-gray-700 bg-gray-100"
                  readOnly
                  rows={3}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMessage);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`text-white font-semibold px-4 py-2 rounded-md ${copied ? "bg-gray-700" : "bg-gray-700"}`}

                >
                {copied ? <DoneAllIcon /> : <ContentCopyIcon />}
                </button>
                
              </div>
              {copied && (
                  <span className="text-gray-700 ml-2">Copied to clipboard</span>
                )}
            </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    await mongooseConnect();
    const order = await Order.findById(id).lean();
    if (!order) {
      return { notFound: true };
    }

    order._id = order._id.toString();
    order.createdAt = order.createdAt.toISOString();
    order.updatedAt = order.updatedAt.toISOString();

    return {
      props: {
        order: JSON.parse(JSON.stringify(order)),
        },
    };
  } catch (err) {
    console.error("Error fetching order:", err);
    return {
      props: { order: null },
    };
  }
}
