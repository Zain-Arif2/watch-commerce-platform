import UserService from '../services/UserService.js'

export const getCustomers = async (req, res) => {
  try {
    const customers = await UserService.getCustomers()
    res.json({ success: true, data: customers })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
