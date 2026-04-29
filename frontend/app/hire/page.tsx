'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, User, Mail, Phone, BookOpen, FileText, Clock, GraduationCap, UserCheck, Eraser, BarChart3, FileSearch, Database, Building } from 'lucide-react';
import { FormField, IconInput, StyledTextarea } from '@/app/components/form-field';
import { DisabledPhoneInput } from '@/app/components/phone-display';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { useAuth } from '@/lib/auth-context';
import { validatePhoneNumber } from '@/lib/phone-utils';

const analystServices = [
  { id: 'cleaning', label: 'Data Cleaning & Preparation', icon: Eraser },
  { id: 'analysis', label: 'Statistical Analysis (SPSS)', icon: BarChart3 },
  { id: 'interpretation', label: 'Interpretation of Results', icon: FileSearch },
  { id: 'report', label: 'Report Writing Support', icon: FileText },
  { id: 'full', label: 'Full Project Data Analysis', icon: Database },
];

const researchTypes = [
  { id: 'undergraduate', label: 'Undergraduate Project', icon: GraduationCap },
  { id: 'postgraduate', label: 'Postgraduate Thesis', icon: GraduationCap },
  { id: 'journal', label: 'Journal Article', icon: FileText },
  { id: 'proposal', label: 'Research Proposal', icon: BookOpen },
  { id: 'full', label: 'Full Research Project', icon: FileText },
];

const analystServiceDetails = [
  { icon: Eraser, title: 'Data Cleaning & Preparation', desc: 'Organise and clean your raw data for analysis' },
  { icon: BarChart3, title: 'Statistical Analysis', desc: 'Run tests and analysis using SPSS' },
  { icon: FileSearch, title: 'Interpretation of Results', desc: 'Clear explanation of your statistical output' },
  { icon: FileText, title: 'Report Writing Support', desc: 'Professionally written chapter 4 & 5' },
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
  const [analystErrors, setAnalystErrors] = useState<Record<string, string>>({});
  const [researcherErrors, setResearcherErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const guard = useAuthGuard();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please sign up or log in to continue');
      router.replace('/signup');
    } else if (user && (!user.name || !(user.whatsapp || user.phone))) {
      toast.error('Please complete your profile (add phone/WhatsApp number) to continue');
      router.replace('/profile');
    } else if (user) {
      const uPhone = user.whatsapp || user.phone || '';
      setAnalystForm(f => ({ ...f, name: user.name || '', email: user.email || '', phone: uPhone }));
      setResearcherForm(f => ({ ...f, name: user.name || '', email: user.email || '', phone: uPhone }));
    }
  }, [isLoading, isAuthenticated, user, router]);

  const setA = (k: string, v: string) => { setAnalystForm(f => ({ ...f, [k]: v })); setAnalystErrors(e => ({ ...e, [k]: '' })); };
  const setR = (k: string, v: string) => { setResearcherForm(f => ({ ...f, [k]: v })); setResearcherErrors(e => ({ ...e, [k]: '' })); };

  const toggleService = (id: string) => setAnalystForm(f => ({
    ...f,
    selectedServices: f.selectedServices.includes(id) ? f.selectedServices.filter(s => s !== id) : [...f.selectedServices, id],
  }));

  const validateAnalyst = () => {
    const e: Record<string, string> = {};
    if (!analystForm.name.trim()) e.name = 'Full name is required';
    if (!analystForm.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(analystForm.email)) e.email = 'Enter a valid email';
    if (!analystForm.phone.trim()) e.phone = 'Phone number is required';
    else if (!validatePhoneNumber(analystForm.phone)) e.phone = 'Enter a valid phone number';
    if (!analystForm.department.trim()) e.department = 'Department is required';
    if (analystForm.selectedServices.length === 0) e.services = 'Select at least one service';
    return e;
  };

  const validateResearcher = () => {
    const e: Record<string, string> = {};
    if (!researcherForm.name.trim()) e.name = 'Full name is required';
    if (!researcherForm.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(researcherForm.email)) e.email = 'Enter a valid email';
    if (!researcherForm.phone.trim()) e.phone = 'Phone number is required';
    else if (!validatePhoneNumber(researcherForm.phone)) e.phone = 'Enter a valid phone number';
    if (!researcherForm.department.trim()) e.department = 'Department is required';
    if (!researcherForm.researchType) e.researchType = 'Select a research type';
    return e;
  };

  const handleAnalystSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guard()) return;
    const errs = validateAnalyst();
    if (Object.keys(errs).length) { setAnalystErrors(errs); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('hire_requests').insert({
      type: 'analyst',
      name: analystForm.name.trim(),
      email: analystForm.email.trim().toLowerCase(),
      phone: analystForm.phone.trim(),
      institution: analystForm.institution.trim() || null,
      department: analystForm.department.trim(),
      topic: analystForm.topic.trim() || null,
      deadline: analystForm.deadline || null,
      services: analystForm.selectedServices,
      details: analystForm.details.trim() || null,
    });
    if (error) { toast.error('Submission failed. Please try again.'); setLoading(false); return; }
    setAnalystSubmitted(true);
    setLoading(false);
  };

  const handleResearcherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guard()) return;
    const errs = validateResearcher();
    if (Object.keys(errs).length) { setResearcherErrors(errs); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('hire_requests').insert({
      type: 'researcher',
      name: researcherForm.name.trim(),
      email: researcherForm.email.trim().toLowerCase(),
      phone: researcherForm.phone.trim(),
      department: researcherForm.department.trim(),
      topic: researcherForm.topic.trim() || null,
      deadline: researcherForm.deadline || null,
      research_type: researcherForm.researchType,
      details: researcherForm.details.trim() || null,
    });
    if (error) { toast.error('Submission failed. Please try again.'); setLoading(false); return; }
    setResearcherSubmitted(true);
    setLoading(false);
  };

  const SuccessCard = ({ name, email }: { name: string; email: string }) => (
    <div className="clay p-10 text-center animate-in zoom-in duration-500">
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-accent" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
      <p className="text-muted-foreground mb-1">Thank you, <span className="font-semibold text-foreground">{name}</span>. Your request has been received.</p>
      <p className="text-muted-foreground text-sm mb-6">We'll contact you at <span className="font-semibold text-foreground">{email}</span> shortly.</p>
      <Button onClick={() => router.push('/dashboard?tab=hire')} className="gap-2">
        <UserCheck size={16} /> View My Hire Requests
      </Button>
    </div>
  );

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft size={18} /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hire Academic Support</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">Choose whether you need a data analyst for SPSS analysis or a researcher for your full project.</p>
          <div className="clay p-1 flex flex-col sm:flex-row gap-1 mt-6 w-full sm:w-fit">
            {[
              { id: 'analyst', label: 'Hire a Data Analyst', icon: BarChart3 },
              { id: 'researcher', label: 'Hire a Researcher', icon: UserCheck },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-accent text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                <tab.icon size={16} />{tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-5">
            <div className="clay p-6">
              <h2 className="text-xl font-bold mb-5">{activeTab === 'analyst' ? 'Services Available' : 'What a Researcher Does'}</h2>
              <ul className="space-y-4">
                {(activeTab === 'analyst' ? analystServiceDetails : researcherDetails).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <s.icon size={15} className="text-accent" />
                    </div>
                    <div><p className="font-medium">{s.title}</p><p className="text-muted-foreground text-xs mt-0.5">{s.desc}</p></div>
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

          <div className="lg:col-span-2">
            {activeTab === 'analyst' && (
              analystSubmitted ? <SuccessCard name={analystForm.name} email={analystForm.email} /> : (
                <div className="clay p-8">
                  <h2 className="text-2xl font-bold mb-6">Submit Your Project Details</h2>
                  <form onSubmit={handleAnalystSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Full Name" required icon={User} error={analystErrors.name} success={!analystErrors.name && analystForm.name.length > 1}>
                        <IconInput icon={User} placeholder="Your full name" value={analystForm.name} onChange={e => setA('name', e.target.value)} error={!!analystErrors.name} autoComplete="name" disabled />
                      </FormField>
                      <FormField label="Email Address" required icon={Mail} error={analystErrors.email} success={!analystErrors.email && /\S+@\S+\.\S+/.test(analystForm.email)}>
                        <IconInput icon={Mail} type="email" placeholder="your@email.com" value={analystForm.email} onChange={e => setA('email', e.target.value)} error={!!analystErrors.email} autoComplete="email" disabled />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Phone Number" required icon={Phone} error={analystErrors.phone} success={!analystErrors.phone && analystForm.phone.length >= 7}>
                        <DisabledPhoneInput phone={analystForm.phone} />
                      </FormField>
                      <FormField label="Institution" icon={Building} hint="Optional">
                        <IconInput icon={Building} placeholder="Your university or organisation" value={analystForm.institution} onChange={e => setA('institution', e.target.value)} />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Department" required icon={BookOpen} error={analystErrors.department} success={!analystErrors.department && analystForm.department.length > 1}>
                        <IconInput icon={BookOpen} placeholder="e.g. Accounting, Microbiology" value={analystForm.department} onChange={e => setA('department', e.target.value)} error={!!analystErrors.department} />
                      </FormField>
                      <FormField label="Project Topic" icon={FileText} hint="Optional">
                        <IconInput icon={FileText} placeholder="Your research topic" value={analystForm.topic} onChange={e => setA('topic', e.target.value)} />
                      </FormField>
                    </div>
                    <FormField label="Deadline" icon={Clock} hint="Optional">
                      <IconInput icon={Clock} type="date" value={analystForm.deadline} onChange={e => setA('deadline', e.target.value)} />
                    </FormField>
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-muted-foreground" />
                        Services Required <span className="text-destructive">*</span>
                      </label>
                      {analystErrors.services && <p className="text-xs text-destructive mb-2">{analystErrors.services}</p>}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analystServices.map(s => (
                          <label key={s.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors text-sm ${analystForm.selectedServices.includes(s.id) ? 'border-accent bg-accent/5' : analystErrors.services ? 'border-destructive/40' : 'border-border hover:border-accent/50'}`}>
                            <input type="checkbox" checked={analystForm.selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} className="accent-accent" />
                            <s.icon size={15} className="text-accent flex-shrink-0" />
                            {s.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <FormField label="Additional Details" icon={FileText} hint="Optional">
                      <StyledTextarea rows={4} placeholder="Describe your project, data type, specific requirements..." value={analystForm.details} onChange={e => setA('details', e.target.value)} />
                    </FormField>
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Submitting...' : <><BarChart3 size={16} className="mr-2" />Submit Request</>}
                    </Button>
                  </form>
                </div>
              )
            )}

            {activeTab === 'researcher' && (
              researcherSubmitted ? <SuccessCard name={researcherForm.name} email={researcherForm.email} /> : (
                <div className="clay p-8">
                  <h2 className="text-2xl font-bold mb-6">Submit Your Research Request</h2>
                  <form onSubmit={handleResearcherSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Full Name" required icon={User} error={researcherErrors.name} success={!researcherErrors.name && researcherForm.name.length > 1}>
                        <IconInput icon={User} placeholder="Your full name" value={researcherForm.name} onChange={e => setR('name', e.target.value)} error={!!researcherErrors.name} autoComplete="name" disabled />
                      </FormField>
                      <FormField label="Email Address" required icon={Mail} error={researcherErrors.email} success={!researcherErrors.email && /\S+@\S+\.\S+/.test(researcherForm.email)}>
                        <IconInput icon={Mail} type="email" placeholder="your@email.com" value={researcherForm.email} onChange={e => setR('email', e.target.value)} error={!!researcherErrors.email} autoComplete="email" disabled />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Phone Number" required icon={Phone} error={researcherErrors.phone} success={!researcherErrors.phone && researcherForm.phone.length >= 7}>
                        <DisabledPhoneInput phone={researcherForm.phone} />
                      </FormField>
                      <FormField label="Department" required icon={BookOpen} error={researcherErrors.department} success={!researcherErrors.department && researcherForm.department.length > 1}>
                        <IconInput icon={BookOpen} placeholder="e.g. Accounting, Microbiology" value={researcherForm.department} onChange={e => setR('department', e.target.value)} error={!!researcherErrors.department} />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Research Topic" icon={FileText} hint="Optional">
                        <IconInput icon={FileText} placeholder="Your proposed topic" value={researcherForm.topic} onChange={e => setR('topic', e.target.value)} />
                      </FormField>
                      <FormField label="Deadline" icon={Clock} hint="Optional">
                        <IconInput icon={Clock} type="date" value={researcherForm.deadline} onChange={e => setR('deadline', e.target.value)} />
                      </FormField>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <GraduationCap size={14} className="text-muted-foreground" />
                        Research Type <span className="text-destructive">*</span>
                      </label>
                      {researcherErrors.researchType && <p className="text-xs text-destructive mb-2">{researcherErrors.researchType}</p>}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {researchTypes.map(t => (
                          <label key={t.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors text-sm ${researcherForm.researchType === t.id ? 'border-accent bg-accent/5' : researcherErrors.researchType ? 'border-destructive/40' : 'border-border hover:border-accent/50'}`}>
                            <input type="radio" name="researchType" value={t.id} checked={researcherForm.researchType === t.id} onChange={() => setR('researchType', t.id)} className="accent-accent" />
                            <t.icon size={15} className="text-accent flex-shrink-0" />
                            {t.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <FormField label="Additional Details" icon={FileText} hint="Optional">
                      <StyledTextarea rows={4} placeholder="Describe your research needs, scope, specific requirements..." value={researcherForm.details} onChange={e => setR('details', e.target.value)} />
                    </FormField>
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Submitting...' : <><UserCheck size={16} className="mr-2" />Submit Request</>}
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
  return <Suspense><HirePageContent /></Suspense>;
}
