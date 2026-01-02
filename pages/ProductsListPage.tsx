
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { ProductCategory } from '../types';

type FilterOption = 'All' | ProductCategory;

const ProductsListPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

    const filters: FilterOption[] = ['All', 'Plugin', 'Theme', 'Template', 'Script'];

    const filteredProducts = activeFilter === 'All'
        ? PRODUCTS
        : PRODUCTS.filter(product => product.category === activeFilter);

    const getProductCount = (filter: FilterOption): number => {
        if (filter === 'All') return PRODUCTS.length;
        return PRODUCTS.filter(p => p.category === filter).length;
    };

    const getCategoryColor = (category: ProductCategory): string => {
        const colors = {
            'Plugin': 'bg-purple-600',
            'Theme': 'bg-pink-600',
            'Template': 'bg-blue-600',
            'Script': 'bg-green-600'
        };
        return colors[category];
    };

    return (
        <div className="min-h-screen bg-[#0a0e27]">
            {/* Hero Section */}
            <section className="relative pt-20 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-[#0a0e27] to-[#0d1230]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                            Discover Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Products</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                            Premium WordPress plugins, themes, templates, and scripts designed for performance and scalability.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="sticky top-0 z-40 bg-[#0a0e27] border-b border-gray-800 shadow-lg backdrop-blur-sm bg-opacity-95">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {filters.map((filter) => {
                            const count = getProductCount(filter);
                            const isActive = activeFilter === filter;

                            return (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`
                    px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                    ${isActive
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                            : 'bg-[#141b3a] text-gray-400 hover:bg-[#1a2347] hover:text-white'
                                        }
                  `}
                                >
                                    {filter}
                                    <span className={`ml-2 text-xs ${isActive ? 'text-purple-200' : 'text-gray-500'}`}>
                                        ({count})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Products List Section */}
            <section className="py-16 bg-[#0a0e27]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="mb-8">
                                <p className="text-gray-400 text-sm">
                                    Showing <span className="font-semibold text-white">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                                    {activeFilter !== 'All' && <span> in <span className="font-semibold text-white">{activeFilter}s</span></span>}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="bg-[#141b3a] rounded-2xl overflow-hidden hover:bg-[#1a2347] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 border border-gray-800 hover:border-purple-600/50 group"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Left Side - Product Info */}
                                            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                                <div>
                                                    {/* Category Badge */}
                                                    <div className="mb-4">
                                                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white ${getCategoryColor(product.category)}`}>
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    {/* Product Name */}
                                                    <Link to={`/product/${product.id}`}>
                                                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4 hover:text-purple-400 transition-colors cursor-pointer">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    {/* Description */}
                                                    <p className="text-gray-400 text-base leading-relaxed mb-6">
                                                        {product.description}
                                                    </p>

                                                    {/* Features */}
                                                    <ul className="space-y-2 mb-6">
                                                        {product.features.slice(0, 3).map((feature, idx) => (
                                                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-400">
                                                                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Price and CTA */}
                                                <div className="space-y-4">
                                                    <div className="flex items-baseline space-x-2">
                                                        <span className="text-4xl font-black text-white">${product.price}</span>
                                                        {product.alternatePrice && (
                                                            <span className="text-lg text-gray-500 line-through">${product.alternatePrice}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center flex-wrap gap-3">
                                                        <Link
                                                            to={`/product/${product.id}`}
                                                            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105"
                                                        >
                                                            Learn More →
                                                        </Link>
                                                        {product.id === 'ai-content-generator' && (
                                                            <a
                                                                href="https://flutterwave.com/pay/wordpressai"
                                                                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-lg hover:from-pink-700 hover:to-red-700 transition-all shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:scale-105"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                Buy Now
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side - Product Image */}
                                            <Link to={`/product/${product.id}`} className="md:w-2/5 relative overflow-hidden block">
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover md:min-h-[400px] group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#141b3a] rounded-full mb-6">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No {activeFilter}s Found</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                We don't have any {activeFilter.toLowerCase()}s available at the moment. Check back soon or explore other categories!
                            </p>
                            <button
                                onClick={() => setActiveFilter('All')}
                                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-[#0a0e27] to-[#0d1230] border-t border-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Need Custom Development?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Looking for a tailored solution? Our team can build custom plugins, themes, and integrations for your specific needs.
                    </p>
                    <a
                        href="mailto:admin@sampidia.cm"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-600/30 transition-all"
                    >
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ProductsListPage;
