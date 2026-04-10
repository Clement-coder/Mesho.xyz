import React from 'react';
import { CheckCircle, Users, Target, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full">
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
            <div className="bg-card border border-border rounded-xl p-8 flex items-center justify-center">
              <Target className="w-24 h-24 text-accent/30" />
            </div>
          </div>

          {/* What We Do */}
          <div>
            <h2 className="text-2xl font-bold mb-8">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: BookOpen, title: 'Research Materials', desc: 'We provide well-structured, department-specific project topics and full research materials for undergraduate and postgraduate students across 16 academic departments.' },
                { icon: CheckCircle, title: 'SPSS Training', desc: 'We offer structured training programs in academic data analysis using SPSS, equipping users with practical skills in data coding, analysis, interpretation, and result presentation.' },
                { icon: Users, title: 'Data Analyst Hiring', desc: 'We connect students and researchers with qualified academic data analysts for data cleaning, statistical analysis, interpretation of results, and report writing support.' },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6">
                  <item.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who We Serve */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Who We Serve</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['Undergraduate Students', 'Postgraduate Students', 'Academic Researchers', 'Lecturers & Supervisors', 'Independent Scholars'].map((u, i) => (
                <div key={i} className="text-center p-4 bg-background border border-border rounded-lg">
                  <p className="text-sm font-medium">{u}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
