'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProjectCard } from '@/app/components/project-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import type { Course, Project } from '@/lib/types';
import { useAuthGuard } from '@/lib/use-auth-guard';

export default function CourseProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const guard = useAuthGuard();

  useEffect(() => {
    const supabase = createClient();
    const id = params.id as string;
    Promise.all([
      supabase.from('courses').select('*').eq('id', id).single(),
      supabase.from('projects').select('*').eq('course_id', id).order('title'),
    ]).then(([{ data: crs }, { data: prjs }]) => {
      setCourse(crs);
      setProjects(prjs ?? []);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!course) return <div className="w-full h-96 flex items-center justify-center"><div className="text-center"><p className="text-muted-foreground mb-4">Course not found</p><Button onClick={() => router.back()}>Go Back</Button></div></div>;

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft size={18} /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.name}</h1>
          <p className="text-muted-foreground">{projects.length} project{projects.length !== 1 ? 's' : ''} • {course.difficulty}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={project.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    difficulty={project.difficulty}
                    price={project.price}
                    href={`/projects/${project.id}`}
                    onClick={() => { if (guard()) router.push(`/projects/${project.id}`); }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12"><p className="text-muted-foreground">No projects found</p></div>
          )}
        </div>
      </section>
    </div>
  );
}
