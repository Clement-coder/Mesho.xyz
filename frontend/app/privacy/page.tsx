import React from 'react';
import { Shield, Database, Info, CreditCard, Share2, Clock, UserCheck, RefreshCw, Mail } from 'lucide-react';

const sections = [
  {
    icon: Info,
    title: 'Introduction',
    content: 'Mesho Data Sciences ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.',
  },
  {
    icon: Database,
    title: 'Information We Collect',
    items: [
      'Personal details provided during registration (name, email address)',
      'Contact information from training or hiring forms (phone, institution)',
      'Payment transaction data processed through our payment gateway',
      'Usage data such as pages visited and services accessed',
    ],
  },
  {
    icon: Shield,
    title: 'How We Use Your Information',
    items: [
      'To process requests and deliver purchased research materials',
      'To facilitate training registration and analyst engagement',
      'To communicate with you regarding your requests and account',
      'To improve the quality and functionality of our platform',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payment Security',
    content: 'All payments are processed through a secure payment gateway. We do not store your card details or sensitive financial information. Only verified payments trigger access to downloadable content.',
  },
  {
    icon: Share2,
    title: 'Data Sharing',
    content: 'We do not sell, trade, or rent your personal information to third parties. Your data may be shared only with service providers directly involved in delivering our services, and only to the extent necessary.',
  },
  {
    icon: Clock,
    title: 'Data Retention',
    content: 'We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: 'You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at support@meshodatasciences.com.',
  },
  {
    icon: RefreshCw,
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the platform constitutes acceptance of the revised policy.',
  },
  {
    icon: Mail,
    title: 'Contact',
    content: 'For privacy-related enquiries, contact us at support@meshodatasciences.com.',
    email: 'support@meshodatasciences.com',
  },
];

export default function PrivacyPage() {
  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-accent" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
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
                    {s.email
                      ? s.content.replace(s.email, '')
                      : s.content}
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
