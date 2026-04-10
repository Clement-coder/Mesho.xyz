'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, GraduationCap, BookOpen, Users, Clock, Calendar, Wifi } from 'lucide-react';

const schedules = [
  { id: 'weekday-morning', label: 'Weekdays — Morning (8am–11am)', icon: Clock },
  { id: 'weekday-evening', label: 'Weekdays — Evening (5pm–8pm)', icon: Clock },
  { id: 'weekend-morning', label: 'Weekends — Morning (9am–12pm)', icon: Calendar },
  { id: 'weekend-afternoon', label: 'Weekends — Afternoon (1pm–4pm)', icon: Calendar },
  { id: 'flexible', label: 'Flexible / Online (Self-paced)', icon: Wifi },
];

const whoIsItFor = [
  { label: 'Undergraduate students', icon: GraduationCap },
  { label: 'Postgraduate students', icon: GraduationCap },
  { label: 'Academic researchers', icon: BookOpen },
  { label: 'Lecturers and supervisors', icon: Users },
  { label: 'Independent scholars', icon: BookOpen },
];

export default function TrainingPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', institution: '', schedule: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.schedule) {
      setError('Please fill in all required fields.');
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
            SPSS Data Analysis Training
          </h1>
          <p className="text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-top duration-500 delay-100">
            Structured training programs designed to equip you with practical skills in academic data analysis using SPSS — from data coding and entry to analysis, interpretation, and presentation of results.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* What You'll Learn */}
            <div className="lg:col-span-1 space-y-6">
              <div className="clay p-6">
                <h2 className="text-xl font-bold mb-6">What You'll Learn</h2>
                <ul className="space-y-4">
                  {[
                    'Data coding and entry in SPSS',
                    'Descriptive statistics and frequency tables',
                    'Hypothesis testing (t-test, ANOVA, chi-square)',
                    'Correlation and regression analysis',
                    'Interpretation of SPSS output',
                    'Presentation of results in academic format',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="clay p-6">
                <h2 className="text-xl font-bold mb-4">Who Is This For?</h2>
                <ul className="space-y-3">
                  {whoIsItFor.map((u, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <u.icon size={15} className="text-accent" aria-hidden="true" />
                      </div>
                      <span>{u.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="clay p-10 text-center animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Registration Received!</h2>
                  <p className="text-muted-foreground mb-2">
                    Thank you, <span className="font-medium text-foreground">{form.name}</span>. Your training registration has been submitted.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    We'll reach out to <span className="font-medium text-foreground">{form.email}</span> with session details and next steps shortly.
                  </p>
                </div>
              ) : (
                <div className="clay p-8 animate-in fade-in slide-in-from-bottom duration-500">
                  <h2 className="text-2xl font-bold mb-6">Register for Training</h2>

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

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Preferred Schedule <span className="text-destructive">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {schedules.map(s => (
                          <label
                            key={s.id}
                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors text-sm ${
                              form.schedule === s.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                            }`}
                          >
                            <input type="radio" name="schedule" value={s.id} checked={form.schedule === s.id} onChange={() => setForm({ ...form, schedule: s.id })} className="accent-accent" />
                            <s.icon size={15} className="text-accent flex-shrink-0" aria-hidden="true" />
                            {s.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Submit Registration
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
