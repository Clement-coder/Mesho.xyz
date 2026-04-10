import React from 'react';
import { FileText, BookOpen, UserCheck, CreditCard, Copyright, GraduationCap, AlertTriangle, RefreshCw, Mail, CheckCircle } from 'lucide-react';

const sections = [
  {
    icon: CheckCircle,
    title: 'Acceptance of Terms',
    content: 'By accessing or using the Mesho Data Sciences platform, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform.',
  },
  {
    icon: BookOpen,
    title: 'Services Provided',
    content: 'Mesho Data Sciences provides three core services:',
    items: [
      'Access to and purchase of academic research materials',
      'Registration for SPSS data analysis training',
      'Hiring of qualified academic data analysts',
    ],
  },
  {
    icon: UserCheck,
    title: 'User Responsibilities',
    items: [
      'Provide accurate information when registering or submitting requests',
      'Maintain confidentiality of your account credentials',
      'Use purchased materials for personal academic use only — no resale or redistribution',
      'Do not use the platform for any unlawful or fraudulent purpose',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payment and Access',
    content: 'Full research materials are only released upon successful payment confirmation. All payments are final. Refunds may be considered only where the material does not match the described content — contact us within 48 hours of purchase.',
  },
  {
    icon: Copyright,
    title: 'Intellectual Property',
    content: 'All content on this platform, including research materials, training resources, and platform design, is the intellectual property of Mesho Data Sciences or its content providers. Unauthorised reproduction or distribution is strictly prohibited.',
  },
  {
    icon: GraduationCap,
    title: 'Academic Integrity',
    content: 'Research materials are intended as reference and guidance resources. Users are responsible for ensuring their use of these materials complies with their institution\'s academic integrity policies.',
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: 'Mesho Data Sciences shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or services. We do not guarantee specific academic outcomes.',
  },
  {
    icon: RefreshCw,
    title: 'Modifications',
    content: 'We reserve the right to modify these Terms of Use at any time. Changes will be posted on this page. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms.',
  },
  {
    icon: Mail,
    title: 'Contact',
    content: 'For questions about these terms, contact us at ',
    email: 'support@meshodatasciences.com',
  },
];

export default function TermsPage() {
  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <FileText size={22} className="text-accent" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Use</h1>
          </div>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((s, i) => (
              <div key={i} className="clay p-5 flex flex-col gap-3" aria-label={s.title}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <s.icon size={18} className="text-accent" aria-hidden="true" />
                  </div>
                  <h2 className="font-semibold text-sm">{s.title}</h2>
                </div>
                {s.content && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.content}
                    {s.email && (
                      <a href={`mailto:${s.email}`} className="text-accent hover:underline">{s.email}</a>
                    )}
                  </p>
                )}
                {s.items && (
                  <ul className="space-y-2">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0 mt-1.5" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
