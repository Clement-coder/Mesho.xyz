import React from 'react';
import { MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-12" style={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.04)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Mesho Data Sciences</h3>
            <p className="text-sm text-muted-foreground">
              Academic research support for students, researchers, and lecturers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/departments" className="hover:text-foreground transition-colors">Research Materials</a></li>
              <li><a href="/training" className="hover:text-foreground transition-colors">SPSS Training</a></li>
              <li><a href="/hire" className="hover:text-foreground transition-colors">Hire a Data Analyst</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex items-center justify-between flex-col md:flex-row gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Mesho Data Sciences. All rights reserved.
          </p>
          <a
            href="https://wa.me/1234567890"
            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} />
            Contact via WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
};
