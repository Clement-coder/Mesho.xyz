'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/app/components/badge';
import { BankTransferModal } from '@/app/components/bank-transfer-modal';
import { MessageAlert } from '@/app/components/message-alert';
import { ChevronLeft, Clock, GraduationCap, FileText, Lock, MessageCircle, Heart } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import type { Project } from '@/lib/types';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';

export default function ProjectPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [payRef, setPayRef] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.from('projects').select('*').eq('id', params.id as string).single().then(({ data }) => {
      setProject(data);
      setLoading(false);
    });
  }, [params.id]);

  useEffect(() => {
    if (!user || !project) return;
    setAlreadyPurchased(user.enrolled_projects.includes(project.id));
    setInWishlist(user.wishlist.includes(project.id));
  }, [user, project]);

  const openPayment = () => {
    if (!user) { router.push('/login'); return; }
    if (!user.whatsapp && !user.phone) {
      toast.error('Please add your WhatsApp number in your profile before purchasing.', {
        action: { label: 'Go to Profile', onClick: () => router.push('/profile') },
        duration: 6000,
      });
      return;
    }
    const ref = `MESHO-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    setPayRef(ref);
    setShowTransferModal(true);
  };

  const handleIHavePaid = async () => {
    if (!user || !project) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      project_id: project.id,
      amount: project.price,
      payment_reference: payRef,
      status: 'pending',
      user_name: user.name,
      user_email: user.email ?? '',
      user_whatsapp: user.whatsapp ?? user.phone ?? '',
    });
    if (error) { toast.error('Submission failed. Please try again.'); setSubmitting(false); return; }
    setSubmitting(false);
    setShowTransferModal(false);
    setShowSuccessAlert(true);
  };

  const toggleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    if (!project) return;
    setWishlistLoading(true);
    const supabase = createClient();
    const newWishlist = inWishlist
      ? user.wishlist.filter(id => id !== project.id)
      : [...user.wishlist, project.id];
    const { error } = await supabase.from('profiles').update({ wishlist: newWishlist }).eq('id', user.id);
    if (error) { toast.error('Failed to update saved list'); setWishlistLoading(false); return; }
    await refreshUser();
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? 'Removed from saved' : 'Saved to wishlist');
    setWishlistLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="w-full h-96 flex items-center justify-center"><div className="text-center"><p className="text-muted-foreground mb-4">Project not found</p><Button onClick={() => router.back()}>Go Back</Button></div></div>;

  return (
    <div className="w-full">
      {showSuccessAlert && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
          <MessageAlert
            type="success"
            message="Payment submitted! The admin will verify your transfer and send your material via WhatsApp or email shortly."
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      )}

      <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Badge variant="info" className="mb-4">{project.difficulty}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-4xl font-bold text-accent">₦{project.price.toLocaleString()}</div>
              <div className="flex items-center gap-2">
                {/* Wishlist toggle */}
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  title={inWishlist ? 'Remove from saved' : 'Save for later'}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-50 ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-border text-muted-foreground hover:border-red-200 hover:text-red-400'}`}
                >
                  <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
                {alreadyPurchased ? (
                  <Button size="lg" variant="outline" className="border-green-500 text-green-600">
                    ✓ Purchased
                  </Button>
                ) : (
                  <Button size="lg" onClick={openPayment}>
                    Get This Material
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="clay p-6">
                <h2 className="text-2xl font-bold mb-6">Material Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { icon: Clock, label: 'Delivery', value: project.duration },
                    { icon: GraduationCap, label: 'Level', value: project.difficulty },
                    { icon: FileText, label: 'Format', value: 'Full Document' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <item.icon size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="clay p-6">
                <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                <ul className="space-y-3">
                  {project.learning_outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs mt-1">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="clay p-6">
                <h2 className="text-2xl font-bold mb-6">Tools & Software Used</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map(tool => <Badge key={tool} variant="secondary">{tool}</Badge>)}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-2xl p-6">
                {alreadyPurchased ? (
                  <>
                    <h3 className="font-bold text-lg mb-2">Material Unlocked</h3>
                    <p className="text-sm text-muted-foreground mb-4">Your payment was confirmed. Contact us on WhatsApp to receive your file.</p>
                    <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-xl transition-colors font-medium text-sm">
                      <MessageCircle size={18} /> Get Download Link on WhatsApp
                    </a>
                  </>
                ) : (
                  <>
                    <Lock className="w-8 h-8 text-accent mb-4" />
                    <h3 className="font-bold text-lg mb-2">Full Material Locked</h3>
                    <p className="text-sm text-muted-foreground mb-6">Make a bank transfer and the admin will send your material after verification.</p>
                    <Button size="lg" className="w-full" onClick={openPayment}>
                      Pay ₦{project.price.toLocaleString()} via Bank Transfer
                    </Button>
                  </>
                )}
              </div>

              <div className="clay p-6">
                <h3 className="font-bold mb-4">Need Help?</h3>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-xl transition-colors font-medium">
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BankTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        projectTitle={project.title}
        amount={project.price}
        reference={payRef}
        onIHavePaid={handleIHavePaid}
        submitting={submitting}
      />
    </div>
  );
}
