import ContactMessage from '../models/ContactMessage.js'
import emailService from '../services/emailService.js'

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' })
    }

    // Save message to database
    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject?.trim() || 'General Inquiry',
      message: message.trim(),
    })

    // Send response immediately — don't make the user wait for both emails
    res.status(201).json({
      message: "Your message has been sent. We'll get back to you soon.",
      emailSent: true,
    })

    // Send admin notification + customer auto-reply in the background
    emailService.sendContactNotification(contactMessage).catch((err) => {
      console.error('Contact form email failed (background):', err.message)
    })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}