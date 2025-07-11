const Order = require("../models/orderModel");
const Book = require("../models/bookModel");

const getOrderStats = async (req, res) => {
  try {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        orders: 0,
        revenue: 0,
      };
    }).reverse();

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 6);
    fromDate.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: fromDate }
    });

    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      const dayStat = last7Days.find(day => day.date === date);
      if (dayStat) {
        dayStat.orders += 1;
        dayStat.revenue += order.total;
      }
    });

    res.json(last7Days);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

const getTopGenres = async (req, res) => {
  try {
    const genreStats = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "books",
          localField: "items.bookId",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $group: {
          _id: "$bookDetails.genre",
          booksSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        },
      },
      { $sort: { booksSold: -1 } },
    ]);

    res.json(genreStats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch genre stats", error: err.message });
  }
};

module.exports = { getOrderStats, getTopGenres,};
