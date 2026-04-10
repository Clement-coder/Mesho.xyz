'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, ChevronLeft, User, Mail, Phone, BookOpen, FileText, Clock, GraduationCap } from 'lucide-react';

const researchTypes = [
  { id: 'undergraduate', label: 'Undergraduate Project', icon: GraduationCap },
  { id: 'postgraduate', label: 'Postgraduate Thesis', icon: GraduationCap },
  { id: 'journal', label: 'Journal Article', icon: FileText },
  { id: 'proposal', label: 'Research Proposal', icon: BookOpen },
  { id: 'full', label: 'Full Research Project', icon: FileText },
];

export default function HireResearcherPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', topic: '', deadline: '', researchType: '', details: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.department || !form.researchType) {
      setError('Please fill in all required fields and select a research type.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium" aria-label="Go back">
            <ChevronLeft size={18} aria-hidden="true" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hire a Researcher</h1>
          <p className="text-muted-foreground max-w-2xl">
            Need a qualified academic researcher to handle your full research project? Submit your requirements and we'll connect you with the right professional.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Info panel */}
          <div className="space-y-5">
            <div className="clay p-6">
              <h2 className="text-xl font-bold mb-5">What a Researcher Does</h2>
              <ul className="space-y-4">
                {[
                  { icon: BookOpen, title: 'Topic Selection & Proposal', desc: 'Helps define and develop your research topic and proposal' },
                  { icon: FileText, title: 'Literature Review', desc: 'Comprehensive review of existing academic literature' },
                  { icon: FileText, title: 'Data Collection', desc: 'Designs and administers questionnaires or collects secondary data' },
                  { icon: FileText, title: 'Full Write-up', desc: 'Writes all chapters from introduction to conclusion' },
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <s.icon size={15} className="text-accent" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="clay p-6">
              <h2 className="text-xl font-bold mb-4">How It Works</h2>
              <ol className="space-y-3 text-sm">
                {['Submit your project requirements', 'We review and match you with a researcher', 'Researcher contacts you to discuss scope', 'Work is delivered within agreed timeline'].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="clay p-10 text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
                <p className="text-muted-foreground mb-1">Thank you, <span className="font-semibold text-foreground">{form.name}</span>. Your researcher request has been received.</p>
                <p className="text-muted-foreground text-sm">We'll contact you at <span className="font-semibold text-foreground">{form.email}</span> to discuss your project.</p>
              </div>
            ) : (
              <div className="clay p-8">
                <h2 className="text-2xl font-bold mb-6">Submit Your Research Request</h2>
                {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Full Name <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input className="pl-9" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email Address <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input className="pl-9" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Phone Number <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input className="pl-9" placeholder="e.g. 08012345678" value={form.phone} onChange={e => set('phone', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Department <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input className="pl-9" placeholder="e.g. Accounting, Microbiology" value={form.department} onChange={e => set('department', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Research Topic (optional)</label>
                      <Input placeholder="Your proposed topic" value={form.topic} onChange={e => set('topic', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Deadline (optional)</label>
                      <div className="relative">
                        <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input className="pl-9" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Research Type <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {researchTypes.map(t => (
                        <label key={t.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors text-sm ${form.researchType === t.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}>
                          <input type="radio" name="researchType" value={t.id} checked={form.researchType === t.id} onChange={() => set('researchType', t.id)} className="accent-accent" />
                          <t.icon size={15} className="text-accent flex-shrink-0" aria-hidden="true" />
                          {t.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Additional Details (optional)</label>
                    <textarea rows={4} placeholder="Describe your research needs, scope, specific requirements..." value={form.details} onChange={e => set('details', e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none clay-inset"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" aria-label="Submit your researcher hiring request">
                    <User size={16} className="mr-2" aria-hidden="true" />
                    Submit Request
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
