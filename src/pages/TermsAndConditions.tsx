import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const terms = [
    { h: "1. Agreement to Terms", p: "By accessing our website or using our services, you agree to be bound by these Terms and Conditions." },
    { h: "2. Intellectual Property", p: "Unless otherwise stated, Techverge Solution owns the intellectual property rights for all material on the website until full payment for a project is received." },
    { h: "3. Project Delivery", p: "Timelines provided are estimates. We strive to meet deadlines but are not liable for delays caused by third-party services or client feedback cycles." },
    { h: "4. Payment Terms", p: "Deposits are non-refundable once work has commenced. Final files/access are released only upon settlement of the full invoice." },
    { h: "5. Client Obligations", p: "Clients must provide necessary assets (images, text, access) in a timely manner to avoid project stagnation." },
    { h: "6. Limitation of Liability", p: "Techverge Solution shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of our services." },
    { h: "7. Indemnification", p: "You hereby indemnify Techverge Solution from and against any and all liabilities, costs, demands, causes of action, damages, and expenses." },
    { h: "8. Governing Law", p: "These terms are governed by and interpreted in accordance with the laws of the State of New Mexico, USA." }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:gap-3 transition-all font-bold mb-8">
            <ArrowLeft size={20} /> Return to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
            Terms & <span className="text-gradient">Conditions</span>
          </h1>
          <p className="text-muted-foreground">Last Modified: January 2026 • Legal Agreement</p>
        </motion.div>

        <div className="space-y-12">
          {terms.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl border border-white/5 hover:border-secondary/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-secondary mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h2 className="text-xl font-bold mb-3">{t.h}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t.p}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;