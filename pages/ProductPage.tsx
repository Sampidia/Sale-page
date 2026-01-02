
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
                <span className="text-xs font-bold uppercase tracking-widest">Best Seller</span>
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
                <a
                  href={FLUTTERWAVE_URL}
                  className="flex-1 text-center bg-red-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-red-700 transition-all text-lg shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300"
                >
                  Get Started - $25
                </a>
                <a
                  href={CODECANYON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-white text-gray-900 border-2 border-gray-200 font-bold py-4 px-8 rounded-2xl hover:border-red-600 hover:text-red-600 transition-all text-lg"
                >
                  CodeCanyon - $35
                </a>
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center sm:text-left">
                ✓ Instant delivery ✓ Lifetime updates ✓ 30-day money-back guarantee
              </p>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-[3rem] blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto aspect-video object-cover" />
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
              Everything you need to automate content creation and scale your WordPress site to millions of visitors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Multi-AI Provider Support',
                desc: 'Leverage OpenAI GPT-4o, Google Gemini Pro, Anthropic Claude 3.5, and DeepSeek for diverse content generation.',
                icon: '🤖'
              },
              {
                title: 'Bulk Content Generation',
                desc: 'Generate hundreds of articles in minutes with intelligent queuing and automatic publishing.',
                icon: '⚡'
              },
              {
                title: 'SEO Auto-Optimization',
                desc: 'Built-in SEO analyzer ensures every article is optimized for search engines with meta tags, keywords, and structure.',
                icon: '🎯'
              },
              {
                title: 'Instant Publishing & Scheduling',
                desc: 'Publish immediately or schedule content for optimal timing. Set it and forget it.',
                icon: '📅'
              },
              {
                title: 'Automatic Image Generation',
                desc: 'Generate stunning featured images and in-content visuals using DALL-E 3 integration.',
                icon: '🖼️'
              },
              {
                title: 'Campaign Management',
                desc: 'Create and manage multiple content campaigns with different topics, schedules, and AI providers.',
                icon: '📊'
              }
            ].map((feature, idx) => (
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

      {/* Use Cases & Benefits */}
      <section className="py-24 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Perfect For</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a blogger, agency, or enterprise publisher, our plugin scales with your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Content Marketers',
                desc: 'Generate SEO-optimized blog posts at scale without hiring writers.',
                metric: '10x faster content production'
              },
              {
                title: 'Niche Site Builders',
                desc: 'Build authority sites quickly with consistent, high-quality content.',
                metric: '100+ posts per month'
              },
              {
                title: 'Digital Agencies',
                desc: 'Manage multiple client sites with automated content workflows.',
                metric: 'Save 40+ hours/week'
              }
            ].map((useCase, idx) => (
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
            <p className="text-xl text-gray-500">Everything you need to know about the plugin</p>
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
              {
                q: "What's the difference between the Flutterwave and CodeCanyon versions?",
                a: "Both versions are identical in features. Flutterwave offers a lower price ($25 vs $35) and direct purchase, while CodeCanyon provides their marketplace ecosystem and buyer protection."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
              },
              {
                q: "How much does AI usage cost?",
                a: "AI costs depend on your provider and usage. For example, generating 100 articles with GPT-4o typically costs $5-15. DeepSeek is more cost-effective at $1-3 for the same volume."
              }
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
          <div className="mb-8">
            {BRAIN_LOGO}
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ready to Automate Your Content?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 10,000+ publishers using our AI-Powered Content Generator to scale their WordPress sites. Start generating high-quality content today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a
              href={FLUTTERWAVE_URL}
              className="w-full sm:w-auto px-12 py-6 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-xl shadow-2xl shadow-red-900/50 hover:shadow-red-900/70"
            >
              Get Started - $25
            </a>
            <a
              href={CODECANYON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all text-xl"
            >
              Buy on CodeCanyon - $35
            </a>
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
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
