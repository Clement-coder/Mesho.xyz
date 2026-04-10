'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '../components/project-card';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutModal } from '@/components/logout-modal';
import { DashboardSidebar } from '../components/dashboard-sidebar';
import { BookOpen, BarChart3, Award, FolderOpen, Search, Heart, UserCircle } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'wishlist'>('enrolled');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>({});
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined')
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser') || '{}'));
  }, []);

  React.useEffect(() => {
    const handler = () => {
      if (typeof window !== 'undefined')
        setCurrentUser(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const enrolledProjects = projects.filter(p => (currentUser.enrolledCourses || []).includes(p.id));
  const wishlistProjects = projects.filter(p => (currentUser.wishlist || []).includes(p.id));
  const displayedProjects =
    activeTab === 'enrolled' ? enrolledProjects
    : activeTab === 'wishlist' ? wishlistProjects
    : projects;

  const handleLogout = () => { logout(); setShowLogoutModal(false); };

  const stats = [
    { icon: FolderOpen, label: 'Purchased Materials', value: enrolledProjects.length, desc: 'Research materials you own' },
    { icon: BarChart3, label: 'Training Sessions', value: currentUser.hoursLearned || 0, desc: 'SPSS training sessions attended' },
    { icon: Award, label: 'Completed Projects', value: currentUser.certificates || 0, desc: 'Projects fully completed' },
  ];

  const tabs = [
    { id: 'enrolled', label: 'My Materials', icon: FolderOpen },
    { id: 'all', label: 'All Topics', icon: Search },
    { id: 'wishlist', label: 'Saved', icon: Heart },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <DashboardSidebar activeTab={activeTab} onTabChange={(t) => setActiveTab(t as any)} onLogout={() => setShowLogoutModal(true)} />

        {/* Main */}
        <main className="flex-1 md:ml-64 px-4 sm:px-6 py-6 pb-24 md:pb-6">

          {/* Welcome */}
          <div className="clay p-4 sm:p-5 mb-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
              <Avatar className="w-11 h-11 flex-shrink-0">
                <AvatarImage src={currentUser?.profilePicture || user?.profilePicture} alt={user?.name} />
                <AvatarFallback className="text-base bg-accent text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold leading-tight truncate">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">Manage your research materials and track your academic progress.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="clay p-4 sm:p-5" title={stat.desc}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center">
                    <stat.icon size={18} className="text-accent" aria-hidden="true" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="clay p-1 flex gap-1 mb-5 w-full sm:w-fit overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                aria-label={`View ${tab.label}`}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id ? 'bg-accent text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon size={15} aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProjects.length > 0 ? (
              displayedProjects.map((project, i) => (
                <div key={project.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    difficulty={project.difficulty}
                    price={project.price}
                    onClick={() => router.push(`/projects/${project.id}`)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full clay p-10 text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={28} className="text-accent" aria-hidden="true" />
                </div>
                <p className="font-semibold mb-1">
                  {activeTab === 'enrolled' ? 'No purchased materials yet'
                    : activeTab === 'wishlist' ? 'Nothing saved yet'
                    : 'No topics available'}
                </p>
                <p className="text-muted-foreground text-sm mb-5">
                  {activeTab === 'enrolled' ? 'Browse research materials and make your first purchase.'
                    : activeTab === 'wishlist' ? 'Save topics you are interested in for later.'
                    : 'Check back soon for new topics.'}
                </p>
                <Link href="/departments">
                  <Button><BookOpen size={16} className="mr-2" aria-hidden="true" />Browse Research Materials</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border px-2 py-2 flex justify-around z-30" style={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.06)' }}>
        {tabs.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)} aria-label={item.label}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs ${activeTab === item.id ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <item.icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
        <Link href="/profile">
          <button aria-label="Profile Settings" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-muted-foreground text-xs">
            <UserCircle size={20} aria-hidden="true" />
            <span>Profile</span>
          </button>
        </Link>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </ProtectedRoute>
  );
}
