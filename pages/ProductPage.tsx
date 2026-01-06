
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS, BRAIN_LOGO, FLUTTERWAVE_URL, CODECANYON_URL } from '../constants';
import BookDocumentation from '../components/BookDocumentation';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBookOpen, setIsBookOpen] = useState(false);

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
  const isLicenseManager = product.id === 'my-licenses-manager';

  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center text-sm text-gray-400 font-medium">
            <Link to="/" className="hover:text-red-600 transition-colors">Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.category}s</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate max-w-[150px] md:max-w-none">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-red-200">
                <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest">{product.badge || 'Best Seller'}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                {product.name}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {['Multi-AI Support', 'Auto-SEO', 'Bulk Generation', '24/7 Support'].map((badge) => (
                  <span key={badge} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {product.price === 0 ? (
                  <a
                    href={product.buyUrl}
                    className="flex-1 text-center bg-green-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-green-700 transition-all text-lg shadow-xl shadow-green-200 hover:shadow-2xl hover:shadow-green-300"
                  >
                    Get for free
                  </a>
                ) : (
                  <>
                    <a
                      href={product.buyUrl || FLUTTERWAVE_URL}
                      className="flex-1 text-center bg-red-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-red-700 transition-all text-lg shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300"
                    >
                      Get Started - ${product.price}
                    </a>
                    {product.alternateUrl && (
                      <a
                        href={product.alternateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-white text-gray-900 border-2 border-gray-200 font-bold py-4 px-8 rounded-2xl hover:border-red-600 hover:text-red-600 transition-all text-lg"
                      >
                        CodeCanyon - ${product.alternatePrice || 35}
                      </a>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center sm:text-left">
                ✓ Instant delivery ✓ Lifetime updates {product.price !== 0 && '✓ 30-day money-back guarantee'}
              </p>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-[3rem] blur-2xl opacity-20"></div>
              <div className="relative bg-gray-50 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex items-center justify-center min-h-[300px]">
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto max-h-[500px] object-contain" />
              </div>

              {/* Stats Overlay */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-gray-900">10k+</div>
                    <div className="text-xs text-gray-500">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">4.9/5</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">99.9%</div>
                    <div className="text-xs text-gray-500">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              {product.id === 'ai-content-generator'
                ? 'Everything you need to automate content creation and scale your WordPress site to millions of visitors.'
                : 'Advanced tools and integration capabilities designed to help developers manage and scale their products effectively.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(product.detailedFeatures || []).map((feature, idx) => (
              <div key={idx} className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Providers Integration */}
      {isAIPlugin && (
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Powered by World-Class AI</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Choose from the best AI models in the world. Switch providers anytime or use multiple models for different content types.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { name: 'OpenAI GPT-4o', desc: 'Superior reasoning and creative writing', color: 'from-green-400 to-emerald-600' },
                { name: 'Google Gemini Pro', desc: 'Incredible speed and vast knowledge', color: 'from-blue-400 to-indigo-600' },
                { name: 'Anthropic Claude 3.5', desc: 'Human-like narrative flow', color: 'from-purple-400 to-pink-600' },
                { name: 'DeepSeek', desc: 'Cost-effective high-quality output', color: 'from-orange-400 to-red-600' }
              ].map((ai, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ai.color} mb-4 flex items-center justify-center text-2xl font-black`}>
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{ai.name}</h3>
                  <p className="text-sm text-gray-400">{ai.desc}</p>
                </div>
              ))}
            </div>

            {/* Code Demo */}
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-400 font-mono">wp-ai-generator-config.json</span>
              </div>
              <pre className="text-sm md:text-base font-mono text-gray-300 overflow-x-auto">
                {`{
  "campaign": "Tech Blog Automation",
  "ai_provider": "gemini-pro",
  "content_type": "blog_post",
  "topics": ["WordPress", "AI", "Automation"],
  "schedule": "daily",
  "seo_optimization": true,
  "auto_publish": true,
  "image_generation": "dall-e-3"
}

// ✅ Campaign activated - Generating 10 posts/day`}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* Developer Resources / Integration */}
      {isLicenseManager && (
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Developer Resources</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Everything you need to integrate and extend the license manager in your own applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              {/* Integration Guides */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mr-4 border border-blue-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </span>
                  Integration Guides
                </h3>
                <div className="grid gap-4">
                  {(isLicenseManager ? [
                    { title: 'Licence documentation', action: () => setIsBookOpen(true) },
                    { title: 'WP Express Checkout Integration', url: '/assets/lmy licenses manager documentation.pdf', isDownload: true },
                    { title: 'WP eStore Integration', action: () => setIsBookOpen(true) }
                  ] : [
                    { title: 'AI Plugin Documentation', url: '#' },
                    { title: 'API Integration Guide', url: '#' }
                  ]).map((link, idx) => (
                    link.action ? (
                      <button
                        key={idx}
                        onClick={link.action}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all flex items-center justify-between group text-left w-full"
                      >
                        <span className="font-bold">{link.title}</span>
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </button>
                    ) : (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={link.isDownload}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all flex items-center justify-between group"
                      >
                        <span className="font-bold">{link.title}</span>
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* API Demo */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-10 h-10 bg-emerald-600/20 text-emerald-400 rounded-xl flex items-center justify-center mr-4 border border-emerald-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </span>
                  API Quick Start
                </h3>
                <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-sm text-gray-400 font-mono">license-check.php</span>
                  </div>
                  <pre className="text-sm md:text-base font-mono text-gray-300 overflow-x-auto">
                    {`<?php
$api_url = "https://yourserver.com/api";
$params = [
  'mlm_action' => 'check_license',
  'license_key' => 'YOUR-KEY',
  'item_ref' => 'PRODUCT-NAME',
  'secret' => 'YOUR-SECRET'
];

$response = wp_remote_post($api_url, [
  'body' => $params
]);
$data = json_decode(
  wp_remote_retrieve_body($response)
);

if ($data->result === 'success') {
  // ✅ License validated!
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-[2.5rem] border border-white/10 text-center">
              <span className="bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-red-500/20">
                Important Notice
              </span>
              <p className="text-2xl font-bold text-white mb-4 max-w-2xl">
                This plugin is strictly for developers.
              </p>
              <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                If you need extra action hooks or custom filters for your specific integration, please let us know through our support channels.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Screenshots Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Plugin Showcase</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              {product.id === 'ai-content-generator'
                ? 'A glimpse into the clean, intuitive, and high-performance interface designed for a seamless workflow.'
                : 'Take a tour of the powerful management dashboard and developer-friendly configuration interface.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { img: '/assets/screenshot-1.png', title: 'Intuitive Dashboard' },
              { img: '/assets/screenshot-2.png', title: 'Advanced Settings' },
              { img: '/assets/screenshot-3.png', title: 'Real-time Tracking' },
              { img: '/assets/screenshot-4.png', title: 'Seamless Integration' }
            ].map((shot, idx) => (
              <div
                key={idx}
                className="group relative cursor-pointer"
                onClick={() => setSelectedImage(shot.img)}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-700"></div>
                <div className="relative bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                  <img src={shot.img} alt={shot.title} className="w-full h-auto" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white font-bold text-lg">{shot.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases & Benefits */}
      <section className="py-24 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Perfect For</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {product.id === 'ai-content-generator'
                ? "Whether you're a blogger, agency, or enterprise publisher, our plugin scales with your needs."
                : 'Empowering developers and support teams with the tools they need to manage software licenses at scale.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(product.perfectFor || []).map((useCase, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{useCase.desc}</p>
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm inline-block">
                  {useCase.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Loved by Publishers</h2>
            <p className="text-xl text-gray-500">Join thousands of satisfied customers worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This plugin transformed our content strategy. We went from 5 posts/month to 150+ without sacrificing quality.",
                author: "Sarah Johnson",
                role: "Content Director, TechBlog"
              },
              {
                quote: "The multi-AI provider support is genius. We use different models for different content types and the results are amazing.",
                author: "Michael Chen",
                role: "Founder, NicheSites Pro"
              },
              {
                quote: "ROI was immediate. We recovered the cost in the first week and now save 40+ hours monthly on content creation.",
                author: "Emily Rodriguez",
                role: "Marketing Manager, StartupHub"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="text-red-600 text-5xl mb-4">"</div>
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-500">
              {product.id === 'ai-content-generator'
                ? 'Everything you need to know about the plugin'
                : 'Common questions about license management and integration.'}
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Do I need my own API keys?",
                a: "Yes, you'll need API keys from your chosen AI provider(s). We support OpenAI, Google Gemini, Anthropic Claude, and DeepSeek. This ensures you have full control and pay directly for usage."
              },
              {
                q: "Is this compatible with my WordPress theme?",
                a: "Absolutely! The plugin works with any WordPress theme. It integrates seamlessly with the WordPress editor and uses standard post types."
              },
              {
                q: "Can I edit the generated content before publishing?",
                a: "Yes! You have full control. Content can be saved as drafts for review, or you can enable auto-publishing for hands-free operation."
              },
              ...(product.price !== 0 ? [
                {
                  q: "Do you offer refunds?",
                  a: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
                },
                {
                  q: "What's the difference between the Flutterwave and CodeCanyon versions?",
                  a: "Both versions are identical in features. Flutterwave offers a lower price ($25 vs $35) and direct purchase, while CodeCanyon provides their marketplace ecosystem and buyer protection."
                }
              ] : []),
              ...(product.id === 'ai-content-generator' ? [{
                q: "How much does AI usage cost?",
                a: "AI costs depend on your provider and usage. For example, generating 100 articles with GPT-4o typically costs $5-15. DeepSeek is more cost-effective at $1-3 for the same volume."
              }] : [])
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8 flex justify-center">
            {product.id === 'my-licenses-manager' ? (
              <img src="/assets/license-manager.png" alt="License Manager Icon" className="w-24 h-24 object-contain drop-shadow-2xl" />
            ) : (
              BRAIN_LOGO
            )}
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {product.id === 'ai-content-generator'
              ? 'Ready to Automate Your Content?'
              : `Ready to Scale with ${product.name}?`}
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {product.id === 'ai-content-generator'
              ? 'Join 10,000+ publishers using our AI-Powered Content Generator to scale their WordPress sites. Start generating high-quality content today.'
              : product.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            {product.price === 0 ? (
              <a
                href={product.buyUrl}
                className="w-full sm:w-auto px-12 py-6 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all text-xl shadow-2xl shadow-green-900/50 hover:shadow-green-900/70"
              >
                Get for free
              </a>
            ) : (
              <>
                <a
                  href={product.buyUrl || FLUTTERWAVE_URL}
                  className="w-full sm:w-auto px-12 py-6 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-xl shadow-2xl shadow-red-900/50 hover:shadow-red-900/70"
                >
                  Get Started - ${product.price}
                </a>
                {product.alternateUrl && (
                  <a
                    href={product.alternateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all text-xl"
                  >
                    Buy on CodeCanyon - ${product.alternatePrice || 35}
                  </a>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lifetime Updates</span>
            </div>
            {product.price !== 0 && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>30-Day Guarantee</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors p-2"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-5xl w-full h-auto bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImage} alt="Full size preview" className="w-full h-auto" />
          </div>
        </div>
      )}
      <BookDocumentation isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </div>
  );
};

export default ProductPage;
