import { forwardRef } from "react";

const InvoiceCard = forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="p-8 text-sm text-gray-800 max-w-md">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Invoice</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p className="mt-2"><strong>Customer:</strong> {order.name}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Address:</strong> {order.address}, {order.city}, {order.postalCode}</p>

      <hr className="my-3" />

      <ul className="space-y-1">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{item.title} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </li>
        ))}
      </ul>

      <hr className="my-3" />
      <p className="text-right font-semibold text-blue-800">Total: ₹{order.total.toFixed(2)}</p>
    </div>
  );
});

export default InvoiceCard;
