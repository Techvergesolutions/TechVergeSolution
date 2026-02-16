import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";
import { Send, MapPin, Mail, Phone, CheckCircle, Loader2, Globe2 } from "lucide-react";

export const ContactSection = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const blockedDomains = ['test.com', 'example.com', 'abc.com', 'none.com'];
    const domain = formData.email.split('@')[1]?.toLowerCase();

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (blockedDomains.includes(domain)) {
      newErrors.email = "Please use a real email address (test domains are blocked)";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide a bit more detail (min. 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus('submitting');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: formData.name,
          reply_to: formData.email,
          company_name: formData.company,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: "", email: "", company: "", message: "" });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Failed to send');
      }
    } catch (error: any) {
      alert(error.message);
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Get Started</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Let's Build <span className="text-gradient">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your business with cutting-edge technology? Get in touch and let's discuss how we can help you scale.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <AnimatedSection delay={0.1}>
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-5 border border-border/50 bg-black/20 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-muted border ${errors.name ? 'border-red-500' : 'border-border'} focus:border-primary outline-none transition-all`}
                    placeholder="Name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-muted border ${errors.email ? 'border-red-500' : 'border-border'} focus:border-primary outline-none transition-all`}
                    placeholder="Email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none transition-all"
                  placeholder="Company Name (Optional)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Details</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg bg-muted border ${errors.message ? 'border-red-500' : 'border-border'} focus:border-primary outline-none transition-all resize-none`}
                  placeholder="Tell us about your project, goals, and timeline..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-2 bg-primary hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={status !== 'idle'}
              >
                {status === 'submitting' ? <Loader2 className="animate-spin" /> : status === 'success' ? <CheckCircle /> : <Send size={18} />}
                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              </motion.button>
            </form>
          </AnimatedSection>

          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Why Choose <span className="text-primary">Techverge Solution</span>?</h3>
              <ul className="space-y-4">
                {["Expert team with 5+ years of enterprise experience", "Proven track record with 200+ successful projects", "Dedicated support and maintenance packages", "Scalable solutions that grow with your business", "Transparent pricing with no hidden costs"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-6 border border-border/50 bg-black/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">Albuquerque, New Mexico, USA</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">info@techvergesolution.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">+1 (505) 523-1081</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe2 className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Availability</p>
                  <p className="text-sm font-medium">Serving Worldwide 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};