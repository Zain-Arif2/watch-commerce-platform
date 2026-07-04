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

  buildNewsletterWelcomeHtml() {
    return `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 30px; background-color: #0b0b0c; color: #f5f1e8;">
        <h1 style="letter-spacing: 4px; font-size: 24px; margin-bottom: 20px;">
          CHRONO<span style="color: #c8a45c;">LUX</span>
        </h1>
        <p style="line-height: 1.6; color: #f5f1e8cc;">
          Thank you for subscribing to CHRONOLUX. You'll now be the first to know about
          new arrivals, private collector offers, and exclusive timepiece releases.
        </p>
        <p style="margin-top: 30px; font-size: 12px; letter-spacing: 2px; color: #c8a45c;">
          TIMELESS ELEGANCE, PRECISION CRAFTED
        </p>
      </div>
    `
  }

  buildContactAdminNotificationHtml(contactMessage) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactMessage.name}</p>
        <p><strong>Email:</strong> ${contactMessage.email}</p>
        <p><strong>Subject:</strong> ${contactMessage.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${contactMessage.message}</p>
      </div>
    `
  }

  buildContactAutoReplyHtml(contactMessage) {
    return `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 30px; background-color: #0b0b0c; color: #f5f1e8;">
        <h1 style="letter-spacing: 4px; font-size: 24px; margin-bottom: 20px; color: #f5f1e8;">
          CHRONO<span style="color: #c8a45c;">LUX</span>
        </h1>
        <p style="line-height: 1.6; color: #f5f1e8cc;">
          Hi ${contactMessage.name},<br/><br/>
          Thank you for reaching out to CHRONOLUX. We've received your message and our
          concierge team will respond within 24–48 hours.
        </p>
        <p style="margin-top: 30px; font-size: 12px; letter-spacing: 2px; color: #c8a45c;">
          TIMELESS ELEGANCE, PRECISION CRAFTED
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

  async sendNewsletterWelcome(email) {
    const transporter = this.createTransporter()
    if (!transporter) {
      console.warn('Email service not configured — skipping newsletter welcome email')
      return false
    }

    await transporter.sendMail({
      from: `"CHRONOLUX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to CHRONOLUX',
      html: this.buildNewsletterWelcomeHtml(),
    })

    return true
  }

  async sendContactNotification(contactMessage) {
    const transporter = this.createTransporter()
    if (!transporter) {
      console.warn('Email service not configured — skipping contact notification email')
      return false
    }

    // 1) Notify admin
    await transporter.sendMail({
      from: `"CHRONOLUX" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message: ${contactMessage.subject}`,
      html: this.buildContactAdminNotificationHtml(contactMessage),
    })

    // 2) Auto-reply to customer
    await transporter.sendMail({
      from: `"CHRONOLUX" <${process.env.EMAIL_USER}>`,
      to: contactMessage.email,
      subject: 'We received your message — CHRONOLUX',
      html: this.buildContactAutoReplyHtml(contactMessage),
    })

    return true
  }
}

export default new EmailService()