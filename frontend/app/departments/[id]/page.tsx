'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseCard } from '@/app/components/course-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Icon } from '@/app/components/icon-wrapper';
import { createClient } from '@/utils/supabase/client';
import type { Department, Course } from '@/lib/types';

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const [department, setDepartment] = useState<Department | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const id = params.id as string;
    Promise.all([
      supabase.from('departments').select('*').eq('id', id).single(),
      supabase.from('courses').select('*').eq('department_id', id).order('name'),
    ]).then(([{ data: dept }, { data: crs }]) => {
      setDepartment(dept);
      setCourses(crs ?? []);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!department) return <div className="w-full h-96 flex items-center justify-center"><div className="text-center"><p className="text-muted-foreground mb-4">Department not found</p><Button onClick={() => router.back()}>Go Back</Button></div></div>;

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${department.color}20` }}>
              <Icon name={department.icon as any} size={32} style={{ color: department.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold">{department.name}</h1>
              <p className="text-muted-foreground">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">{department.description}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div key={course.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                  <CourseCard
                    name={course.name}
                    difficulty={course.difficulty}
                    tools={course.tools}
                    icon={course.icon}
                    href={`/courses/${course.id}`}
                    onClick={() => router.push(`/courses/${course.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12"><p className="text-muted-foreground">No courses found for this department</p></div>
          )}
        </div>
      </section>
    </div>
  );
}
