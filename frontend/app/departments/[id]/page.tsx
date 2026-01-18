'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseCard } from '@/app/components/course-card';
import { courses, departments } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Icon } from '@/app/components/icon-wrapper';

export default function CoursesPage() {
  const params = useParams();
  const router = useRouter();
  const departmentId = params.id as string;

  const department = departments.find((d) => d.id === departmentId);
  const departmentCourses = courses.filter((c) => c.departmentId === departmentId);

  if (!department) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Department not found</p>
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
          <div className="flex items-center gap-4 mb-4 animate-in fade-in slide-in-from-left duration-500 delay-100">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${department.color}20` }}
            >
              <Icon
                name={department.icon as any}
                size={32}
                style={{ color: department.color }}
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{department.name}</h1>
              <p className="text-muted-foreground">{departmentCourses.length} courses</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-left duration-500 delay-200">
            {department.description}
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {departmentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CourseCard
                    name={course.name}
                    difficulty={course.difficulty}
                    tools={course.tools}
                    icon={course.icon}
                    onClick={() => router.push(`/courses/${course.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
