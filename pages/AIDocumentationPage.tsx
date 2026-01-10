
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAIN_LOGO } from '../constants';

const AIDocumentationPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = 'assets/wordpress-ai-content-documentation.pdf';
        link.download = 'wordpress-ai-content-documentation.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
            const offset = 120; // Account for sticky header + some padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-white">
            {/* Header Section */}
            <header className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 text-white">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Breadcrumb */}
                    <nav className="mb-8 flex items-center text-sm text-purple-200 font-medium">
                        <Link to="/" className="hover:text-white transition-colors">Catalog</Link>
                        <span className="mx-2">/</span>
                        <Link to="/product/ai-content-generator" className="hover:text-white transition-colors">AI Content Generator</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Documentation</span>
                    </nav>

                    <div className="text-center">
                        <div className="mb-6 flex justify-center opacity-90">
                            {BRAIN_LOGO}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 text-shadow-lg">
                            WordPress AI-Powered Automatic Content Generator
                        </h1>
                        <p className="text-xl md:text-2xl opacity-95 mb-4">
                            Auto Posting Plugin - Complete Documentation
                        </p>
                        <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold">
                            Version 1.0.0
                        </span>

                        {/* Download Button */}
                        <div className="mt-8">
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center gap-3 bg-white text-purple-700 font-bold py-4 px-8 rounded-2xl hover:bg-purple-50 transition-all text-lg shadow-xl hover:shadow-2xl"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF Documentation
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav className="sticky top-0 z-50 bg-gray-50 border-b-2 border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <ul className="flex flex-wrap gap-4 justify-center text-sm font-semibold">
                        {[
                            { label: 'Overview', href: '#overview' },
                            { label: 'Installation', href: '#installation' },
                            { label: 'Features', href: '#features' },
                            { label: 'Configuration', href: '#configuration' },
                            { label: 'AI Providers', href: '#ai-providers' },
                            { label: 'Content Sources', href: '#content-sources' },
                            { label: 'Automation', href: '#automation' },
                            { label: 'License', href: '#license' },
                            { label: 'API Reference', href: '#api' },
                            { label: 'Troubleshooting', href: '#troubleshooting' },
                            { label: 'Best Practices', href: '#best-practices' },
                            { label: 'FAQ', href: '#faq' }
                        ].map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="text-purple-600 hover:text-purple-800 transition-colors"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* OVERVIEW SECTION */}
                <section id="overview" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Overview</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed text-justify">
                        The <strong>WordPress AI-Powered Automatic Content Generator & Auto Posting Plugin</strong> is a
                        comprehensive solution that transforms your WordPress site into a content powerhouse. By leveraging
                        the world's most advanced AI models, this plugin automatically generates, optimizes, and publishes
                        high-quality blog posts without manual intervention.
                    </p>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">What Makes This Plugin Unique?</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed text-justify">
                        Unlike simple AI wrappers, this plugin offers deep integration with WordPress core, robust error
                        handling, sophisticated licensing system, and support for multiple AI providers. It's designed for
                        content creators, bloggers, affiliate marketers, and news sites who want to maintain a consistent
                        publishing schedule with minimal effort.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg my-6">
                        <p className="text-blue-900">
                            <strong>💡 Key Benefit:</strong> Save hundreds of hours every month by automating your entire
                            editorial calendar while maintaining high-quality, SEO-optimized content.
                        </p>
                    </div>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">System Requirements</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-purple-600 text-white">
                                    <th className="px-6 py-4 text-left font-semibold">Requirement</th>
                                    <th className="px-6 py-4 text-left font-semibold">Minimum</th>
                                    <th className="px-6 py-4 text-left font-semibold">Recommended</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">WordPress Version</td>
                                    <td className="px-6 py-4">5.0 or higher</td>
                                    <td className="px-6 py-4">6.0 or higher</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">PHP Version</td>
                                    <td className="px-6 py-4">7.4 or higher</td>
                                    <td className="px-6 py-4">8.0 or higher</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">MySQL Version</td>
                                    <td className="px-6 py-4">5.6 or higher</td>
                                    <td className="px-6 py-4">8.0 or higher</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">PHP Memory Limit</td>
                                    <td className="px-6 py-4">128MB</td>
                                    <td className="px-6 py-4">256MB or higher</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">SSL/HTTPS</td>
                                    <td className="px-6 py-4 font-semibold" colSpan={2}>Required (for API connections)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* INSTALLATION SECTION */}
                <section id="installation" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Installation</h2>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Automatic Installation</h3>
                    <ol className="list-none space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <span className="text-gray-700 pt-1">Log in to your WordPress admin panel</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <span className="text-gray-700 pt-1">Navigate to <strong>Plugins → Add New</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <span className="text-gray-700 pt-1">Search for "WordPress AI-Powered Automatic Content Generator"</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                            <span className="text-gray-700 pt-1">Click <strong>"Install Now"</strong> and then <strong>"Activate"</strong></span>
                        </li>
                    </ol>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Manual Installation</h3>
                    <ol className="list-none space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <span className="text-gray-700 pt-1">Download the plugin ZIP file from your purchase location</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <span className="text-gray-700 pt-1">Log in to your WordPress admin panel</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <span className="text-gray-700 pt-1">Navigate to <strong>Plugins → Add New → Upload Plugin</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                            <span className="text-gray-700 pt-1">Choose the downloaded ZIP file and click <strong>"Install Now"</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                            <span className="text-gray-700 pt-1">Activate the plugin through the <strong>'Plugins'</strong> menu</span>
                        </li>
                    </ol>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg my-6">
                        <p className="text-yellow-900">
                            <strong>⚠️ Important:</strong> You must activate your license key before you can create automation
                            campaigns or content sources. The plugin will continue to work without a valid license, but with
                            limited functionality.
                        </p>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section id="features" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🤖',
                                title: 'Multi-Model AI Integration',
                                desc: 'Choose between OpenAI (GPT-4), Google Gemini, Anthropic Claude, DeepSeek, and Hugging Face for the best content quality.'
                            },
                            {
                                icon: '📡',
                                title: 'Automated Content Sourcing',
                                desc: 'Fetch fresh ideas and data from RSS feeds, Reddit, and direct web scraping. Never run out of content ideas again.'
                            },
                            {
                                icon: '🎯',
                                title: 'Smart Campaign Management',
                                desc: 'Create multiple automation campaigns with fine-tuned schedules and category targeting.'
                            },
                            {
                                icon: '🔍',
                                title: 'SEO Optimization',
                                desc: 'Automatically generate SEO-friendly titles, meta descriptions, and alt text for images.'
                            },
                            {
                                icon: '🖼️',
                                title: 'Dynamic Image Generation',
                                desc: 'Generate relevant featured images for every post using AI imaging services.'
                            },
                            {
                                icon: '⏰',
                                title: 'Flexible Scheduling',
                                desc: 'Set custom posting frequencies (hourly, daily, weekly) with drip-feed limits.'
                            },
                            {
                                icon: '🛡️',
                                title: 'Advanced Filtering',
                                desc: 'Content safety filters, keyword blacklists, and duplicate detection ensure only quality content gets published.'
                            },
                            {
                                icon: '📊',
                                title: 'Comprehensive Analytics',
                                desc: 'Track campaign performance, model usage, and success rates with detailed insights and visualizations.'
                            },
                            {
                                icon: '🔐',
                                title: 'License Management',
                                desc: 'Built-in license activation and validation system with automatic updates and secure verification.'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h4 className="text-xl font-bold text-purple-700 mb-3">{feature.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Placeholder sections for remaining content */}
                <section id="configuration" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Configuration</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Access the plugin settings by navigating to <strong>AI Generator → Settings</strong> in your WordPress admin panel.
                    </p>
                    <div className="my-8 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                        <img
                            src="assets/ai-Screenshot-6.png"
                            alt="AI Generator Configuration Settings"
                            className="w-full h-auto"
                        />
                    </div>
                </section>

                <section id="ai-providers" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">AI Providers</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        The plugin supports multiple AI providers including OpenAI, Google Gemini, Anthropic Claude, DeepSeek, and Hugging Face.
                    </p>
                    <div className="my-8 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                        <img
                            src="assets/ai-Screenshot-3.png"
                            alt="AI Providers Settings"
                            className="w-full h-auto"
                        />
                    </div>
                </section>

                <section id="content-sources" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Content Sources</h2>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">RSS Feeds</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Monitor any RSS or Atom feed for new content. The plugin automatically fetches new items and uses
                        them as inspiration for AI-generated posts.
                    </p>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Adding an RSS Source</h4>
                    <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                        <li>Navigate to <strong>AI Generator → Sources</strong></li>
                        <li>Click <strong>"Add New Source"</strong></li>
                        <li>Select <strong>"RSS Feed"</strong> as the source type</li>
                        <li>Enter the RSS feed URL</li>
                        <li>Configure fetch frequency and item limits</li>
                        <li>Click <strong>"Save Source"</strong></li>
                    </ol>

                    <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm mb-8">
                        <pre>Source Type: RSS Feed
                            Feed URL: https://example.com/feed
                            Fetch Frequency: Every 6 hours
                            Max Items: 10
                            Status: Active</pre>
                    </div>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Reddit</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Pull trending posts from any subreddit. Perfect for news sites, trending topics, and niche communities.
                    </p>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Adding a Reddit Source</h4>
                    <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                        <li>Navigate to <strong>AI Generator → Sources</strong></li>
                        <li>Click <strong>"Add New Source"</strong></li>
                        <li>Select <strong>"Reddit"</strong> as the source type</li>
                        <li>Enter the subreddit name (without r/)</li>
                        <li>Choose sorting method (hot, new, top, rising)</li>
                        <li>Set time filter (hour, day, week, month, year, all)</li>
                        <li>Click <strong>"Save Source"</strong></li>
                    </ol>

                    <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm mb-8">
                        <pre>Source Type: Reddit
                            Subreddit: technology
                            Sort By: hot
                            Time Filter: day
                            Max Posts: 5
                            Status: Active</pre>
                    </div>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Web Scraping</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Extract content from any webpage. Useful for monitoring competitor blogs, news sites, or specific web pages.
                    </p>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Adding a Web Scraping Source</h4>
                    <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                        <li>Navigate to <strong>AI Generator → Sources</strong></li>
                        <li>Click <strong>"Add New Source"</strong></li>
                        <li>Select <strong>"Web Scraping"</strong> as the source type</li>
                        <li>Enter the target URL</li>
                        <li>Optionally specify CSS selectors for targeted scraping</li>
                        <li>Click <strong>"Save Source"</strong></li>
                    </ol>

                    <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm mb-8">
                        <pre>Source Type: Web Scraping
                            Target URL: https://example.com/blog
                            CSS Selector: .post-content
                            Fetch Frequency: Daily
                            Status: Active</pre>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                        <p className="text-yellow-900">
                            <strong>⚠️ Legal Notice:</strong> Always respect copyright laws and website terms of service when
                            scraping content. Use scraped content only as inspiration, not for direct republication.
                        </p>
                    </div>
                </section>

                {/* AUTOMATION SECTION - Due to character limits, I'll add this in the next file write */}
                <section id="automation" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Automation Campaigns</h2>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Creating an Automation Campaign</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Automation campaigns are the heart of the plugin. They define how content is sourced, generated, and
                        published automatically.
                    </p>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Campaign Creation Steps</h4>
                    <ol className="list-none space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <span className="text-gray-700 pt-1">Navigate to <strong>AI Generator → Automation</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <span className="text-gray-700 pt-1">Click <strong>"Create New Campaign"</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <span className="text-gray-700 pt-1">Enter a campaign name and description</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                            <span className="text-gray-700 pt-1">Select content sources to use</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                            <span className="text-gray-700 pt-1">Choose AI provider and model</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">6</span>
                            <span className="text-gray-700 pt-1">Configure posting schedule</span>
                        </li>
                    </ol>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Campaign Settings</h3>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Scheduling Options</h4>
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-purple-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">Frequency</th>
                                    <th className="px-6 py-3 text-left">Description</th>
                                    <th className="px-6 py-3 text-left">Use Case</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-3">Hourly</td>
                                    <td className="px-6 py-3">Generate posts every hour</td>
                                    <td className="px-6 py-3">News sites, trending topics</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3">Daily</td>
                                    <td className="px-6 py-3">Generate posts once per day</td>
                                    <td className="px-6 py-3">Blogs, general content sites</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Drip-Feed Limits</h4>
                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                        <li><strong>Max Posts Per Day:</strong> Set a daily limit (e.g., 5 posts per day)</li>
                        <li><strong>Time Spacing:</strong> Minimum time between posts (e.g., 2 hours)</li>
                        <li><strong>Publishing Hours:</strong> Define specific hours when posts can be published</li>
                    </ul>

                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg my-6">
                        <p className="text-green-900">
                            <strong>✓ Best Practice:</strong> Start with one campaign and monitor its performance before
                            creating multiple campaigns. This helps you fine-tune settings and avoid duplicate content.
                        </p>
                    </div>
                </section>

                <section id="license" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">License Management</h2>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">License Activation</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        The plugin uses a secure license management system to ensure you receive updates and support.
                    </p>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Activating Your License</h4>
                    <ol className="list-none space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <span className="text-gray-700 pt-1">Navigate to <strong>AI Generator → License</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <span className="text-gray-700 pt-1">Enter your license key (purchase code)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <span className="text-gray-700 pt-1">Click <strong>"Activate License"</strong></span>
                        </li>
                    </ol>

                    <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm mb-8">
                        <pre>{`License Key: XXXX-XXXX-XXXX-XXXX
Domain: example.com
Status: Active
Expires: Never (Lifetime License)
Last Verified: 2026-01-10 01:13:29`}</pre>
                    </div>
                </section>

                <section id="api" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">API Reference</h2>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Actions & Filters</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        The plugin is built with a modular architecture, making it easy to extend and customize.
                    </p>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Action Hooks</h4>
                    <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm mb-8 overflow-x-auto">
                        <pre>{`// Fired before content generation starts
do_action('wp_ai_generator_before_generate', $source_data, $campaign_id);

// Fired after content is generated
do_action('wp_ai_generator_after_generate', $post_id, $content_data);`}</pre>
                    </div>

                    <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Filter Hooks</h4>
                    <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm mb-8 overflow-x-auto">
                        <pre>{`// Modify generated content before publishing
apply_filters('wp_ai_generator_content', $content, $source_data);

// Modify AI prompt before sending to provider
apply_filters('wp_ai_generator_prompt', $prompt, $context);`}</pre>
                    </div>
                </section>

                <section id="troubleshooting" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Troubleshooting</h2>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Common Issues</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">1. API Connection Failures</h4>
                            <p className="text-gray-700 mb-2"><strong>Symptoms:</strong> "Connection failed" or "API error" messages when testing AI providers.</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Verify your API key is correct and active</li>
                                <li>Check that your server can make outbound HTTPS requests</li>
                                <li>Ensure your firewall isn't blocking API endpoints</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">2. Posts Not Being Generated</h4>
                            <p className="text-gray-700 mb-2"><strong>Symptoms:</strong> Campaigns are active but no posts are being created.</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Verify your license is active</li>
                                <li>Check that WordPress cron is working</li>
                                <li>Ensure content sources are returning items</li>
                            </ul>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Debug Mode</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Enable debug mode to get detailed logging information:
                    </p>
                    <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm mb-8 overflow-x-auto">
                        <pre>{`// Add to wp-config.php
define('WP_AI_GENERATOR_DEBUG_SYNC', true);`}</pre>
                    </div>
                </section>

                <section id="best-practices" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Best Practices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                            <h3 className="text-xl font-bold text-purple-700 mb-4">Content Quality</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Always review AI-generated content before publishing</li>
                                <li>Use specific, detailed prompts for better quality</li>
                                <li>Combine multiple content sources</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                            <h3 className="text-xl font-bold text-purple-700 mb-4">SEO Optimization</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Use keyword-rich titles and meta descriptions</li>
                                <li>Generate unique content for each post</li>
                                <li>Maintain a consistent publishing schedule</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="faq" className="mb-20">
                    <h2 className="text-4xl font-black text-purple-600 mb-6 pb-4 border-b-4 border-purple-600">Frequently Asked Questions</h2>
                    <div className="space-y-8 mt-8">
                        <div>
                            <h3 className="text-xl font-bold text-purple-700 mb-2">Do I need API keys for the AI providers?</h3>
                            <p className="text-gray-700">Yes, you need to obtain API keys from the AI providers you want to use. Each provider has their own pricing and terms of service.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-purple-700 mb-2">Can I use multiple AI providers simultaneously?</h3>
                            <p className="text-gray-700">Yes! You can configure multiple providers and choose which one to use for each campaign.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-purple-700 mb-2">Does it support multisite?</h3>
                            <p className="text-gray-700">Yes, the plugin is fully compatible with WordPress multisite installations.</p>
                        </div>
                    </div>
                </section>

                {/* Download CTA */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-12 text-center text-white shadow-2xl">
                    <h3 className="text-3xl font-black mb-4">Need More Details?</h3>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Download the complete PDF documentation for in-depth guides, code examples, and advanced configuration options.
                    </p>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-3 bg-white text-purple-700 font-bold py-4 px-8 rounded-2xl hover:bg-purple-50 transition-all text-lg shadow-xl hover:shadow-2xl"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Full Documentation (PDF)
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="font-bold text-lg mb-2">WordPress AI-Powered Automatic Content Generator & Auto Posting Plugin</p>
                    <p className="text-gray-400 mb-2">Version 1.0.0 | Developed by <a href="https://github.com/afigo" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Afigo Sam</a></p>
                    <p className="text-gray-400 mb-2">Documentation: <a href="https://afigo.sampidia.com/#/product/ai-content-generator" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">https://afigo.sampidia.com</a></p>
                    <p className="text-gray-400 mb-4">Support: Contact us through CodeCanyon</p>
                    <p className="text-sm text-gray-500 mt-6">
                        © 2026 All Rights Reserved | Licensed under GPL-2.0+
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AIDocumentationPage;
