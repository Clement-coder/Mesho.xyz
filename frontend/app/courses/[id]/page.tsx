'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProjectCard } from '@/app/components/project-card';
import { projects, courses } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function ProjectsListPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const course = courses.find((c) => c.id === courseId);
  const courseProjects = projects.filter((p) => p.courseId === courseId);

  if (!course) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Course not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 animate-in fade-in slide-in-from-left duration-500"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="animate-in fade-in slide-in-from-left duration-500 delay-100">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.name}</h1>
            <p className="text-muted-foreground">
              {courseProjects.length} projects • {course.difficulty}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {courseProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseProjects.map((project, index) => (
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
                    onClick={() => router.push(`/projects/${project.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
