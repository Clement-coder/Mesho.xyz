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
  const steps = [
    {
      icon: 'BookOpen',
      title: 'Explore',
      description: 'Browse departments and courses',
    },
    {
      icon: 'Briefcase',
      title: 'Learn',
      description: 'Build real-world projects',
    },
    {
      icon: 'Award',
      title: 'Achieve',
      description: 'Get certificates and skills',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-500">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Learn Data Skills Through Real Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Master web development, data science, mobile development, and DevOps with industry-leading instructors.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/departments">
                  <Button size="lg" className="animate-in fade-in slide-in-from-left duration-700 delay-100">
                    Start Learning
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="animate-in fade-in slide-in-from-left duration-700 delay-200 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-96 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 flex items-center justify-center animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-4">
                  <Icon name="Code" size={40} className="text-white" />
                </div>
                <p className="text-sm text-muted-foreground">Interactive Learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Mesho Works</h2>
            <p className="text-muted-foreground max-w-lg">
              Get started in four simple steps and begin your learning journey today.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Departments</h2>
            <p className="text-muted-foreground max-w-lg">
              Choose from a wide variety of departments and start learning today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
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
                  onClick={() => {
                    // Navigate to department page
                  }}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-lg">
              Get a preview of the real-world projects you'll build.
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-accent text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in duration-500">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to start learning?</h2>
          <p className="text-lg text-accent/90 max-w-2xl mx-auto">
            Join thousands of students already mastering data skills on Mesho.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/departments">
              <Button size="lg" variant="secondary">
                Explore Courses
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Mesho?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Hands-On Learning', desc: 'Build real projects, not just watch tutorials' },
              { title: 'Expert Instructors', desc: 'Learn from industry professionals' },
              { title: 'Flexible Schedule', desc: 'Learn at your own pace, anytime' },
              { title: 'Career Support', desc: 'Get job-ready with certificates' },
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
