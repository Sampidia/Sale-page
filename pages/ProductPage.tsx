
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS, BRAIN_LOGO, FLUTTERWAVE_URL, CODECANYON_URL } from '../constants';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!product) {
    return (
      <div className="py-32 text-center bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="mb-6 opacity-20">{BRAIN_LOGO}</div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the plugin or theme you're looking for.</p>
        <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-100">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isAIPlugin = product.id === 'ai-content-generator';

  return (
    <div className="bg-white">
      {/* Product Hero */}
      <section className="pt-12 pb-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center text-sm text-gray-400 font-medium">
            <Link to="/" className="hover:text-red-600 transition-colors">Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.category}s</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate max-w-[150px] md:max-w-none">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto aspect-video object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-100 cursor-pointer hover:border-red-500 transition-colors">
                    <img src={`https://picsum.photos/seed/${product.id}-${i}/400/225`} alt="Screenshot" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="text-red-600 font-black text-xs uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>
              
              <div className="bg-gray-50 rounded-3xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-sm text-gray-500 block">Lifetime License</span>
                    <span className="text-4xl font-black text-gray-900">${product.price}</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Available Now
                  </div>
                </div>

                <div className="space-y-3">
                  <a 
                    href={FLUTTERWAVE_URL}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white font-bold py-5 rounded-2xl hover:bg-red-700 transition-all text-xl shadow-xl shadow-red-200"
                  >
                    <span>Purchase via Flutterwave</span>
                    <span className="text-sm font-normal opacity-80">($25)</span>
                  </a>
                  <a 
                    href={CODECANYON_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-white text-gray-900 border-2 border-gray-200 font-bold py-5 rounded-2xl hover:border-red-600 hover:text-red-600 transition-all text-xl"
                  >
                    <span>Buy on CodeCanyon</span>
                    <span className="text-sm font-normal opacity-50">($35)</span>
                  </a>
                </div>
                <p className="text-xs text-center text-gray-400 mt-4">
                  Secured checkout. Instant digital delivery after payment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                  <span className="block text-xl font-bold text-gray-900">10k+</span>
                  <span className="text-sm text-gray-500">Global Installs</span>
                </div>
                <div className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                  <span className="block text-xl font-bold text-gray-900">4.9/5</span>
                  <span className="text-sm text-gray-500">Customer Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Core Capabilities</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Engineered for maximum reliability and ease of use in professional WordPress environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-red-50 text-red-600 flex items-center justify-center rounded-xl mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature}</h3>
                <p className="text-sm text-gray-500">Expertly built with performance in mind. This feature works out of the box with zero configuration required.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isAIPlugin && (
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-8 leading-tight">
                  Integrated with <br/> World-Class AI
                </h2>
                <div className="space-y-6">
                  {[
                    { name: 'OpenAI GPT-4o', desc: 'Superior reasoning and creative writing capabilities.' },
                    { name: 'Google Gemini Pro', desc: 'Incredible speed and vast knowledge integration.' },
                    { name: 'Anthropic Claude 3.5', desc: 'Highly nuanced and human-like narrative flow.' },
                    { name: 'DeepSeek', desc: 'Cost-effective high-quality reasoning and coding.' }
                  ].map((ai) => (
                    <div key={ai.name} className="flex items-start space-x-4">
                      <div className="w-2 h-2 mt-2.5 rounded-full bg-red-600"></div>
                      <div>
                        <h4 className="font-bold text-gray-900">{ai.name}</h4>
                        <p className="text-gray-500 text-sm">{ai.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl">
                  <pre className="text-xs md:text-sm font-mono text-gray-400 overflow-x-auto">
                    <code>{`
// Automated Workflow
{
  "plugin": "Afigo-Sam AI",
  "engine": "gemini-3-pro",
  "task": "generate_optimized_article",
  "parameters": {
    "topic": "WordPress Automation",
    "seo_focus": "High",
    "images": "DALL-E-3"
  }
}

// Result: Success (2,400 words generated)
                    `}</code>
                  </pre>
                  <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-bold">API STATUS: ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-10">Start Growing Your Business Today</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href={FLUTTERWAVE_URL}
              className="px-12 py-5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-xl shadow-2xl shadow-red-200 w-full sm:w-auto"
            >
              Get Started ($25)
            </a>
            <Link to="/" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
