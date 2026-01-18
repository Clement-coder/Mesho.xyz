'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { projects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '../components/project-card';
import { Icon } from '../components/icon-wrapper';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { BarChart3, Settings, LogOut, BookOpen, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'wishlist'>('enrolled');
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>({});

  // Get user's enrolled courses and wishlist from localStorage (client-side only)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(userData);
    }
  }, []);

  const enrolledCourses = currentUser.enrolledCourses || [];
  const wishlistCourses = currentUser.wishlist || [];
  
  // Filter projects based on user data
  const enrolledProjects = projects.filter(p => enrolledCourses.includes(p.id));
  const wishlistProjects = projects.filter(p => wishlistCourses.includes(p.id));
  
  const displayedProjects =
    activeTab === 'enrolled'
      ? enrolledProjects
      : activeTab === 'wishlist'
        ? wishlistProjects
        : projects;

  return (
    <ProtectedRoute>
      <div className="w-full">
        {/* Sidebar Navigation */}
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                <nav className="space-y-2">
                  {[
                    { id: 'enrolled', label: 'Enrolled Courses', icon: 'BookOpen' },
                    { id: 'all', label: 'All Courses', icon: 'TrendingUp' },
                    { id: 'wishlist', label: 'Wishlist', icon: 'Heart' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                        activeTab === item.id
                          ? 'bg-accent text-white'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item.icon as any} size={16} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Settings
                </h3>
                <nav className="space-y-2">
                  <Link href="/profile">
                    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors text-sm">
                      <Icon name="Settings" size={16} />
                      Profile Settings
                    </button>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors text-sm"
                  >
                    <Icon name="LogOut" size={16} />
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-7xl">
              {/* Header */}
              <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {user?.name}!</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Continue your learning journey and explore new courses.
                </p>
              </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: 'BookOpen',
                  label: 'Enrolled Courses',
                  value: enrolledProjects.length,
                },
                {
                  icon: 'BarChart3',
                  label: 'Hours Learned',
                  value: `${currentUser.hoursLearned || 0}h`,
                },
                { 
                  icon: 'Award', 
                  label: 'Certificates', 
                  value: currentUser.certificates || 0 
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name={stat.icon as any} size={20} className="text-accent" />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-border">
              {[
                { id: 'enrolled', label: 'Enrolled' },
                { id: 'all', label: 'All Courses' },
                { id: 'wishlist', label: 'Wishlist' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-accent border-accent'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.length > 0 ? (
                displayedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="animate-in fade-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      difficulty={project.difficulty}
                      price={project.price}
                      onClick={() => {
                        // Navigate to project details
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'enrolled'
                      ? 'You haven\'t enrolled in any courses yet'
                      : activeTab === 'wishlist'
                        ? 'Your wishlist is empty'
                        : 'No courses available'}
                  </p>
                  <Button variant="outline">Explore Courses</Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border px-4 py-3 flex gap-2 overflow-x-auto">
        {[
          { id: 'enrolled', icon: 'BookOpen', label: 'Enrolled' },
          { id: 'all', icon: 'TrendingUp', label: 'All' },
          { id: 'wishlist', icon: 'Heart', label: 'Wishlist' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-xs ${
              activeTab === item.id
                ? 'bg-accent text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={item.icon as any} size={18} />
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

        {/* Bottom padding for mobile nav */}
        <div className="md:hidden h-20" />
      </div>
    </ProtectedRoute>
  );
}
