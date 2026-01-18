'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/app/components/badge';
import { SlideModal } from '@/app/components/slide-modal';
import { MessageAlert } from '@/app/components/message-alert';
import { ChevronLeft, Clock, Users, Award, Lock, MessageCircle } from 'lucide-react';

export default function ProjectPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const project = projects.find((p) => p.id === projectId);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  if (!project) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    setIsPurchaseModalOpen(false);
    setShowSuccessAlert(true);
  };

  const difficultyColor = {
    Beginner: 'success',
    Intermediate: 'info',
    Advanced: 'warning',
  } as const;

  return (
    <div className="w-full">
      {showSuccessAlert && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md">
          <MessageAlert
            type="success"
            message="Successfully enrolled! Check your email for next steps."
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      )}

      {/* Header Section */}
      <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 animate-in fade-in slide-in-from-left duration-500"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-in fade-in slide-in-from-left duration-500 delay-100">
            <div>
              <Badge
                variant={difficultyColor[project.difficulty as keyof typeof difficultyColor]}
                className="mb-4"
              >
                {project.difficulty}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-accent mb-2">${project.price}</div>
              <Button
                size="lg"
                onClick={() => setIsPurchaseModalOpen(true)}
                className="w-full md:w-auto"
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Details Card */}
              <div className="bg-card border border-border rounded-lg p-6 animate-in fade-in slide-in-from-left duration-500">
                <h2 className="text-2xl font-bold mb-6">Project Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold">{project.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="font-semibold">{project.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Award size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Certificate</p>
                      <p className="font-semibold">Included</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="bg-card border border-border rounded-lg p-6 animate-in fade-in slide-in-from-left duration-500 delay-100">
                <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                <ul className="space-y-3">
                  {project.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs mt-1">
                        ✓
                      </span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools Required */}
              <div className="bg-card border border-border rounded-lg p-6 animate-in fade-in slide-in-from-left duration-500 delay-200">
                <h2 className="text-2xl font-bold mb-6">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <Badge key={tool} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Locked Content Preview */}
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none" />
                <div className="relative z-10">
                  <Lock className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-lg mb-2">Premium Content Locked</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enroll in this project to unlock all lessons, assignments, and resources.
                  </p>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsPurchaseModalOpen(true)}
                  >
                    Enroll Now - ${project.price}
                  </Button>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold mb-4">Have Questions?</h3>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-lg transition-colors font-medium"
                >
                  <MessageCircle size={18} />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      <SlideModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="Enroll in Project"
      >
        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-bold text-lg mb-2">{project.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
            <div className="bg-accent/10 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price</span>
                <span className="text-2xl font-bold text-accent">${project.price}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-border">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <div>
                <p className="font-medium">Lifetime Access</p>
                <p className="text-sm text-muted-foreground">
                  Access course materials forever
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-border">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <div>
                <p className="font-medium">Certificate of Completion</p>
                <p className="text-sm text-muted-foreground">
                  Add to your professional profile
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">✓</span>
              <div>
                <p className="font-medium">Project Files & Resources</p>
                <p className="text-sm text-muted-foreground">
                  Download all project materials
                </p>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handlePurchase}>
            Complete Purchase - ${project.price}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment processed. Money-back guarantee if not satisfied.
          </p>
        </div>
      </SlideModal>
    </div>
  );
}
