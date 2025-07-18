const Order = require("../models/orderModel");
const sendEmail = require("../utils/sendEmail");
const PDFDocument = require("pdfkit");

const createOrder = async (req, res) => {
  try {
    const { items, address, city, postalCode, total } = req.body;

    if (!items?.length) {
      return res.status(400).json({ message: "No items provided" });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      address,
      city,
      postalCode,
      total,
    });

    // PDF invoice Code :
    const generateInvoiceBuffer = () => {
      return new Promise((resolve) => {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        doc.fontSize(18).text("📦 Bookstore Invoice", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Customer: ${req.user.name}`);
        doc.text(`Email: ${req.user.email}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        doc.text("Items:", { underline: true });
        items.forEach((item) => {
          doc.text(
            `${item.title} × ${item.quantity} = ₹${(
              item.quantity * item.price
            ).toFixed(2)}`
          );
        });

        doc
          .moveDown()
          .font("Helvetica-Bold")
          .text(`Total: ₹${total.toFixed(2)}`);

        doc.end();
      });
    };

    const invoiceBuffer = await generateInvoiceBuffer();

    const itemsTable = items
      .map(
        (item) => `
      <tr>
        <td style="padding:6px 0;">${item.title}</td>
        <td style="padding:6px 0;">${item.quantity}</td>
        <td style="padding:6px 0;">₹${(item.price * item.quantity).toFixed(
          2
        )}</td>
      </tr>
    `
      )
      .join("");

    await sendEmail({
      to: req.user.email,
      subject: "📦 Order Confirmation - Bookstore",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;border-radius:8px;">
          <h2 style="color:#3b82f6;">Hi ${req.user.name},</h2>
          <p>Thanks for your order! 🎉 Here's your order summary:</p>

          <table style="width:100%;margin-top:20px;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid #ccc;">
                <th align="left">Title</th>
                <th align="left">Qty</th>
                <th align="left">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTable}
            </tbody>
          </table>

          <p style="margin-top:20px;"><strong>Grand Total:</strong> ₹${total.toFixed(
            2
          )}</p>
          <p style="margin-top:30px;color:#555;">We've attached a PDF invoice for your records.<br/>Your books will be shipped soon. 📬</p>
          <p style="margin-top:10px;color:#555;">– Bookstore Team</p>
        </div>
      `,
      attachments: [
        {
          filename: "Invoice.pdf",
          content: invoiceBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    res.status(201).json({ order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Order creation failed", error: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};

const getUserOrderStats = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });

    const dailyStats = {};

    orders.forEach((order) => {
      const day = new Date(order.createdAt).toISOString().split("T")[0];
      dailyStats[day] = (dailyStats[day] || 0) + 1;
    });

    const result = Object.entries(dailyStats).map(([date, count]) => ({
      date,
      count,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load user order stats",
      error: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getUserOrderStats,
};
