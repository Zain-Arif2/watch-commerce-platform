import React, { useEffect, useState } from 'react'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetBrandsQuery } from '../../features/brands/brandsApiSlice'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../../features/products/productsApiSlice'
import { useUploadImagesMutation } from '../../features/upload/uploadApiSlice'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  brand: '',
  category: '',
  stock: '',
  isFeatured: false,
  isNewArrival: false,
  isLimitedEdition: false,
}

const ProductFormModal = ({ isOpen, onClose, product = null }) => {
  const isEditing = Boolean(product)
  const { data: brandsData } = useGetBrandsQuery()
  const { data: categoriesData } = useGetCategoriesQuery()
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation()
  const [createProduct, { isLoading: creating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation()

  const [form, setForm] = useState(emptyForm)
  const [existingImages, setExistingImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const brands = brandsData?.data || []
  const categories = categoriesData?.data || []
  const isSubmitting = uploading || creating || updating

  useEffect(() => {
    if (!isOpen) return

    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        discountPrice: product.discountPrice ?? '',
        brand: product.brand?._id || product.brand || '',
        category: product.category?._id || product.category || '',
        stock: product.stock ?? '',
        isFeatured: Boolean(product.isFeatured),
        isNewArrival: Boolean(product.isNewArrival),
        isLimitedEdition: Boolean(product.isLimitedEdition),
      })
      setExistingImages(product.images || [])
    } else {
      setForm(emptyForm)
      setExistingImages([])
    }

    setSelectedFiles([])
    setPreviews([])
  }, [isOpen, product])

  useEffect(() => {
    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(objectUrls)

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [selectedFiles])

  if (!isOpen) return null

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const removeExistingImage = (publicId) => {
    setExistingImages((prev) => prev.filter((image) => image.public_id !== publicId))
  }

  const uploadSelectedImages = async () => {
    if (!selectedFiles.length) return []

    const formData = new FormData()
    selectedFiles.forEach((file) => formData.append('images', file))

    const response = await uploadImages(formData).unwrap()
    return response?.data?.images || []
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name || !form.description || !form.price || !form.brand || !form.category) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      let uploadedImages = []

      if (selectedFiles.length) {
        uploadedImages = await uploadSelectedImages()
      }

      const images = [...existingImages, ...uploadedImages]

      if (!images.length) {
        toast.error('Please upload at least one product image')
        return
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        brand: form.brand,
        category: form.category,
        stock: Number(form.stock) || 0,
        images,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isLimitedEdition: form.isLimitedEdition,
      }

      if (isEditing) {
        await updateProduct({ id: product._id, ...payload }).unwrap()
        toast.success('Product updated successfully')
      } else {
        await createProduct(payload).unwrap()
        toast.success('Product created successfully')
      }

      onClose()
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save product')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#c8a45c]/20 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c8a45c]/20 bg-[#faf9f6]">
          <h2 className="text-2xl font-serif">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h2>
          <button type="button" onClick={onClose} className="text-[#0b0b0c]/60 hover:text-[#0b0b0c]">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-[#0b0b0c]/60 mb-2">Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f]"
              />
            </div>

            <div>
              <label className="block text-sm text-[#0b0b0c]/60 mb-2">Stock *</label>
              <input
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f]"
              />
            </div>

            <div>
              <label className="block text-sm text-[#0b0b0c]/60 mb-2">Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f]"
              />
            </div>

            <div>
              <label className="block text-sm text-[#0b0b0c]/60 mb-2">Discount Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f]"
              />
            </div>

            <div>
              <label className="block text-sm text-[#0b0b0c]/60 mb-2">Brand *</label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f] bg-white"
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#0b0b0c]/60 mb-2">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f] bg-white"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#0b0b0c]/60 mb-2">Description *</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#0b0b0c]/60 mb-2">Product Images *</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#c8a45c]/30 p-8 cursor-pointer hover:border-[#a6813f] transition-colors">
              <Upload className="text-[#a6813f] mb-3" size={28} />
              <span className="text-sm text-[#0b0b0c]/60">
                Click to upload images (max 5, up to 5MB each)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {(existingImages.length > 0 || previews.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {existingImages.map((image) => (
                  <div key={image.public_id} className="relative">
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-28 object-cover border border-[#c8a45c]/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.public_id)}
                      className="absolute top-2 right-2 bg-white/90 p-1 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {previews.map((preview, index) => (
                  <img
                    key={preview}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-28 object-cover border border-[#c8a45c]/20"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={form.isNewArrival}
                onChange={handleChange}
              />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isLimitedEdition"
                checked={form.isLimitedEdition}
                onChange={handleChange}
              />
              Limited Edition
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-[#c8a45c]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-[#c8a45c]/30 hover:border-[#a6813f] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0b0b0c] hover:bg-[#a6813f] text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
