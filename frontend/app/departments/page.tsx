'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DepartmentCard } from '../components/department-card';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import type { Department } from '@/lib/types';

export default function DepartmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('departments').select('*').order('name').then(({ data }) => {
      setDepartments(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft size={18} /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Departments</h1>
          <p className="text-muted-foreground mb-8">Select your department to find project topics and research materials.</p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent clay-inset text-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="clay h-32 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((dept, index) => (
                <div key={dept.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                  <DepartmentCard
                    name={dept.name}
                    description={dept.description}
                    icon={dept.icon}
                    color={dept.color}
                    onClick={() => router.push(`/departments/${dept.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No departments found</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
