import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Use</h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-10 text-sm leading-relaxed text-muted-foreground">

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the Mesho Data Sciences platform, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Services Provided</h2>
            <p>Mesho Data Sciences provides three core services:</p>
            <ul className="space-y-2 list-disc list-inside mt-2">
              <li>Access to and purchase of academic research materials</li>
              <li>Registration for SPSS data analysis training</li>
              <li>Hiring of qualified academic data analysts</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">3. User Responsibilities</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You must provide accurate information when registering or submitting requests</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>Research materials purchased are for personal academic use only and must not be resold or redistributed</li>
              <li>You must not use the platform for any unlawful or fraudulent purpose</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Payment and Access</h2>
            <p>Full research materials are only released upon successful payment confirmation. All payments are final. Refunds may be considered only in cases where the material delivered does not match the described content — contact us within 48 hours of purchase.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Intellectual Property</h2>
            <p>All content on this platform, including research materials, training resources, and platform design, is the intellectual property of Mesho Data Sciences or its content providers. Unauthorised reproduction or distribution is strictly prohibited.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Academic Integrity</h2>
            <p>Research materials provided on this platform are intended as reference and guidance resources. Users are responsible for ensuring their use of these materials complies with their institution's academic integrity policies.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>Mesho Data Sciences shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or services. We do not guarantee specific academic outcomes from the use of our materials or services.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Modifications</h2>
            <p>We reserve the right to modify these Terms of Use at any time. Changes will be posted on this page. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:support@meshodatasciences.com" className="text-accent hover:underline">support@meshodatasciences.com</a>.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
