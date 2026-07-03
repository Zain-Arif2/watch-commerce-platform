import React from 'react'

export const ProductCardSkeleton = () => (
  <div className="group">
    <div className="bg-neutral-gray aspect-square overflow-hidden mb-4 animate-pulse">
      <div className="w-full h-full bg-gray-200" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
    <div className="mt-3 h-11 bg-gray-200 rounded animate-pulse" />
  </div>
)

export const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
)
