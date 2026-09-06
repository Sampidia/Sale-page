import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { ProductCategory } from '../types';
import SEO from '../components/SEO';

type FilterOption = 'All' | ProductCategory;

const ProductsListPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const fbqFunc = (window as any).fbq;
            if (fbqFunc) {
                try {
                    fbqFunc('track', 'ViewContent', {
                        content_name: 'Products & Plugins Catalog',
                        content_category: 'Catalog',
                        content_type: 'product_group',
                    });
                } catch (err) {
                    console.error('Failed to trigger Facebook Pixel Catalog ViewContent event:', err);
                }
            }
        }
    }, []);

    const filters: FilterOption[] = ['All', 'Plugin', 'Theme', 'Template', 'Script'];

    const filteredProducts = activeFilter === 'All'
        ? PRODUCTS
        : PRODUCTS.filter(product => product.category === activeFilter);

    const getProductCount = (filter: FilterOption): number => {
        if (filter === 'All') return PRODUCTS.length;
        return PRODUCTS.filter(p => p.category === filter).length;
    };

    const getCategoryBadgeStyle = (category: ProductCategory): string => {
        const styles = {
            'Plugin': 'bg-red-950/80 text-red-300 border border-red-800/60',
            'Theme': 'bg-blue-950/80 text-blue-300 border border-blue-800/60',
            'Template': 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60',
            'Script': 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
        };
        return styles[category] || 'bg-slate-800 text-slate-200 border border-slate-700';
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-red-600 selection:text-white">
            <SEO
                title="All Premium Plugins & Themes | Afigo-Sam"
                description="Browse our high-performance suite of premium WordPress plugins, responsive themes, templates, and backend scripts built to optimize performance and scale digital publishing."
                keywords="wordpress plugins list, license manager download, booking themes pro, high scaling wordpress scripts"
                ogImage="/assets/banner-772x250.webp"
            />

            {/* Top Ambient Glows */}
            <div className="relative overflow-hidden pt-12 pb-16 md:pt-24 md:pb-20 border-b border-slate-800/80">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/70 border border-red-800/60 text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <span>🚀 Premium Software Catalog</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                            Discover Our <span className="text-red-500">Products</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-normal">
                            High-performance WordPress plugins, responsive themes, turn-key templates, and scalable scripts engineered for growth.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Navigation Bar */}
            <section className="sticky top-16 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-black/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {filters.map((filter) => {
                            const count = getProductCount(filter);
                            const isActive = activeFilter === filter;

                            return (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`
                                        px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer
                                        ${isActive
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-950/60 border border-red-500/40 scale-[1.02]'
                                            : 'bg-[#12111c] text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    {filter}
                                    <span className={`ml-2 text-xs font-semibold ${isActive ? 'text-red-100' : 'text-slate-500'}`}>
                                        ({count})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Products Catalog List */}
            <section className="py-16 bg-[#0b0f19]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="mb-8 flex items-center justify-between">
                                <p className="text-slate-400 text-xs sm:text-sm">
                                    Showing <span className="font-bold text-white">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                                    {activeFilter !== 'All' && <span> in <span className="font-bold text-red-400">{activeFilter}s</span></span>}
                                </p>
                            </div>

                            <div className="space-y-8">
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="bg-[#12111c] rounded-3xl overflow-hidden hover:bg-[#161524] transition-all duration-300 border border-slate-800/90 hover:border-red-500/40 shadow-xl group"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Left Side - Product Details */}
                                            <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                                                <div>
                                                    {/* Category Pill */}
                                                    <div className="mb-4">
                                                        <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${getCategoryBadgeStyle(product.category)}`}>
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    {/* Product Title */}
                                                    <Link to={`/product/${product.id}`}>
                                                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 hover:text-red-400 transition-colors cursor-pointer leading-snug">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    {/* Description */}
                                                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                                                        {product.description}
                                                    </p>

                                                    {/* Feature Highlights */}
                                                    <ul className="space-y-2.5 mb-8">
                                                        {product.features.slice(0, 3).map((feature, idx) => (
                                                            <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                                                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Price & Solid Action Buttons */}
                                                <div className="pt-4 border-t border-slate-800/80 space-y-4">
                                                    <div className="flex items-baseline space-x-2.5">
                                                        <span className="text-3xl sm:text-4xl font-black text-white">
                                                            {product.price === 0 ? 'Free' : `$${product.price}`}
                                                        </span>
                                                        {product.alternatePrice && product.price !== 0 && (
                                                            <span className="text-sm sm:text-base text-slate-500 line-through">${product.alternatePrice}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center flex-wrap gap-3">
                                                        <Link
                                                            to={`/product/${product.id}`}
                                                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-950/50 hover:shadow-red-900/60 text-xs sm:text-sm flex items-center space-x-1.5"
                                                        >
                                                            <span>Learn More</span>
                                                            <span>→</span>
                                                        </Link>
                                                        {product.id === 'ai-content-generator' && (
                                                            <Link
                                                                to={`/product/${product.id}`}
                                                                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold rounded-xl transition-all text-xs sm:text-sm"
                                                            >
                                                                Buy Now - ${product.price}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side - Product Preview */}
                                            <Link to={`/product/${product.id}`} className="md:w-2/5 relative overflow-hidden block bg-[#09080e] min-h-[220px] md:min-h-full">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 relative z-10"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-[#12111c] rounded-3xl border border-slate-800 p-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 border border-slate-800 text-slate-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No {activeFilter}s Found</h3>
                            <p className="text-slate-400 mb-6 max-w-md mx-auto text-xs sm:text-sm">
                                We don't have any {activeFilter.toLowerCase()}s available at the moment. Explore our other categories!
                            </p>
                            <button
                                onClick={() => setActiveFilter('All')}
                                className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-xs sm:text-sm"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Custom Solution CTA Section */}
            <section className="py-16 bg-[#080b13] border-t border-slate-800/80 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Need Custom Software Development?
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
                        Looking for a tailored plugin, custom theme, or automated AI script? Our team builds high-scaling custom solutions.
                    </p>
                    <a
                        href="mailto:admin@sampidia.com"
                        className="inline-block px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-950/60 text-sm"
                    >
                        Contact Engineering Team
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ProductsListPage;
