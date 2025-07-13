import React from 'react';

// This component is designed to be printed, so it uses basic HTML and inline styles
// for maximum compatibility with printing.

const InvoiceCard = React.forwardRef(({ order }, ref) => {
  // Ensure order and its properties are safely accessed
  const orderId = order?._id?.slice(-6).toUpperCase() || 'N/A';
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'N/A';
  const customerName = order?.userId?.name || 'Guest';
  const customerEmail = order?.userId?.email || 'N/A';
  const deliveryAddress = order?.address || 'N/A';
  const deliveryCity = order?.city || 'N/A';
  const deliveryPostalCode = order?.postalCode || 'N/A';
  const totalAmount = (order?.total ?? 0).toFixed(2); // Safely access total

  return (
    <div ref={ref} style={styles.invoiceContainer}>
      <h1 style={styles.header}>Bookstore Invoice 📦</h1>
      <p style={styles.date}>Date: {orderDate}</p>

      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Customer Details</h2>
        <p><strong>Name:</strong> {customerName}</p>
        <p><strong>Email:</strong> {customerEmail}</p>
        <p><strong>Delivery Address:</strong> {deliveryAddress}, {deliveryCity} - {deliveryPostalCode}</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Order Summary (Order #{orderId})</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Book Title</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order?.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{item.title || 'N/A'}</td>
                  <td style={styles.td}>{item.quantity ?? 0}</td>
                  <td style={styles.td}>₹{(item.price ?? 0).toFixed(2)}</td>
                  <td style={styles.td}>₹{((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.td}>No items found for this order.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={styles.totalLabel}>Total:</td>
              <td style={styles.totalAmount}>₹{totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={styles.footer}>
        <p>Thank you for your purchase!</p>
        <p>Bookstore Team</p>
      </div>
    </div>
  );
});

const styles = {
  invoiceContainer: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #eee',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '10px',
    fontSize: '24px',
  },
  date: {
    textAlign: 'right',
    marginBottom: '20px',
    color: '#555',
  },
  section: {
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  sectionHeader: {
    color: '#007bff',
    marginBottom: '8px',
    fontSize: '16px',
    borderBottom: '1px solid #007bff',
    paddingBottom: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '10px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontSize: '11px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    fontSize: '11px',
  },
  totalLabel: {
    textAlign: 'right',
    padding: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderTop: '2px solid #007bff',
  },
  totalAmount: {
    padding: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderTop: '2px solid #007bff',
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
    color: '#555',
  },
};

export default InvoiceCard;
