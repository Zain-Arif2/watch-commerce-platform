import Newsletter from '../models/Newsletter.js'
import emailService from '../services/EmailService.js'

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(200).json({
        message: 'You are already subscribed to our newsletter.',
        alreadySubscribed: true,
      })
    }

    // Save subscriber to database
    const subscriber = await Newsletter.create({ email: normalizedEmail })

    // Send response immediately — don't make the user wait for the email
    res.status(201).json({
      message: "Thank you — you're on the list.",
      subscriber: { email: subscriber.email },
      emailSent: true,
    })

    // Send welcome email in the background (after response is already sent)
    emailService.sendNewsletterWelcome(normalizedEmail).catch((err) => {
      console.error('Newsletter welcome email failed (background):', err.message)
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}