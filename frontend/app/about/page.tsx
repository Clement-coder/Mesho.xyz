import React from 'react';
import Link from 'next/link';
import { CheckCircle, Users, Target, BookOpen, BarChart3, UserCheck, GraduationCap, Mail, Linkedin, Twitter } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Mesho Data Sciences</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            A web-based academic support platform designed to meet the research and data analysis needs of students and academic professionals.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mesho Data Sciences exists to bridge the gap between academic research demands and access to reliable analytical support services. We provide a centralized platform that simplifies access to research materials, professional data analysis, and practical SPSS training — all in one place.
              </p>
            </div>
            <div className="clay p-8 flex items-center justify-center">
              <Target className="w-24 h-24 text-accent/30" />
            </div>
          </div>

          {/* What We Do */}
          <div>
            <h2 className="text-2xl font-bold mb-8">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: BookOpen, title: 'Research Materials', desc: 'Well-structured, department-specific project topics and full research materials for undergraduate and postgraduate students across 16 academic departments.', href: '/departments' },
                { icon: BarChart3, title: 'SPSS Training', desc: 'Structured training programs in academic data analysis using SPSS — from data coding and entry to analysis, interpretation, and result presentation.', href: '/training' },
                { icon: UserCheck, title: 'Data Analyst Hiring', desc: 'Connect with qualified academic data analysts for data cleaning, statistical analysis, interpretation of results, and report writing support.', href: '/hire' },
              ].map((item, i) => (
                <Link key={i} href={item.href}>
                  <div className="clay clay-hover p-6 h-full cursor-pointer transition-all duration-300">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Founder Profile */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Meet the Founder</h2>
            <div className="clay p-8 max-w-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center clay-sm">
                    <span className="text-4xl font-bold text-accent">A</span>
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-1">Armang Meshak S.</h3>
                  <p className="text-accent text-sm font-medium mb-3">Founder & Lead Data Scientist</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    Armang Meshak S. is the visionary behind Mesho Data Sciences. With a deep passion for academic excellence and data-driven research, he built this platform to make quality research support accessible to every student and researcher — regardless of their institution or background. His expertise spans academic data analysis, SPSS, and research methodology.
                  </p>
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <a
                      href="mailto:armang@meshodatasciences.com"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors clay-sm px-3 py-2 rounded-lg"
                    >
                      <Mail size={15} />
                      Email
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors clay-sm px-3 py-2 rounded-lg"
                    >
                      <Linkedin size={15} />
                      LinkedIn
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors clay-sm px-3 py-2 rounded-lg"
                    >
                      <Twitter size={15} />
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Who We Serve */}
          <div className="clay p-8">
            <h2 className="text-2xl font-bold mb-6">Who We Serve</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Undergraduate Students', icon: GraduationCap },
                { label: 'Postgraduate Students', icon: GraduationCap },
                { label: 'Academic Researchers', icon: BookOpen },
                { label: 'Lecturers & Supervisors', icon: Users },
                { label: 'Independent Scholars', icon: CheckCircle },
              ].map((u, i) => (
                <div key={i} className="clay-sm text-center p-4 flex flex-col items-center gap-2">
                  <u.icon className="w-6 h-6 text-accent" />
                  <p className="text-sm font-medium">{u.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
