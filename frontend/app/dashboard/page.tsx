'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '../components/project-card';
import { Icon } from '../components/icon-wrapper';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutModal } from '@/components/logout-modal';
import {
  BookOpen, TrendingUp, Heart, Settings, LogOut,
  BarChart3, Award, FolderOpen, Search, UserCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'wishlist'>('enrolled');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>({});
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    }
  }, []);

  React.useEffect(() => {
    const handler = () => {
      if (typeof window !== 'undefined')
        setCurrentUser(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const enrolledCourses = currentUser.enrolledCourses || [];
  const wishlistCourses = currentUser.wishlist || [];
  const enrolledProjects = projects.filter(p => enrolledCourses.includes(p.id));
  const wishlistProjects = projects.filter(p => wishlistCourses.includes(p.id));
  const displayedProjects =
    activeTab === 'enrolled' ? enrolledProjects
    : activeTab === 'wishlist' ? wishlistProjects
    : projects;

  const handleLogout = () => { logout(); setShowLogoutModal(false); };

  const sidebarNav = [
    { id: 'enrolled', label: 'My Materials', icon: BookOpen, desc: 'View purchased research materials' },
    { id: 'all', label: 'All Topics', icon: Search, desc: 'Browse all available project topics' },
    { id: 'wishlist', label: 'Saved', icon: Heart, desc: 'Your saved topics' },
  ];

  const stats = [
    { icon: FolderOpen, label: 'Purchased Materials', value: enrolledProjects.length, desc: 'Research materials you own' },
    { icon: BarChart3, label: 'Training Sessions', value: currentUser.hoursLearned || 0, desc: 'SPSS training sessions attended' },
    { icon: Award, label: 'Completed Projects', value: currentUser.certificates || 0, desc: 'Projects fully completed' },
  ];

  return (
    <ProtectedRoute>
      <div className="w-full">
        <div className="flex min-h-screen">

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col w-64 border-r border-border p-5 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto bg-card">
            {/* User Info */}
            <div className="clay p-4 mb-6 flex items-center gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={currentUser?.profilePicture || user?.profilePicture} alt={user?.name} />
                <AvatarFallback className="bg-accent text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Navigation</p>
              <nav className="space-y-1">
                {sidebarNav.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    title={item.desc}
                    aria-label={item.desc}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-accent text-white shadow-md'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon size={17} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Links */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Services</p>
              <nav className="space-y-1">
                {[
                  { href: '/departments', icon: BookOpen, label: 'Research Materials', desc: 'Browse project topics by department' },
                  { href: '/training', icon: BarChart3, label: 'SPSS Training', desc: 'Register for data analysis training' },
                  { href: '/hire', icon: TrendingUp, label: 'Hire an Analyst', desc: 'Get professional data analysis help' },
                ].map(link => (
                  <Link key={link.href} href={link.href}>
                    <button
                      title={link.desc}
                      aria-label={link.desc}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-muted transition-all duration-200 text-sm"
                    >
                      <link.icon size={17} className="text-accent" />
                      <span>{link.label}</span>
                    </button>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto border-t border-border pt-4 space-y-1">
              <Link href="/profile">
                <button
                  title="Edit your profile settings"
                  aria-label="Profile Settings"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-muted transition-all duration-200 text-sm"
                >
                  <Settings size={17} />
                  <span>Profile Settings</span>
                </button>
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                title="Sign out of your account"
                aria-label="Logout"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 text-sm"
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-4 md:px-8 py-8 min-w-0">
            {/* Welcome Header */}
            <div className="clay p-6 mb-8 animate-in fade-in slide-in-from-top duration-500">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 flex-shrink-0">
                  <AvatarImage src={currentUser?.profilePicture || user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="text-xl bg-accent text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name}!</h1>
                  <p className="text-muted-foreground text-sm mt-0.5">Manage your research materials and track your academic progress.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="clay p-5 animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                  title={stat.desc}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <stat.icon size={20} className="text-accent" />
                    </div>
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Tab Bar */}
            <div className="clay p-1 flex gap-1 mb-6 w-fit">
              {[
                { id: 'enrolled', label: 'My Materials', icon: FolderOpen },
                { id: 'all', label: 'All Topics', icon: Search },
                { id: 'wishlist', label: 'Saved', icon: Heart },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  aria-label={`View ${tab.label}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-accent text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedProjects.length > 0 ? (
                displayedProjects.map((project, i) => (
                  <div
                    key={project.id}
                    className="animate-in fade-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
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
                <div className="col-span-full clay p-12 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-accent" />
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
                    <Button>
                      <BookOpen size={16} className="mr-2" />
                      Browse Research Materials
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border px-4 py-2 flex justify-around" style={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.06)' }}>
          {[
            { id: 'enrolled', icon: FolderOpen, label: 'My Materials' },
            { id: 'all', icon: Search, label: 'All Topics' },
            { id: 'wishlist', icon: Heart, label: 'Saved' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              aria-label={item.label}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-xs ${
                activeTab === item.id ? 'text-accent' : 'text-muted-foreground'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
          <Link href="/profile">
            <button aria-label="Profile Settings" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-muted-foreground text-xs">
              <UserCircle size={20} />
              <span>Profile</span>
            </button>
          </Link>
        </div>

        <div className="md:hidden h-20" />

        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      </div>
    </ProtectedRoute>
  );
}
