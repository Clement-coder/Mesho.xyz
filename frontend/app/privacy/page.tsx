import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-10 text-sm leading-relaxed text-muted-foreground">

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
            <p>Mesho Data Sciences ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Personal details you provide during registration (name, email address)</li>
              <li>Contact information submitted through our training or hiring forms (phone number, institution)</li>
              <li>Payment transaction data processed through our payment gateway</li>
              <li>Usage data such as pages visited and services accessed</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To process your requests and deliver purchased research materials</li>
              <li>To facilitate training registration and analyst engagement</li>
              <li>To communicate with you regarding your requests and account</li>
              <li>To improve the quality and functionality of our platform</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Payment Security</h2>
            <p>All payments are processed through a secure payment gateway. We do not store your card details or sensitive financial information on our servers. Only verified payments trigger access to downloadable content.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. Your data may be shared only with service providers directly involved in delivering our services (e.g., payment processors), and only to the extent necessary.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Data Retention</h2>
            <p>We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at <a href="mailto:support@meshodatasciences.com" className="text-accent hover:underline">support@meshodatasciences.com</a>.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the platform constitutes acceptance of the revised policy.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Contact</h2>
            <p>For privacy-related enquiries, contact us at <a href="mailto:support@meshodatasciences.com" className="text-accent hover:underline">support@meshodatasciences.com</a>.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
