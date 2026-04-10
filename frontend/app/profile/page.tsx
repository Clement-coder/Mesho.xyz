'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutModal } from '@/components/logout-modal';
import { DashboardSidebar } from '../components/dashboard-sidebar';
import { User, Mail, Calendar, Save, Camera, FolderOpen, BarChart3, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setProfilePicture(imageUrl);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = users.findIndex((u: any) => u.id === user?.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], profilePicture: imageUrl };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[idx]));
        refreshUser();
        setMessage('Profile picture updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!name.trim()) { setError('Name is required'); return; }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex((u: any) => u.id === user?.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name: name.trim(), profilePicture };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[idx]));
      setMessage('Profile updated successfully!');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!currentPassword || !newPassword || !confirmPassword) { setError('All password fields are required'); return; }
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex((u: any) => u.id === user?.id && u.password === currentPassword);
    if (idx === -1) { setError('Current password is incorrect'); return; }
    users[idx].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[idx]));
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    setMessage('Password changed successfully!');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full">
        {/* Sidebar — no tab nav on profile page */}
        <DashboardSidebar onLogout={() => setShowLogoutModal(true)} />

        {/* Main */}
        <main className="flex-1 md:ml-64 px-4 sm:px-6 py-6 pb-24 md:pb-6">
          <div className="max-w-3xl">

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Profile Settings</h1>
              <p className="text-muted-foreground text-sm">Manage your account settings and preferences.</p>
            </div>

            {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">{message}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <div className="clay p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarImage src={profilePicture} alt={user?.name} />
                      <AvatarFallback className="text-2xl bg-accent text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      className="absolute bottom-0 right-0 w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-accent/80 transition-colors"
                      title="Upload profile picture"
                      aria-label="Upload a new profile picture"
                    >
                      <Camera size={13} aria-hidden="true" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="font-semibold text-base">{user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-4">{user?.email}</p>

                  <Separator className="mb-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} aria-hidden="true" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={14} aria-hidden="true" />
                      <span>Joined {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { icon: FolderOpen, label: 'Materials', value: user?.enrolledCourses?.length || 0 },
                      { icon: BarChart3, label: 'Training', value: (user as any)?.hoursLearned || 0 },
                      { icon: Award, label: 'Completed', value: (user as any)?.certificates || 0 },
                    ].map((s, i) => (
                      <div key={i} className="clay-sm p-2 rounded-xl">
                        <s.icon size={14} className="text-accent mx-auto mb-1" aria-hidden="true" />
                        <p className="text-base font-bold">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Forms */}
              <div className="lg:col-span-2 space-y-5">

                {/* Profile Info */}
                <div className="clay p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <User size={18} className="text-accent" aria-hidden="true" />
                    <h2 className="font-semibold text-base">Profile Information</h2>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                      <Input value={email} disabled className="opacity-60 cursor-not-allowed" />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                    </div>
                    <Button type="submit" aria-label="Save profile changes">
                      <Save size={15} className="mr-2" aria-hidden="true" />
                      Save Changes
                    </Button>
                  </form>
                </div>

                {/* Change Password */}
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
                    <Button type="submit" variant="outline" aria-label="Change your password">Change Password</Button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => { logout(); setShowLogoutModal(false); }} />
    </ProtectedRoute>
  );
}
