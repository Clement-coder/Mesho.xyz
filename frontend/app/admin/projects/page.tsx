'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AdminLayout } from '../_components/admin-layout';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project, Course } from '@/lib/types';

export default function AdminProjectsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<(Project & { courses?: Course })[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ course_id: '', title: '', description: '', difficulty: 'Undergraduate', price: 5000, tools: 'SPSS', duration: 'Instant Download', learning_outcomes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    Promise.all([
      supabase.from('projects').select('*, courses(name, department_id)').order('created_at', { ascending: false }),
      supabase.from('courses').select('*').order('name'),
    ]).then(([{ data: prjs }, { data: crs }]) => {
      setProjects(prjs ?? []);
      setCourses(crs ?? []);
      setLoading(false);
    });
  }, [user]);

  const startEdit = (p: Project) => { setEditingId(p.id); setEditForm({ title: p.title, description: p.description, price: p.price, difficulty: p.difficulty }); };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('projects').update(editForm).eq('id', id);
    if (error) { toast.error('Update failed'); setSaving(false); return; }
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...editForm } : p));
    setEditingId(null);
    toast.success('Project updated');
    setSaving(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    const supabase = createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { toast.error('Delete failed'); return; }
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Project deleted');
  };

  const addProject = async () => {
    if (!addForm.course_id || !addForm.title.trim()) { toast.error('Course and title are required'); return; }
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('projects').insert({
      course_id: addForm.course_id,
      title: addForm.title.trim(),
      description: addForm.description.trim(),
      difficulty: addForm.difficulty,
      price: Number(addForm.price),
      tools: addForm.tools.split(',').map(t => t.trim()).filter(Boolean),
      duration: addForm.duration,
      learning_outcomes: addForm.learning_outcomes.split('\n').map(l => l.trim()).filter(Boolean),
    }).select('*, courses(name)').single();
    if (error) { toast.error('Failed to add project'); setSaving(false); return; }
    setProjects(prev => [data, ...prev]);
    setShowAdd(false);
    setAddForm({ course_id: '', title: '', description: '', difficulty: 'Undergraduate', price: 5000, tools: 'SPSS', duration: 'Instant Download', learning_outcomes: '' });
    toast.success('Project added');
    setSaving(false);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <AdminLayout title="Projects" subtitle={`${projects.length} total projects`}>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowAdd(!showAdd)} size="sm">
          <Plus size={15} className="mr-1.5" />{showAdd ? 'Cancel' : 'Add Project'}
        </Button>
      </div>

      {showAdd && (
        <div className="clay p-6 mb-6">
          <h3 className="font-semibold mb-4">Add New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Course *</label>
              <select value={addForm.course_id} onChange={e => setAddForm(f => ({ ...f, course_id: e.target.value }))}
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Select course...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Title *</label>
              <input value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title"
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium mb-1 block">Description</label>
              <input value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description"
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Difficulty</label>
              <select value={addForm.difficulty} onChange={e => setAddForm(f => ({ ...f, difficulty: e.target.value }))}
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Undergraduate</option>
                <option>Postgraduate</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Price (₦)</label>
              <input type="number" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: Number(e.target.value) }))}
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Tools (comma-separated)</label>
              <input value={addForm.tools} onChange={e => setAddForm(f => ({ ...f, tools: e.target.value }))} placeholder="SPSS, Excel"
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Duration</label>
              <input value={addForm.duration} onChange={e => setAddForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium mb-1 block">Learning Outcomes (one per line)</label>
              <textarea value={addForm.learning_outcomes} onChange={e => setAddForm(f => ({ ...f, learning_outcomes: e.target.value }))} rows={3} placeholder="One outcome per line..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={addProject} disabled={saving} size="sm">{saving ? 'Adding...' : 'Add Project'}</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)} size="sm">Cancel</Button>
          </div>
        </div>
      )}

      <div className="clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Course</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Difficulty</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 max-w-[250px]">
                    {editingId === p.id ? (
                      <input value={editForm.title ?? ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full h-8 px-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                    ) : <p className="truncate font-medium">{p.title}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{(p as any).courses?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <select value={editForm.difficulty ?? ''} onChange={e => setEditForm(f => ({ ...f, difficulty: e.target.value }))}
                        className="h-8 px-2 rounded-lg border border-border bg-input text-xs focus:outline-none">
                        <option>Undergraduate</option><option>Postgraduate</option>
                      </select>
                    ) : <span className="text-xs">{p.difficulty}</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-accent">
                    {editingId === p.id ? (
                      <input type="number" value={editForm.price ?? 0} onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))}
                        className="w-24 h-8 px-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                    ) : `₦${p.price.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {editingId === p.id ? (
                        <>
                          <button onClick={() => saveEdit(p.id)} disabled={saving} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"><Check size={13} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"><X size={13} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Pencil size={13} /></button>
                          <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No projects found</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
