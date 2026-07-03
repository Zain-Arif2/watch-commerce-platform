import OrderService from '../services/OrderService.js'

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders()
    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await OrderService.getOrdersByUser(req.user._id)
    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
