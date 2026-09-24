import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '@/hooks/use-page-title';

const PrivacyPolicy = () => {
  usePageTitle('Privacy Policy | Techverge Solution');

  const policies = [
    { title: "1. Information Collection", text: "We collect personal data such as names, email addresses, and phone numbers when voluntarily submitted through contact forms." },
    { title: "2. Automatic Data Collection", text: "Our servers automatically record log data, including IP addresses, browser types, and pages visited." },
    { title: "3. Cookie Usage", text: "We use cookies and similar tracking technologies to track activity on our Service and hold certain information." },
    { title: "4. Purpose of Processing", text: "Data is used to provide services, process transactions, and communicate about project milestones." },
    { title: "5. Marketing Communications", text: "We may use your data to send newsletters; you can opt-out at any time." },
    { title: "6. Data Retention", text: "We retain personal information only for as long as necessary to fulfill the purposes outlined." },
    { title: "7. Third-Party Sharing", text: "We do not sell your data. We only share info with trusted partners who assist in operating our site." },
    { title: "8. Data Security", text: "We implement industry-standard encryption and security protocols to protect your info." },
    { title: "9. International Transfers", text: "Your information may be transferred to computers located outside of your state or country." },
    { title: "10. Children's Privacy", text: "Our services are not intended for anyone under 13. We do not knowingly collect data from children." },
    { title: "11. User Access Rights", text: "You have the right to request a copy of the personal data we hold about you." },
    { title: "12. Right to Rectification", text: "You can request that we correct any information you believe is inaccurate." },
    { title: "13. Right to Erasure", text: "Under certain conditions, you have the right to request that we erase your personal data." },
    { title: "14. Data Portability", text: "Users have the right to request the transfer of their data to another organization." },
    { title: "15. Consent Withdrawal", text: "You may withdraw your consent for data processing at any time by contacting us." },
    { title: "16. Service Providers", text: "We employ third-party companies to facilitate our Service (e.g., hosting, analytics)." },
    { title: "17. External Links", text: "Our site may contain links to other sites. We are not responsible for their privacy practices." },
    { title: "18. GDPR Compliance", text: "For EU residents, we comply with the General Data Protection Regulation." },
    { title: "19. CCPA Rights", text: "California residents have specific rights regarding personal information access." },
    { title: "20. Policy Updates", text: "We reserve the right to update our Privacy Policy. Changes will be posted on this page." },
    { title: "21. Contact Information", text: "For questions regarding privacy, contact us at TechVergesoltions@gmail.com." }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-6 relative">
       <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-bold mb-8">
            <ArrowLeft size={20} /> Return to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-muted-foreground">Effective Date: January 1, 2026</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all"
            >
              <Eye className="text-primary mb-4 w-5 h-5" />
              <h3 className="text-lg font-bold mb-2 text-white/90">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;