import Stripe from 'stripe'
import Product from '../models/Product.js'
import PendingCheckout from '../models/PendingCheckout.js'
import OrderService from '../services/OrderService.js'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body
    const stripe = getStripe()

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required',
      })
    }

    const normalizedItems = items
      .map((item) => ({
        productId: item?.product?._id || item?.productId,
        quantity: Number(item?.quantity || 0),
      }))
      .filter((item) => item.productId && item.quantity > 0)

    if (normalizedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid cart items provided',
      })
    }

    const productIds = normalizedItems.map((item) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } }).select(
      'name price discountPrice images stock'
    )

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Products not found for checkout',
      })
    }

    const productMap = new Map(products.map((product) => [product._id.toString(), product]))

    const pendingItems = []
    const lineItems = []

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId)
      if (!product) continue

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        })
      }

      const unitPrice = Math.round(Number(product.discountPrice || product.price || 0) * 100)
      if (unitPrice <= 0) continue

      pendingItems.push({ product: product._id, quantity: item.quantity })
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: product.images?.[0]?.url ? [product.images[0].url] : [],
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      })
    }

    if (lineItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Unable to prepare checkout items',
      })
    }

    const pendingCheckout = await PendingCheckout.create({
      items: pendingItems,
      user: req.user?._id,
    })

    const origin = process.env.CLIENT_URL || req.headers.origin
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: req.user?.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'PK', 'AE', 'AU', 'DE', 'FR'],
      },
      metadata: {
        pendingCheckoutId: pendingCheckout._id.toString(),
        userId: req.user?._id?.toString() || '',
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?payment=cancelled`,
    })

    pendingCheckout.stripeSessionId = session.id
    await pendingCheckout.save()

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create Stripe checkout session',
    })
  }
}

export const verifyCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.query
    const stripe = getStripe()

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
      })
    }

    const pendingCheckoutId = session.metadata?.pendingCheckoutId
    if (!pendingCheckoutId) {
      return res.status(400).json({
        success: false,
        message: 'Checkout metadata missing',
      })
    }

    const order = await OrderService.createOrderFromCheckoutSession(session, pendingCheckoutId)

    return res.json({
      success: true,
      data: {
        orderId: order._id,
        totalPrice: order.totalPrice,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        email: order.guestEmail || order.paymentResult?.email_address,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        orderStatus: order.orderStatus,
        paidAt: order.paidAt,
        confirmationEmailSent: order.confirmationEmailSent,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify checkout session',
    })
  }
}

export const stripeWebhook = async (req, res) => {
  const stripe = getStripe()
  const signature = req.headers['stripe-signature']

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ success: false, message: 'Webhook secret not configured' })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${error.message}`,
    })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const pendingCheckoutId = session.metadata?.pendingCheckoutId

      if (pendingCheckoutId) {
        await OrderService.createOrderFromCheckoutSession(session, pendingCheckoutId)
      }
    }

    return res.json({ received: true })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Webhook handler failed',
    })
  }
}
