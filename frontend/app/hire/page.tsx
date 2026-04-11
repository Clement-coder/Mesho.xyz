'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle, ChevronLeft, User, Mail, Phone, BookOpen,
  FileText, Clock, GraduationCap, UserCheck, Eraser,
  BarChart3, FileSearch, Database,
} from 'lucide-react';

const analystServices = [
  { id: 'cleaning', label: 'Data Cleaning & Preparation', icon: Eraser },
  { id: 'analysis', label: 'Statistical Analysis (SPSS)', icon: BarChart3 },
  { id: 'interpretation', label: 'Interpretation of Results', icon: FileSearch },
  { id: 'report', label: 'Report Writing Support', icon: FileText },
  { id: 'full', label: 'Full Project Data Analysis', icon: Database },
];

const analystServiceDetails = [
  { icon: Eraser, title: 'Data Cleaning & Preparation', desc: 'Organise and clean your raw data for analysis' },
  { icon: BarChart3, title: 'Statistical Analysis', desc: 'Run tests and analysis using SPSS' },
  { icon: FileSearch, title: 'Interpretation of Results', desc: 'Clear explanation of your statistical output' },
  { icon: FileText, title: 'Report Writing Support', desc: 'Professionally written chapter 4 & 5' },
];

const researchTypes = [
  { id: 'undergraduate', label: 'Undergraduate Project', icon: GraduationCap },
  { id: 'postgraduate', label: 'Postgraduate Thesis', icon: GraduationCap },
  { id: 'journal', label: 'Journal Article', icon: FileText },
  { id: 'proposal', label: 'Research Proposal', icon: BookOpen },
  { id: 'full', label: 'Full Research Project', icon: FileText },
];

const researcherDetails = [
  { icon: BookOpen, title: 'Topic Selection & Proposal', desc: 'Helps define and develop your research topic' },
  { icon: FileText, title: 'Literature Review', desc: 'Comprehensive review of existing academic literature' },
  { icon: FileText, title: 'Data Collection', desc: 'Designs questionnaires or collects secondary data' },
  { icon: FileText, title: 'Full Write-up', desc: 'Writes all chapters from introduction to conclusion' },
];

function HirePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'researcher' ? 'researcher' : 'analyst';
  const [activeTab, setActiveTab] = useState<'analyst' | 'researcher'>(initialTab as any);

  const [analystForm, setAnalystForm] = useState({ name: '', email: '', phone: '', institution: '', department: '', topic: '', deadline: '', selectedServices: [] as string[], details: '' });
  const [researcherForm, setResearcherForm] = useState({ name: '', email: '', phone: '', department: '', topic: '', deadline: '', researchType: '', details: '' });
  const [analystSubmitted, setAnalystSubmitted] = useState(false);
  const [researcherSubmitted, setResearcherSubmitted] = useState(false);
  const [error, setError] = useState('');

  const setA = (k: string, v: string) => setAnalystForm(f => ({ ...f, [k]: v }));
  const setR = (k: string, v: string) => setResearcherForm(f => ({ ...f, [k]: v }));

  const toggleService = (id: string) => setAnalystForm(f => ({
    ...f,
    selectedServices: f.selectedServices.includes(id)
      ? f.selectedServices.filter(s => s !== id)
      : [...f.selectedServices, id],
  }));

  const handleAnalystSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analystForm.name || !analystForm.email || !analystForm.phone || !analystForm.department || analystForm.selectedServices.length === 0) {
      setError('Please fill in all required fields and select at least one service.'); return;
    }
    setError(''); setAnalystSubmitted(true);
  };

  const handleResearcherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!researcherForm.name || !researcherForm.email || !researcherForm.phone || !researcherForm.department || !researcherForm.researchType) {
      setError('Please fill in all required fields and select a research type.'); return;
    }
    setError(''); setResearcherSubmitted(true);
  };

  const SuccessCard = ({ name, email }: { name: string; email: string }) => (
    <div className="clay p-10 text-center animate-in zoom-in duration-500">
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-accent" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
      <p className="text-muted-foreground mb-1">Thank you, <span className="font-semibold text-foreground">{name}</span>. Your request has been received.</p>
      <p className="text-muted-foreground text-sm">We'll contact you at <span className="font-semibold text-foreground">{email}</span> shortly.</p>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft size={18} aria-hidden="true" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hire Academic Support</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">Choose whether you need a data analyst for SPSS analysis or a researcher for your full project.</p>

          {/* Tab Toggle */}
          <div className="clay p-1 flex gap-1 mt-6 w-fit">
            <button
              onClick={() => { setActiveTab('analyst'); setError(''); }}
              aria-label="Hire a Data Analyst — SPSS analysis and data services"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'analyst' ? 'bg-accent text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              <BarChart3 size={16} aria-hidden="true" />
              Hire a Data Analyst
            </button>
            <button
              onClick={() => { setActiveTab('researcher'); setError(''); }}
              aria-label="Hire a Researcher — full academic research project support"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'researcher' ? 'bg-accent text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              <UserCheck size={16} aria-hidden="true" />
              Hire a Researcher
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Info panel */}
          <div className="space-y-5">
            <div className="clay p-6">
              <h2 className="text-xl font-bold mb-5">{activeTab === 'analyst' ? 'Services Available' : 'What a Researcher Does'}</h2>
              <ul className="space-y-4">
                {(activeTab === 'analyst' ? analystServiceDetails : researcherDetails).map((s, i) => (
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
                {['Submit your project details below', 'We review your requirements', activeTab === 'analyst' ? 'An analyst is assigned to your project' : 'A researcher is matched to your project', 'Work is delivered within agreed timeline'].map((step, i) => (
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
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4">{error}</div>}

            {/* Data Analyst Form */}
            {activeTab === 'analyst' && (
              analystSubmitted ? <SuccessCard name={analystForm.name} email={analystForm.email} /> : (
                <div className="clay p-8">
                  <h2 className="text-2xl font-bold mb-6">Submit Your Project Details</h2>
                  <form onSubmit={handleAnalystSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Full Name <span className="text-destructive">*</span></label>
                        <Input placeholder="Your full name" value={analystForm.name} onChange={e => setA('name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email Address <span className="text-destructive">*</span></label>
                        <Input type="email" placeholder="your@email.com" value={analystForm.email} onChange={e => setA('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone Number <span className="text-destructive">*</span></label>
                        <Input placeholder="e.g. 08012345678" value={analystForm.phone} onChange={e => setA('phone', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Institution (optional)</label>
                        <Input placeholder="Your university or organisation" value={analystForm.institution} onChange={e => setA('institution', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Department <span className="text-destructive">*</span></label>
                        <Input placeholder="e.g. Accounting, Microbiology" value={analystForm.department} onChange={e => setA('department', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Project Topic (optional)</label>
                        <Input placeholder="Your research topic" value={analystForm.topic} onChange={e => setA('topic', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Deadline (optional)</label>
                      <Input type="date" value={analystForm.deadline} onChange={e => setA('deadline', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Services Required <span className="text-destructive">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analystServices.map(s => (
                          <label key={s.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors text-sm ${analystForm.selectedServices.includes(s.id) ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}>
                            <input type="checkbox" checked={analystForm.selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} className="accent-accent" />
                            <s.icon size={15} className="text-accent flex-shrink-0" aria-hidden="true" />
                            {s.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Additional Details (optional)</label>
                      <textarea rows={4} placeholder="Describe your project, data type, specific requirements..." value={analystForm.details} onChange={e => setA('details', e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none clay-inset"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      <BarChart3 size={16} className="mr-2" aria-hidden="true" />
                      Submit Request
                    </Button>
                  </form>
                </div>
              )
            )}

            {/* Researcher Form */}
            {activeTab === 'researcher' && (
              researcherSubmitted ? <SuccessCard name={researcherForm.name} email={researcherForm.email} /> : (
                <div className="clay p-8">
                  <h2 className="text-2xl font-bold mb-6">Submit Your Research Request</h2>
                  <form onSubmit={handleResearcherSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Full Name <span className="text-destructive">*</span></label>
                        <Input placeholder="Your full name" value={researcherForm.name} onChange={e => setR('name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email Address <span className="text-destructive">*</span></label>
                        <Input type="email" placeholder="your@email.com" value={researcherForm.email} onChange={e => setR('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone Number <span className="text-destructive">*</span></label>
                        <Input placeholder="e.g. 08012345678" value={researcherForm.phone} onChange={e => setR('phone', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Department <span className="text-destructive">*</span></label>
                        <Input placeholder="e.g. Accounting, Microbiology" value={researcherForm.department} onChange={e => setR('department', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Research Topic (optional)</label>
                        <Input placeholder="Your proposed topic" value={researcherForm.topic} onChange={e => setR('topic', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Deadline (optional)</label>
                        <Input type="date" value={researcherForm.deadline} onChange={e => setR('deadline', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Research Type <span className="text-destructive">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {researchTypes.map(t => (
                          <label key={t.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors text-sm ${researcherForm.researchType === t.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}>
                            <input type="radio" name="researchType" value={t.id} checked={researcherForm.researchType === t.id} onChange={() => setR('researchType', t.id)} className="accent-accent" />
                            <t.icon size={15} className="text-accent flex-shrink-0" aria-hidden="true" />
                            {t.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Additional Details (optional)</label>
                      <textarea rows={4} placeholder="Describe your research needs, scope, specific requirements..." value={researcherForm.details} onChange={e => setR('details', e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none clay-inset"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      <UserCheck size={16} className="mr-2" aria-hidden="true" />
                      Submit Request
                    </Button>
                  </form>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HirePage() {
  return (
    <Suspense>
      <HirePageContent />
    </Suspense>
  );
}
