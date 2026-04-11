'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormField, IconInput } from '@/app/components/form-field';
import { CheckCircle, GraduationCap, BookOpen, Users, Clock, Calendar, Wifi, ChevronLeft, User, Mail, Phone, Building } from 'lucide-react';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid phone number';
    if (!form.schedule) errs.schedule = 'Please select a preferred schedule';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium" aria-label="Go back">
            <ChevronLeft size={18} aria-hidden="true" /> Back
          </button>
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

                  {errors.schedule && !Object.keys(errors).filter(k => k !== 'schedule').length && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4">{errors.schedule}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Full Name" required icon={User} error={errors.name} success={!errors.name && form.name.length > 1}>
                        <IconInput icon={User} placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} error={!!errors.name} autoComplete="name" aria-label="Enter your full name" />
                      </FormField>
                      <FormField label="Email Address" required icon={Mail} error={errors.email} success={!errors.email && /\S+@\S+\.\S+/.test(form.email)}>
                        <IconInput icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} error={!!errors.email} autoComplete="email" aria-label="Enter your email address" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Phone Number" required icon={Phone} error={errors.phone} success={!errors.phone && form.phone.length >= 7}>
                        <IconInput icon={Phone} placeholder="e.g. 08012345678" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} error={!!errors.phone} autoComplete="tel" aria-label="Enter your phone number" />
                      </FormField>
                      <FormField label="Institution" icon={Building} hint="Optional — your university or organisation">
                        <IconInput icon={Building} placeholder="Your university or organisation" value={form.institution} onChange={e => set('institution', e.target.value)} aria-label="Enter your institution name" />
                      </FormField>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <Clock size={14} className="text-muted-foreground" aria-hidden="true" />
                        Preferred Schedule <span className="text-destructive">*</span>
                      </label>
                      {errors.schedule && <p className="text-xs text-destructive mb-2 flex items-center gap-1">Please select a schedule</p>}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {schedules.map(s => (
                          <label key={s.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors text-sm ${form.schedule === s.id ? 'border-accent bg-accent/5' : errors.schedule ? 'border-destructive/50' : 'border-border hover:border-accent/50'}`}>
                            <input type="radio" name="schedule" value={s.id} checked={form.schedule === s.id} onChange={() => set('schedule', s.id)} className="accent-accent" />
                            <s.icon size={15} className="text-accent flex-shrink-0" aria-hidden="true" />
                            {s.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">Submit Registration</Button>
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
