'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

const services = [
  { id: 'cleaning', label: 'Data Cleaning & Preparation' },
  { id: 'analysis', label: 'Statistical Analysis (SPSS)' },
  { id: 'interpretation', label: 'Interpretation of Results' },
  { id: 'report', label: 'Report Writing Support' },
  { id: 'full', label: 'Full Project Data Analysis' },
];

export default function HirePage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', institution: '',
    department: '', topic: '', deadline: '', selectedServices: [] as string[], details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleService = (id: string) => {
    setForm(f => ({
      ...f,
      selectedServices: f.selectedServices.includes(id)
        ? f.selectedServices.filter(s => s !== id)
        : [...f.selectedServices, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.department || form.selectedServices.length === 0) {
      setError('Please fill in all required fields and select at least one service.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-in fade-in slide-in-from-top duration-500">
            Hire an Academic Data Analyst
          </h1>
          <p className="text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-top duration-500 delay-100">
            Submit your project details and requirements. Our qualified academic data analysts will handle your data cleaning, statistical analysis, interpretation, and report writing using SPSS.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Services Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Services Available</h2>
                <ul className="space-y-4">
                  {[
                    { icon: '🧹', title: 'Data Cleaning & Preparation', desc: 'Organise and clean your raw data for analysis' },
                    { icon: '📊', title: 'Statistical Analysis', desc: 'Run tests and analysis using SPSS' },
                    { icon: '📝', title: 'Interpretation of Results', desc: 'Clear explanation of your statistical output' },
                    { icon: '📄', title: 'Report Writing Support', desc: 'Professionally written chapter 4 & 5' },
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-lg">{s.icon}</span>
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-muted-foreground">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">How It Works</h2>
                <ol className="space-y-3 text-sm">
                  {[
                    'Submit your project details below',
                    'We review your requirements',
                    'An analyst is assigned to your project',
                    'Work is delivered within agreed timeline',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Hire Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-card border border-border rounded-xl p-10 text-center animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
                  <p className="text-muted-foreground mb-2">
                    Thank you, <span className="font-medium text-foreground">{form.name}</span>. Your analyst hiring request has been received.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    We'll contact you at <span className="font-medium text-foreground">{form.email}</span> to discuss your project and next steps.
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-8 animate-in fade-in slide-in-from-bottom duration-500">
                  <h2 className="text-2xl font-bold mb-6">Submit Your Project Details</h2>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Full Name <span className="text-destructive">*</span></label>
                        <Input placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email Address <span className="text-destructive">*</span></label>
                        <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone Number <span className="text-destructive">*</span></label>
                        <Input placeholder="e.g. 08012345678" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Institution (optional)</label>
                        <Input placeholder="Your university or organisation" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Department <span className="text-destructive">*</span></label>
                        <Input placeholder="e.g. Accounting, Microbiology" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Project Topic (optional)</label>
                        <Input placeholder="Your research topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Deadline (optional)</label>
                      <Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Services Required <span className="text-destructive">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {services.map(s => (
                          <label
                            key={s.id}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
                              form.selectedServices.includes(s.id) ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={form.selectedServices.includes(s.id)}
                              onChange={() => toggleService(s.id)}
                              className="accent-accent"
                            />
                            {s.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Additional Details (optional)</label>
                      <textarea
                        rows={4}
                        placeholder="Describe your project, data type, specific requirements, or any other relevant information..."
                        value={form.details}
                        onChange={e => setForm({ ...form, details: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Submit Request
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
