'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    category: 'Research Materials',
    items: [
      { q: 'How do I get a research material?', a: 'Browse to your department, select a project topic, submit a request, and complete payment. Your full material is released for download immediately after payment is confirmed.' },
      { q: 'What departments are available?', a: 'We cover 16 departments including Accounting, Actuarial Science, Marketing, Banking and Finance, Microbiology, Political Science, and more. Visit the Research Materials page to see the full list.' },
      { q: 'What does the full material include?', a: 'The full material includes all chapters (introduction through conclusion), references, appendices, and where applicable, SPSS data files and statistical output.' },
      { q: 'Can I preview a material before paying?', a: 'Yes. Each topic page shows the title, description, tools used, and what is included. Full content is only accessible after payment.' },
    ],
  },
  {
    category: 'Payment',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept payments through our secure payment gateway. All major Nigerian debit/credit cards and bank transfers are supported.' },
      { q: 'Is my payment secure?', a: 'Yes. Only verified payments trigger access to downloadable content. Your payment details are processed securely and never stored on our servers.' },
      { q: 'What if I pay but don\'t receive my material?', a: 'Contact us immediately via WhatsApp or email with your payment details. We will verify and release your material promptly.' },
    ],
  },
  {
    category: 'SPSS Training',
    items: [
      { q: 'Who is the SPSS training for?', a: 'The training is designed for undergraduate students, postgraduate students, researchers, and lecturers who need practical skills in academic data analysis.' },
      { q: 'What will I learn in the training?', a: 'You will learn data coding and entry, descriptive statistics, hypothesis testing (t-test, ANOVA, chi-square), correlation and regression analysis, interpretation of SPSS output, and academic result presentation.' },
      { q: 'How do I register for training?', a: 'Visit the SPSS Training page, fill in your details, and select your preferred schedule. We will contact you with session details.' },
    ],
  },
  {
    category: 'Hiring an Analyst',
    items: [
      { q: 'What services do your analysts provide?', a: 'Our analysts handle data cleaning and preparation, statistical analysis using SPSS, interpretation of results, and report writing support (chapters 4 & 5).' },
      { q: 'How do I hire an analyst?', a: 'Go to the Hire an Analyst page, fill in your project details and requirements, and submit. We will review your request and assign a qualified analyst.' },
      { q: 'How long does analysis take?', a: 'Turnaround time depends on the complexity of your project. You can specify your deadline in the request form and we will do our best to meet it.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={18} className="flex-shrink-0 text-accent" /> : <ChevronDown size={18} className="flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-xl">
            Find answers to common questions about our services, payment, training, and analyst hiring.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold mb-4 text-accent">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, j) => (
                  <FAQItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
