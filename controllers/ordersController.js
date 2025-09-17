import Order from "../models/orders.js";



export const createOrder = async (req, res) => {
  try {
    const { fullName, address, phone, paymentMethod, items, total } = req.body;
    console.log(req.body)

    if (!fullName || !address || !phone || !paymentMethod || !items || !total) {
      return res.status(400).json({ message: "All fields are required" });
    }

  
    const normalizedPayment =
      paymentMethod.toLowerCase() === "cash on delivery"
        ? "cash_on_delivery"
        : "card";

    const newOrder = new Order({
      fullName,
      address,
      phone,
      paymentMethod: normalizedPayment,
      items,
      total,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};


export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
};
