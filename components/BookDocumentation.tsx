import React, { useState } from 'react';

interface BookDocumentationProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookDocumentation: React.FC<BookDocumentationProps> = ({ isOpen, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const pages = [
        {
            title: "Cover",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-[#1a1c2c] to-[#4a192c] text-white rounded-r-lg shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 mb-6 mx-auto bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                            <img src="/assets/license-manager.png" alt="Logo" className="w-16 h-16 object-contain" />
                        </div>
                        <h1 className="text-3xl font-black mb-4 tracking-tight">MY LICENSES<br />MANAGER</h1>
                        <p className="text-red-400 mb-8 font-serif italic">Documentation & Guide</p>
                        <div className="w-16 h-1 bg-red-600 mx-auto mb-8"></div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Official Release v1.0</p>
                    </div>
                </div>
            )
        },
        {
            title: "1. Overview",
            content: (
                <div className="p-6 h-full bg-[#fdfcf0] text-gray-800 font-serif relative">
                    <div className="absolute top-0 right-0 p-4 text-[10px] text-gray-300 font-sans">PAGE 01</div>
                    <h2 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-red-100 pb-2">1. Overview</h2>
                    <p className="mb-4 leading-relaxed text-sm">
                        Welcome to the official documentation for <strong>My Licenses Manager (MLM)</strong>. This plugin serves as your central "license server," allowing you to remotely manage digital product licenses, track usage, and automate license creation.
                    </p>
                    <h3 className="font-bold text-base mb-3 mt-6 text-red-900 uppercase tracking-wider text-xs">Table of Contents</h3>
                    <ul className="space-y-1 text-sm">
                        {[
                            { n: '1', t: 'Overview', p: '01' },
                            { n: '2', t: 'Installation', p: '02' },
                            { n: '3', t: 'Core Features', p: '03' },
                            { n: '4', t: 'Integrations', p: '05' },
                            { n: '5', t: 'API Guide', p: '06' },
                            { n: '6', t: 'Analytics', p: '07' },
                            { n: '7', t: 'FAQ', p: '08' }
                        ].map(item => (
                            <li key={item.n} className="flex justify-between border-b border-gray-100 pb-0.5 group cursor-pointer hover:text-red-600 transition-colors">
                                <span className="text-xs">{item.n}. {item.t}</span>
                                <span className="text-gray-400 font-sans text-xs">{item.p}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            title: "2. Installation",
            content: (
                <div className="p-6 h-full bg-[#fdfcf0] text-gray-800 font-serif relative">
                    <div className="absolute top-0 right-0 p-4 text-[10px] text-gray-300 font-sans">PAGE 02</div>
                    <h2 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-red-100 pb-2">2. Installation</h2>
                    <div className="space-y-6 text-xs leading-relaxed">
                        {[
                            { s: 'Upload', d: 'Navigate to Plugins &gt; Add New, and upload the my-licenses-manager.zip file.' },
                            { s: 'Activate', d: 'Click Activate Plugin once the upload is finished.' },
                            { s: 'Database', d: 'The plugin automatically structures the necessary tables upon activation.' },
                            { s: 'Maintenance', d: 'Daily background tasks are scheduled for license cleanup.' }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1 shadow-md font-sans">{i + 1}</span>
                                <p><span className="font-bold text-gray-900">{step.s}:</span> {step.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: "3. Core Features",
            content: (
                <div className="p-6 h-full bg-[#fdfcf0] text-gray-800 font-serif relative">
                    <div className="absolute top-0 right-0 p-4 text-[10px] text-gray-300 font-sans">PAGE 03</div>
                    <h2 className="text-base font-black text-gray-900 mb-3 border-b-2 border-red-100 pb-1">3. Core Features</h2>
                    <h3 className="font-bold text-base mb-2 text-red-900">License Management</h3>
                    <p className="text-[9px] mb-3 uppercase tracking-widest text-gray-400 font-sans">Dashboard &gt; Manage Licenses</p>
                    <ul className="list-disc pl-5 space-y-2 text-xs">
                        <li><strong>Global List:</strong> Monitor status (Active, Pending, Expired, Blocked).</li>
                        <li><strong>Remote Controls:</strong> Manually create, edit, or revoke keys.</li>
                        <li><strong>Domain Shield:</strong> Hard-limit activations per license.</li>
                    </ul>
                    <h3 className="font-bold text-base mb-2 mt-6 text-red-900">Configuration Types</h3>
                    <p className="text-xs leading-relaxed">
                        Create reusable templates for different products. Assign "Types" to pre-fill secret keys, license prefixes, and expiry rules instantly.
                    </p>
                </div>
            )
        },
        {
            title: "4. API Guide",
            content: (
                <div className="p-6 h-full bg-[#fdfcf0] text-gray-800 font-serif relative">
                    <div className="absolute top-0 right-0 p-4 text-[10px] text-gray-300 font-sans">PAGE 04</div>
                    <h2 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-red-100 pb-2">4. API Integration</h2>
                    <div className="bg-gray-900 rounded-xl p-4 mb-4 font-mono text-[10px] text-emerald-400 shadow-inner">
                        <p className="mb-2 text-gray-500">// Check License Status</p>
                        <p>POST /api/check_license</p>
                        <p>{'{'}</p>
                        <p className="pl-4">"license_key": "PRO-123",</p>
                        <p className="pl-4">"secret": "your_secret"</p>
                        <p>{'}'}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">
                        Our REST API allows your software to communicate with the license server securely. All requests require your Product Secret Key for authentication.
                    </p>
                </div>
            )
        },
        {
            title: "5. FAQ",
            content: (
                <div className="p-6 h-full bg-[#fdfcf0] text-gray-800 font-serif relative">
                    <div className="absolute top-0 right-0 p-4 text-[10px] text-gray-300 font-sans">PAGE 05</div>
                    <h2 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-red-100 pb-2">5. FAQ & Extras</h2>
                    <div className="space-y-5 text-xs">
                        <div>
                            <p className="font-bold text-red-900 mb-1">Q: Multiple domains?</p>
                            <p className="text-gray-600 leading-relaxed">A: Yes, set limits from 1 to unlimited per key.</p>
                        </div>
                        <div>
                            <p className="font-bold text-red-900 mb-1">Q: Non-WordPress apps?</p>
                            <p className="text-gray-600 leading-relaxed">A: Absolutely. Works with any application making HTTP requests.</p>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-red-50 flex flex-col items-center">
                        <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em]">End of Documentation</p>
                        <p className="text-xs text-gray-500 text-center italic">Use the download button at the top to save a PDF copy for offline use.</p>
                    </div>
                </div>
            )
        },
    ];

    if (!isOpen) return null;

    const flipPage = (direction: 'next' | 'prev') => {
        if (isFlipping) return;

        if (direction === 'next' && currentPage < pages.length - 1) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev + 1);
                setIsFlipping(false);
            }, 600);
        } else if (direction === 'prev' && currentPage > 0) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev - 1);
                setIsFlipping(false);
            }, 600);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="relative w-full max-w-2xl flex flex-col items-center">

                {/* Navigation Info */}
                <div className="absolute -top-11 inset-x-0 flex justify-between items-center px-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none">
                            MLM Manual — Vol. 01
                        </div>
                        <a
                            href="/assets/lmy licenses manager documentation.pdf"
                            download
                            className="group hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/20 text-white/80 px-4 py-1.5 rounded-full border border-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </a>
                    </div>
                    <button
                        onClick={onClose}
                        className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full transition-all shadow-xl shadow-red-900/40"
                    >
                        <span className="text-xs font-black uppercase tracking-widest">Exit Reader</span>
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* The Book Scene */}
                <div className="relative w-full aspect-[16/10] perspective-[2000px] flex items-center justify-center select-none">

                    <div className="relative w-full h-full flex shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-2xl md:overflow-visible">

                        {/* Left Static Page / Page Under the Flip */}
                        <div className={`hidden md:block w-1/2 h-full bg-[#fdfcf0] border-r-2 border-gray-200 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.05)] origin-right z-0`}>
                            {currentPage > 0 ? (
                                <div className="h-full opacity-40 grayscale-[0.5]">
                                    {pages[currentPage - 1].content}
                                </div>
                            ) : (
                                <div className="h-full bg-gray-900 flex flex-col items-center justify-center p-12 text-center text-white/20 overflow-hidden relative">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
                                    <div className="relative z-10">
                                        <div className="mb-8 p-6 border-2 border-white/5 rounded-3xl inline-block">
                                            <img src="/assets/license-manager.png" alt="" className="w-20 h-20 opacity-5 grayscale invert" />
                                        </div>
                                        <div className="w-40 h-1 bg-white/5 rounded-full mb-4 mx-auto"></div>
                                        <div className="w-24 h-1 bg-white/5 rounded-full mx-auto"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Active Page / The Flipping Surface */}
                        <div className={`w-full md:w-1/2 h-full bg-[#fdfcf0] shadow-[inset_20px_0_50px_rgba(0,0,0,0.05)] transition-all duration-700 ease-in-out origin-left z-10 ${isFlipping ? '[transform:rotateY(-180deg)] opacity-0' : '[transform:rotateY(0deg)]'}`}>
                            {pages[currentPage].content}

                            {/* Shadow on the crease */}
                            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/5 to-transparent"></div>
                        </div>

                        {/* The page revealed during flip */}
                        {isFlipping && currentPage < pages.length - 1 && (
                            <div className="absolute right-0 top-0 w-1/2 h-full bg-[#fdfcf0] z-[-1]">
                                {pages[currentPage + 1].content}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <button
                        onClick={() => flipPage('prev')}
                        disabled={currentPage === 0 || isFlipping}
                        className="absolute -left-12 lg:-left-20 top-1/2 -translate-y-1/2 w-12 lg:w-16 h-12 lg:h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-red-600 transition-all flex items-center justify-center backdrop-blur-md border border-white/20 disabled:opacity-0 group shadow-2xl z-[100]"
                    >
                        <svg className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => flipPage('next')}
                        disabled={currentPage === pages.length - 1 || isFlipping}
                        className="absolute -right-12 lg:-right-20 top-1/2 -translate-y-1/2 w-12 lg:w-16 h-12 lg:h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-red-600 transition-all flex items-center justify-center backdrop-blur-md border border-white/20 disabled:opacity-0 group shadow-2xl z-[100]"
                    >
                        <svg className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Desktop instructions */}
                <div className="hidden md:flex mt-3 items-center gap-12 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
                    <button
                        onClick={() => flipPage('prev')}
                        disabled={currentPage === 0 || isFlipping}
                        className="flex items-center gap-3 hover:text-white transition-colors disabled:opacity-0"
                    >
                        <span className="w-5 h-5 rounded border border-white/20 flex items-center justify-center">←</span>
                        PREVIOUS PAGE
                    </button>
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                    <button
                        onClick={() => flipPage('next')}
                        disabled={currentPage === pages.length - 1 || isFlipping}
                        className="flex items-center gap-3 hover:text-white transition-colors disabled:opacity-0"
                    >
                        NEXT PAGE
                        <span className="w-5 h-5 rounded border border-white/20 flex items-center justify-center">→</span>
                    </button>
                </div>

                {/* Mobile Flip Button */}
                <div className="mt-4 md:hidden flex flex-col gap-4 w-full px-4">
                    <button
                        onClick={() => flipPage('next')}
                        disabled={currentPage === pages.length - 1 || isFlipping}
                        className="bg-red-600 text-white w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                        <span>Flip Page</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <a
                        href="/assets/lmy licenses manager documentation.pdf"
                        download
                        className="bg-white/10 text-white w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl border border-white/20 flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BookDocumentation;
