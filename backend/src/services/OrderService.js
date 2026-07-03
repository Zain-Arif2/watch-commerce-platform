import OrderRepository from '../repositories/OrderRepository.js'
import PendingCheckout from '../models/PendingCheckout.js'
import Product from '../models/Product.js'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import EmailService from './EmailService.js'

class OrderService {
  constructor() {
    this.orderRepository = OrderRepository
  }

  async getAllOrders() {
    return await this.orderRepository.findAllPopulated()
  }

  async getOrdersByUser(userId) {
    return await this.orderRepository.findAllPopulated({ user: userId })
  }

  async sendOrderConfirmationIfNeeded(order) {
    if (!order || order.confirmationEmailSent) {
      return order
    }

    try {
      const sent = await EmailService.sendOrderConfirmation(order)
      if (sent) {
        order.confirmationEmailSent = true
        await order.save()
      }
    } catch (error) {
      console.error('Failed to send order confirmation email:', error.message)
    }

    return order
  }

  async createOrderFromCheckoutSession(session, pendingCheckoutId) {
    const pendingCheckout = await PendingCheckout.findById(pendingCheckoutId).populate(
      'items.product'
    )

    if (!pendingCheckout) {
      throw new Error('Pending checkout not found')
    }

    if (pendingCheckout.status === 'completed') {
      const existingOrder = await Order.findOne({ 'paymentResult.id': session.id }).populate(
        'user',
        'name email'
      )

      if (existingOrder) {
        await this.sendOrderConfirmationIfNeeded(existingOrder)
        return existingOrder
      }
    }

    const orderItems = pendingCheckout.items
      .map((item) => {
        const product = item.product
        if (!product) return null

        const price = Number(product.discountPrice || product.price || 0)

        return {
          name: product.name,
          qty: item.quantity,
          image: product.images?.[0]?.url || '',
          price,
          product: product._id,
        }
      })
      .filter(Boolean)

    if (orderItems.length === 0) {
      throw new Error('No valid order items found')
    }

    const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const shippingAddress = session.shipping_details?.address
    const customerEmail = session.customer_details?.email || session.customer_email

    const order = await this.orderRepository.create({
      user: pendingCheckout.user || undefined,
      guestEmail: pendingCheckout.user ? undefined : customerEmail,
      orderItems,
      shippingAddress: {
        address: [shippingAddress?.line1, shippingAddress?.line2]
          .filter(Boolean)
          .join(', ') || 'N/A',
        city: shippingAddress?.city || 'N/A',
        postalCode: shippingAddress?.postal_code || 'N/A',
        country: shippingAddress?.country || 'N/A',
        phone: session.customer_details?.phone || 'N/A',
      },
      paymentMethod: 'stripe',
      paymentResult: {
        id: session.id,
        status: session.payment_status,
        update_time: new Date().toISOString(),
        email_address: customerEmail,
      },
      itemsPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: session.amount_total ? session.amount_total / 100 : itemsPrice,
      isPaid: session.payment_status === 'paid',
      paidAt: session.payment_status === 'paid' ? new Date() : undefined,
      orderStatus: session.payment_status === 'paid' ? 'processing' : 'pending',
    })

    pendingCheckout.status = 'completed'
    pendingCheckout.stripeSessionId = session.id
    await pendingCheckout.save()

    if (pendingCheckout.user) {
      const cart = await Cart.findOne({ user: pendingCheckout.user })
      if (cart) {
        cart.items = []
        await cart.save()
      }
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      })
    }

    await this.sendOrderConfirmationIfNeeded(order)

    return order
  }
}

export default new OrderService()
