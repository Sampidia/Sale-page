
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-2xl font-black text-gray-900">${product.price}</span>
            {product.alternatePrice && (
              <span className="text-sm text-gray-400 line-through">${product.alternatePrice}</span>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Link 
              to={`/product/${product.id}`}
              className="w-full text-center bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-sm"
            >
              View Details
            </Link>
            <a 
              href={product.buyUrl}
              className="w-full text-center border-2 border-red-600 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              Buy Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
