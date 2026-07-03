import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ProductImportService from './services/ProductImportService.js'

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    const result = await ProductImportService.importDummyJsonWatches()

    console.log(
      `Seeded ${result.totalProducts} products across ${result.totalBrands} brands and ${result.totalCategories} categories`
    )
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seedData()
