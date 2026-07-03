import nodemailer from 'nodemailer'

class EmailService {
  createTransporter() {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return null
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  buildOrderConfirmationHtml(order) {
    const itemsRows = order.orderItems
      .map(
        (item) => `
          <tr>
            <td style="padding:12px;border-bottom:1px solid #eee;">${item.name}</td>
            <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
            <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">$${(item.price * item.qty).toFixed(2)}</td>
          </tr>
        `
      )
      .join('')

    return `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#0b0b0c;">
        <div style="background:#0b0b0c;color:#f5f1e8;padding:32px;text-align:center;">
          <h1 style="margin:0;letter-spacing:0.2em;font-size:24px;">CHRONO<span style="color:#c8a45c;">LUX</span></h1>
          <p style="margin:12px 0 0;color:#c8a45c;letter-spacing:0.15em;font-size:12px;">ORDER CONFIRMATION</p>
        </div>
        <div style="padding:32px;background:#faf9f6;">
          <p style="margin:0 0 16px;">Thank you for your purchase. Your order has been confirmed.</p>
          <p style="margin:0 0 24px;"><strong>Order ID:</strong> ${order._id}</p>

          <table style="width:100%;border-collapse:collapse;background:#fff;margin-bottom:24px;">
            <thead>
              <tr style="background:#0b0b0c;color:#fff;">
                <th style="padding:12px;text-align:left;">Item</th>
                <th style="padding:12px;text-align:center;">Qty</th>
                <th style="padding:12px;text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
          </table>

          <p style="margin:0 0 8px;"><strong>Subtotal:</strong> $${order.itemsPrice.toFixed(2)}</p>
          <p style="margin:0 0 8px;"><strong>Shipping:</strong> $${order.shippingPrice.toFixed(2)}</p>
          <p style="margin:0 0 24px;font-size:18px;"><strong>Total Paid:</strong> $${order.totalPrice.toFixed(2)}</p>

          <div style="background:#fff;padding:20px;border:1px solid #c8a45c33;">
            <p style="margin:0 0 8px;font-weight:bold;">Shipping Address</p>
            <p style="margin:0;line-height:1.6;">
              ${order.shippingAddress.address}<br/>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br/>
              ${order.shippingAddress.country}
            </p>
          </div>
        </div>
        <p style="text-align:center;padding:24px;color:#888;font-size:12px;">
          © CHRONOLUX — Luxury Timepieces
        </p>
      </div>
    `
  }

  async sendOrderConfirmation(order) {
    const transporter = this.createTransporter()
    if (!transporter) {
      console.warn('Email service not configured — skipping order confirmation email')
      return false
    }

    const recipient =
      order.guestEmail ||
      order.paymentResult?.email_address ||
      order.user?.email

    if (!recipient) {
      console.warn('No recipient email for order confirmation')
      return false
    }

    await transporter.sendMail({
      from: `"CHRONOLUX" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `Order Confirmation — #${order._id.toString().slice(-8).toUpperCase()}`,
      html: this.buildOrderConfirmationHtml(order),
    })

    return true
  }
}

export default new EmailService()
