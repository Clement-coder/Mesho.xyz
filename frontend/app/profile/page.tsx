'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutModal } from '@/components/logout-modal';
import { User, Mail, Calendar, Save, Camera, FolderOpen, BarChart3, Award, Phone, ChevronLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, logout, refreshUser, changePassword } = useAuth();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setWhatsapp(user.whatsapp ?? '');
      setProfilePicture(user.profile_picture_url ?? '');
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadError) { toast.error('Image upload failed'); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('profiles').update({ profile_picture_url: publicUrl }).eq('id', user.id);
    setProfilePicture(publicUrl);
    await refreshUser();
    toast.success('Profile picture updated!');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ name: name.trim(), whatsapp: whatsapp.trim() || null }).eq('id', user.id);
    if (error) { toast.error('Update failed'); setSaving(false); return; }
    await refreshUser();
    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { toast.error('All password fields are required'); return; }
    if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPw(true);
    try {
      await changePassword(newPassword);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      toast.success('Password changed successfully!');
    } catch {
      toast.error('Password change failed. Please sign out and sign in again first.');
    }
    setChangingPw(false);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full px-4 sm:px-6 py-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Profile Settings</h1>
              <p className="text-muted-foreground text-sm">Manage your account settings and preferences.</p>
            </div>
            <a href="/dashboard" className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors font-medium">
              <ChevronLeft size={16} />Dashboard
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="clay p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src={profilePicture} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-accent text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-accent/80 transition-colors" title="Upload profile picture">
                    <Camera size={13} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="font-semibold text-base">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-4">{user?.email}</p>
                <Separator className="mb-4" />
                <div className="space-y-3 text-sm text-left">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={14} /><span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} /><span>Joined {user?.created_at ? formatDate(user.created_at) : 'N/A'}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: FolderOpen, label: 'Materials', value: user?.enrolled_projects?.length ?? 0 },
                    { icon: BarChart3, label: 'Training', value: user?.hours_learned ?? 0 },
                    { icon: Award, label: 'Completed', value: user?.certificates ?? 0 },
                  ].map((s, i) => (
                    <div key={i} className="clay-sm p-2 rounded-xl">
                      <s.icon size={14} className="text-accent mx-auto mb-1" />
                      <p className="text-base font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              <div className="clay p-6">
                <div className="flex items-center gap-2 mb-5">
                  <User size={18} className="text-accent" />
                  <h2 className="font-semibold text-base">Profile Information</h2>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                    <Input value={user?.email ?? ''} disabled className="opacity-60 cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                      <Phone size={13} className="text-muted-foreground" /> WhatsApp Number
                    </label>
                    <Input
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 2348012345678 (with country code)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Used by admin to send your purchased materials.</p>
                  </div>
                  <Button type="submit" disabled={saving}>
                    <Save size={15} className="mr-2" />{saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </div>

              <div className="clay p-6">
                <h2 className="font-semibold text-base mb-5">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Current Password</label>
                    <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">New Password</label>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
                    <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                  </div>
                  <Button type="submit" variant="outline" disabled={changingPw}>{changingPw ? 'Changing...' : 'Change Password'}</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => { logout(); setShowLogoutModal(false); }} />
    </ProtectedRoute>
  );
}
