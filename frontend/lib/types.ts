export interface Profile {
  id: string;
  name: string;
  email?: string;
  phone: string | null;
  whatsapp: string | null;
  profile_picture_url: string | null;
  role: 'user' | 'admin';
  enrolled_projects: string[];
  wishlist: string[];
  hours_learned: number;
  certificates: number;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Course {
  id: string;
  department_id: string;
  name: string;
  icon: string;
  difficulty: string;
  tools: string[];
  created_at: string;
}

export interface Project {
  id: string;
  course_id: string;
  title: string;
  description: string;
  difficulty: string;
  price: number;
  tools: string[];
  duration: string;
  learning_outcomes: string[];
  file_url: string | null;
  locked: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  payment_reference: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  rejection_reason: string | null;
  user_name: string | null;
  user_email: string | null;
  user_whatsapp: string | null;
  created_at: string;
  project?: Project;
  profile?: Profile;
}

export interface HireRequest {
  id: string;
  type: 'analyst' | 'researcher';
  name: string;
  email: string;
  phone: string;
  institution: string | null;
  department: string;
  topic: string | null;
  deadline: string | null;
  services: string[] | null;
  research_type: string | null;
  details: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface TrainingRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string | null;
  schedule: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}
