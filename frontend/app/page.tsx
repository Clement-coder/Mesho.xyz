'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DepartmentCard } from './components/department-card';
import { departments, projects } from '@/lib/mock-data';
import { ProjectCard } from './components/project-card';
import { Icon } from './components/icon-wrapper';
import { CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  const featuredProjects = projects.slice(0, 6);
  const featuredDepartments = departments.slice(0, 8);

  const steps = [
    { icon: 'Search', title: 'Browse', description: 'Search for your department and project topic' },
    { icon: 'CreditCard', title: 'Request & Pay', description: 'Submit your request and complete payment securely' },
    { icon: 'Download', title: 'Download', description: 'Instantly access your full research material' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-500">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Your Academic Research Support Platform
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Access department-specific project materials, hire qualified academic data analysts, and master SPSS data analysis — all in one place.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/departments">
                  <Button size="lg" className="animate-in fade-in slide-in-from-left duration-700 delay-100">
                    Browse Research Materials
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="animate-in fade-in slide-in-from-left duration-700 delay-200 bg-transparent"
                >
                  Hire an Analyst
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-96 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 flex items-center justify-center animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-4">
                  <Icon name="BookOpen" size={40} className="text-white" />
                </div>
                <p className="text-sm text-muted-foreground">Academic Research Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-lg">
              Get your research materials in three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative p-6 bg-card border border-border rounded-xl animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name={step.icon as any} size={24} className="text-accent" />
                  </div>
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-border">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Departments Section */}
      <section className="py-16 md:py-24 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Department</h2>
            <p className="text-muted-foreground max-w-lg">
              Find project topics and research materials specific to your academic department.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDepartments.map((dept, index) => (
              <div
                key={dept.id}
                className="animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <DepartmentCard
                  name={dept.name}
                  description={dept.description}
                  icon={dept.icon}
                  color={dept.color}
                  onClick={() => {}}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/departments">
              <Button size="lg" variant="outline">
                View All Departments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Project Topics</h2>
            <p className="text-muted-foreground max-w-lg">
              A sample of the well-structured research topics available on the platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  difficulty={project.difficulty}
                  price={project.price}
                  onClick={() => setSelectedProject(project.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 px-4 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-lg mb-12">
            Mesho Data Sciences offers three core services to support your academic journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'FileText', title: 'Research Materials', desc: 'Access department-specific project topics and full research materials after payment.' },
              { icon: 'BarChart3', title: 'SPSS Training', desc: 'Structured training in academic data analysis using SPSS — from coding to interpretation.' },
              { icon: 'UserCheck', title: 'Hire a Data Analyst', desc: 'Engage qualified academic data analysts for data cleaning, analysis, and report writing.' },
            ].map((service, index) => (
              <div key={index} className="p-6 bg-background border border-border rounded-xl hover:border-accent transition-colors">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={service.icon as any} size={24} className="text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-accent text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in duration-500">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
          <p className="text-lg text-accent/90 max-w-2xl mx-auto">
            Join students and researchers already using Mesho Data Sciences for quality academic support.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/departments">
              <Button size="lg" variant="secondary">
                Browse Materials
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Mesho Data Sciences?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Department-Specific Topics', desc: 'Materials organized by your exact academic department' },
              { title: 'Professional Analysts', desc: 'Hire qualified experts for your data analysis needs' },
              { title: 'SPSS Training', desc: 'Practical skills in data coding, analysis, and interpretation' },
              { title: 'Instant Access', desc: 'Download full materials immediately after payment' },
            ].map((benefit, index) => (
              <div key={index} className="p-6 bg-card border border-border rounded-lg text-center hover:border-accent transition-colors">
                <CheckCircle className="w-8 h-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
