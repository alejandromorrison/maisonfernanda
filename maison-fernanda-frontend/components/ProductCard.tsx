import React from 'react';
import Link from 'next/link';
import useStore from '@/store/useStore';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; alt: string }[];
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useStore();
  const isWishlisted = wishlist.includes(product._id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const primaryImage = product.images[0]?.url || '/placeholder-product.jpg';
  const hoverImage = product.images[1]?.url || primaryImage;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative animate-fade-in-up">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="product-image-wrapper aspect-[3/4] bg-warm-taupe/10 mb-4 relative overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
              isWishlisted ? 'text-gold' : 'text-deep-taupe'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className="w-5 h-5"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-gold text-deep-taupe px-3 py-1 text-xs font-medium uppercase tracking-wider">
              {discount}% Desc.
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-deep-taupe/60 mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-sm mb-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="font-medium">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-deep-taupe/50 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

