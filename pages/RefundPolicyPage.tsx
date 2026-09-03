import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { EMAIL_MAIN, EMAIL_SUPPORT } from '../constants';

const RefundPolicyPage: React.FC = () => {
  const refundSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Refund & Cancellation Policy | Afigo-Sam Masterclasses',
    'description': 'Official Refund, Cancellation, and Exchange Policy for Afigo-Sam PDF Digital Masterclasses and 1-on-1 Mentorship Sessions.',
    'publisher': {
      '@type': 'Person',
      'name': 'Afigo Sam',
      'url': 'https://afigo.sampidia.com'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <SEO
        title="Refund & Cancellation Policy | Afigo-Sam Masterclasses"
        description="Official Refund, Cancellation, and Exchange Policy for Afigo-Sam PDF Digital Masterclasses and 1-on-1 Mentorship Sessions."
        keywords="refund policy, course cancellation, digital product refund, 1-on-1 coaching terms, afigo sam policy"
        jsonLd={refundSchema}
      />

      {/* Header Banner */}
      <section className="relative overflow-hidden py-16 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm">🛡️</span>
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Legal & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Transparent, fair guidelines for our digital PDF masterclasses and 1-on-1 live mentorship sessions.
          </p>
        </div>
      </section>

      {/* Policy Body */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-grow">
        <div className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span>📘</span> 1. PDF Digital Courses & Masterclasses
            </h2>
            <p className="mb-4 text-slate-400">
              Our PDF masterclasses are non-tangible, irrevocable digital goods delivered immediately upon payment verification via email and on-screen download link.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong>Instant Fulfillment:</strong> Once payment is confirmed by Flutterwave, full access to the PDF guide and resources is granted.</li>
              <li><strong>Defect / Access Resolution:</strong> If you do not receive your email attachment or encounter issues downloading your file, please contact us immediately at <a href={`mailto:${EMAIL_MAIN}`} className="text-red-400 font-semibold hover:underline">{EMAIL_MAIN}</a>. We guarantee replacement delivery within 12 hours.</li>
              <li><strong>General Refund Terms:</strong> Due to the digital nature of PDF files, sales are final once downloaded or dispatched. However, if a duplicate transaction occurs, a full refund for the extra charge will be processed immediately upon request.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span>🤝</span> 2. 1-on-1 Live Mentorship Sessions
            </h2>
            <p className="mb-4 text-slate-400">
              Our 1-on-1 mentorship includes direct, live 30-minute video sessions (Google Meet or CalVideo) and customized guidance scheduled via Cal.com.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong>Rescheduling Policy:</strong> You may reschedule your 1-on-1 mentorship session free of charge up to <strong>12 hours before</strong> the scheduled meeting time directly from your Student Portal or session confirmation link.</li>
              <li><strong>Cancellation Policy:</strong> You may cancel your scheduled session up to <strong>24 hours before</strong> the meeting time. Cancellations made more than 24 hours in advance are eligible for session re-booking or a full refund.</li>
              <li><strong>Time Locks & Notice Windows:</strong> Cancellations are locked less than 24 hours prior to the session, and rescheduling is locked less than 12 hours prior to the session to preserve reserved instructor availability.</li>
              <li><strong>Refund Request Submission:</strong> If you cancel your session in advance (more than 24 hours before meeting time) or experience an issue, you can request a payout refund directly inside your Student Portal. Refunds are processed to your bank or mobile money account within 3–5 business days.</li>
              <li><strong>Instructor Rescheduling Guarantee:</strong> In the rare event that the instructor must reschedule, you will be offered an immediate choice between an alternative priority time slot or a 100% full refund.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span>💳</span> 3. Payment Disputes & Processing
            </h2>
            <p className="text-slate-400">
              All transactions are securely processed via Flutterwave. Approved refunds for duplicate transactions will be returned to the original payment source within 3–7 business days depending on your bank network.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>📩</span> Contact Support
            </h2>
            <p className="text-slate-400 mb-4 text-sm">
              If you have any questions regarding your purchase, access links, or session scheduling, please reach out to our dedicated support team:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 font-semibold text-sm">
              <a href={`mailto:${EMAIL_MAIN}`} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 w-fit">
                <span>📧</span> {EMAIL_MAIN}
              </a>
              <a href={`mailto:${EMAIL_SUPPORT}`} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 w-fit">
                <span>💬</span> {EMAIL_SUPPORT}
              </a>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link to="/courses" className="text-red-400 hover:text-red-300 font-bold transition-colors">
              ← Back to Course Catalog
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RefundPolicyPage;
