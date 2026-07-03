import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import ProductFormModal from "../../components/admin/ProductFormModal";
import { useGetProductsQuery, useDeleteProductMutation } from "../../features/products/productsApiSlice";
import { ProductCardSkeleton } from "../../components/Skeleton";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const { data, isLoading } = useGetProductsQuery({ limit: 100 });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const products = data?.data?.products || [];

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(`Delete "${productName}"? This will also remove Cloudinary images.`);
    if (!confirmed) return;

    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  return (
    <AdminLayout>
      <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#a6813f] mb-3">
              PRODUCT MANAGEMENT
            </p>
            <h2 className="text-4xl font-serif">Products</h2>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white px-6 py-3 tracking-wider"
          >
            ADD PRODUCT
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#c8a45c]/20 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-[#faf9f6] border-b border-[#c8a45c]/20">
                <tr>
                  <th className="text-left px-6 py-5 font-semibold">Product</th>
                  <th className="text-left px-6 py-5 font-semibold">Brand</th>
                  <th className="text-left px-6 py-5 font-semibold">Price</th>
                  <th className="text-left px-6 py-5 font-semibold">Stock</th>
                  <th className="text-left px-6 py-5 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-[#c8a45c]/10 hover:bg-[#faf9f6] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-14 h-14 object-cover border border-[#c8a45c]/20"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-[#0b0b0c]/50">
                            {product.category?.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-[#0b0b0c]/70">
                      {product.brand?.name}
                    </td>

                    <td className="px-6 py-5 font-semibold">
                      ${product.discountPrice || product.price}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-sm border ${
                          product.stock > 0
                            ? "border-green-300 text-green-700"
                            : "border-red-300 text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="border border-[#c8a45c]/30 hover:border-[#a6813f] hover:text-[#a6813f] transition-all px-4 py-2"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deleting}
                          className="border border-red-300 text-red-600 hover:bg-red-50 transition-all px-4 py-2 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!products.length && (
              <div className="text-center py-16 text-[#0b0b0c]/60">
                No products available.
              </div>
            )}
          </div>
        )}

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={editingProduct}
        />
      </main>
    </AdminLayout>
  );
};

export default AdminProducts;
