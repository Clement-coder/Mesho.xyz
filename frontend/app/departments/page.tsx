'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DepartmentCard } from '../components/department-card';
import { departments } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Loading from './loading';

export default function DepartmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-in fade-in slide-in-from-top duration-500">
            Explore Departments
          </h1>
          <p className="text-muted-foreground mb-8 animate-in fade-in slide-in-from-top duration-500 delay-100">
            Choose from our diverse range of departments and start your learning journey.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md animate-in fade-in slide-in-from-top duration-500 delay-200">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredDepartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDepartments.map((dept, index) => (
                <div
                  key={dept.id}
                  className="animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
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
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
