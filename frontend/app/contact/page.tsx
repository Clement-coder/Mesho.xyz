'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField, IconInput, StyledTextarea } from '@/app/components/form-field';
import { MessageCircle, Mail, Phone, CheckCircle, User, FileText } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground max-w-xl">Have a question or need support? Reach out and we'll get back to you as soon as possible.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="space-y-6">
            <div className="clay p-6 space-y-5">
              <h2 className="text-xl font-bold">Get in Touch</h2>
              {[
                { icon: MessageCircle, label: 'WhatsApp', content: <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">Chat with us on WhatsApp</a> },
                { icon: Mail, label: 'Email', content: <a href="mailto:support@meshodatasciences.com" className="text-sm text-accent hover:underline">support@meshodatasciences.com</a> },
                { icon: Phone, label: 'Phone', content: <p className="text-sm text-muted-foreground">+234 801 234 5678</p> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-accent" aria-hidden="true" />
                  </div>
                  <div><p className="font-medium text-sm">{item.label}</p>{item.content}</div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp chat" className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-xl transition-colors font-medium text-sm">
              <MessageCircle size={18} aria-hidden="true" />Chat on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="clay p-10 text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground">Thank you, <span className="font-medium text-foreground">{form.name}</span>. We'll respond to <span className="font-medium text-foreground">{form.email}</span> shortly.</p>
              </div>
            ) : (
              <div className="clay p-8">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Full Name" required icon={User} error={errors.name} success={!errors.name && form.name.length > 1}>
                      <IconInput icon={User} placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} error={!!errors.name} autoComplete="name" aria-label="Enter your full name" />
                    </FormField>
                    <FormField label="Email Address" required icon={Mail} error={errors.email} success={!errors.email && /\S+@\S+\.\S+/.test(form.email)}>
                      <IconInput icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} error={!!errors.email} autoComplete="email" aria-label="Enter your email address" />
                    </FormField>
                  </div>
                  <FormField label="Subject" icon={FileText} hint="Optional — briefly describe your enquiry">
                    <IconInput icon={FileText} placeholder="What is this about?" value={form.subject} onChange={e => set('subject', e.target.value)} aria-label="Enter the subject of your message" />
                  </FormField>
                  <FormField label="Message" required icon={MessageCircle} error={errors.message} success={!errors.message && form.message.length >= 10}>
                    <StyledTextarea rows={5} placeholder="Write your message here..." value={form.message} onChange={e => set('message', e.target.value)} error={!!errors.message} aria-label="Write your message" />
                  </FormField>
                  <Button type="submit" size="lg" className="w-full">
                    <Mail size={16} className="mr-2" aria-hidden="true" />Send Message
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
