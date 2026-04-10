'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DepartmentCard } from './components/department-card';
import { departments, projects } from '@/lib/mock-data';
import { ProjectCard } from './components/project-card';
import { Icon } from './components/icon-wrapper';
import {
  CheckCircle, Search, CreditCard, Download,
  FileText, BarChart3, UserCheck,
  BookMarked, Users, Zap, Clock,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const featuredProjects = projects.slice(0, 6);
  const featuredDepartments = departments.slice(0, 8);

  const steps = [
    { icon: Search, title: 'Browse', description: 'Search for your department and project topic', detail: 'Use keyword search to find topics across 16 departments' },
    { icon: CreditCard, title: 'Request & Pay', description: 'Submit your request and complete payment securely', detail: 'Secure payment gateway — only verified payments unlock content' },
    { icon: Download, title: 'Download', description: 'Instantly access your full research material', detail: 'Full document released immediately after payment confirmation' },
  ];

  const services = [
    { icon: FileText, title: 'Research Materials', desc: 'Access department-specific project topics and full research materials after payment.', badge: '16 Departments', href: '/departments' },
    { icon: BarChart3, title: 'SPSS Training', desc: 'Structured training in academic data analysis using SPSS — from coding to interpretation.', badge: 'Flexible Schedules', href: '/training' },
    { icon: UserCheck, title: 'Hire a Data Analyst', desc: 'Engage qualified academic data analysts for data cleaning, analysis, and report writing.', badge: 'Professional Support', href: '/hire' },
  ];

  const benefits = [
    { icon: BookMarked, title: 'Department-Specific Topics', desc: 'Materials organized by your exact academic department across 16 fields of study' },
    { icon: UserCheck, title: 'Professional Analysts', desc: 'Hire qualified experts for data cleaning, SPSS analysis, and report writing' },
    { icon: BarChart3, title: 'SPSS Training', desc: 'Practical skills in data coding, analysis, interpretation, and result presentation' },
    { icon: Zap, title: 'Instant Access', desc: 'Download full research materials immediately after payment is confirmed' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-500 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Your Academic Research Support Platform
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Access department-specific project materials, hire qualified academic data analysts, and master SPSS data analysis — all in one place.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                <Link href="/departments">
                  <Button size="lg" aria-label="Browse research materials organized by academic department" title="Browse department-specific project topics and full research materials">
                    <FileText size={18} className="mr-2" aria-hidden="true" />
                    Browse Research Materials
                  </Button>
                </Link>
                <Link href="/hire">
                  <Button variant="outline" size="lg" className="bg-transparent" aria-label="Hire a qualified academic data analyst for your research project" title="Submit your project details and get matched with a professional analyst">
                    <UserCheck size={18} className="mr-2" aria-hidden="true" />
                    Hire an Analyst
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-96 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 flex items-center justify-center animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-4">
                  <Icon name="BookOpen" size={40} className="text-white" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-foreground">Academic Research Support</p>
                <p className="text-xs text-muted-foreground mt-1">Materials · Training · Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg">Get your research materials in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative clay p-6 animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center" aria-hidden="true">
                    <step.icon size={24} className="text-accent" />
                  </div>
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold" aria-label={`Step ${index + 1}`}>
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                <p className="text-xs text-muted-foreground/70 border-t border-border pt-2 mt-2">{step.detail}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Department */}
      <section className="py-16 md:py-24 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Browse by Department</h2>
            <p className="text-muted-foreground max-w-lg">Find project topics and research materials specific to your academic department.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDepartments.map((dept, index) => (
              <div key={dept.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <DepartmentCard
                  name={dept.name}
                  description={dept.description}
                  icon={dept.icon}
                  color={dept.color}
                  onClick={() => router.push(`/departments/${dept.id}`)}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/departments">
              <Button size="lg" variant="outline" aria-label="View all 16 academic departments">
                <BookMarked size={16} className="mr-2" />
                View All Departments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Project Topics */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Project Topics</h2>
            <p className="text-muted-foreground max-w-lg">A sample of the well-structured research topics available on the platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  difficulty={project.difficulty}
                  price={project.price}
                  onClick={() => router.push(`/projects/${project.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 md:py-24 px-4 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
          <p className="text-muted-foreground max-w-lg mb-12">Mesho Data Sciences offers three core services to support your academic journey.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link key={index} href={service.href} aria-label={`Go to ${service.title}`}>
                <div className="clay clay-hover p-6 cursor-pointer h-full transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center" aria-hidden="true">
                      <service.icon size={24} className="text-accent" />
                    </div>
                    <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full">{service.badge}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Why Choose Mesho Data Sciences?</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">Everything you need for quality academic research support, in one place.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="clay clay-hover p-6 text-center transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <benefit.icon size={24} className="text-accent" />
                </div>
                <h3 className="font-semibold text-base mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
