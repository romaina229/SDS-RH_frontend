export interface Tenant {
  id: number;
  name: string;
  emitting_authority?: string;
  email: string;
  phone?: string;
  fax?: string;
  website?: string;
  address?: string;
  logo?: string;
  ifu?: string;
  rccm?: string;
  subscription_plan: string;
  subscription_expires_at?: string;
  is_active: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  tenant_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_photo?: string;
  status: 'active' | 'inactive';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  roles: string[];
  permissions: string[];
  tenant?: Tenant;
  employee?: Employee;
}

export interface BankDetails {
  bank_name?: string;
  account_number?: string;
}

export interface Employee {
  id: number;
  tenant_id: number;
  user_id?: number;
  employee_number: string;
  department_id?: number;
  position_id?: number;
  hire_date: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
  children_count?: number;
  nationality?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  bank_details?: BankDetails;
  social_security?: Record<string, any>;
  status: 'active' | 'on_leave' | 'terminated' | 'suspended';
  terminated_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  department?: Department;
  position?: Position;
  contracts?: Contract[];
  documents?: Document[];
  full_name: string;
}

export interface Department {
  id: number;
  tenant_id: number;
  name: string;
  code?: string;
  description?: string;
  manager_id?: number;
  parent_department_id?: number;
  hierarchy_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manager?: Employee;
  parent?: Department;
  children?: Department[];
  employees?: Employee[];
  employee_count?: number;
}

export interface Position {
  id: number;
  tenant_id: number;
  title: string;
  code?: string;
  corps?: string;
  department_id?: number;
  grade?: string;
  min_salary?: number;
  max_salary?: number;
  description?: string;
  requirements?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Contract {
  id: number;
  tenant_id: number;
  employee_id: number;
  type: 'cdi' | 'cdd' | 'stage' | 'consultant' | 'freelance';
  status: 'active' | 'expired' | 'terminated' | 'pending';
  start_date: string;
  end_date?: string;
  probation_end_date?: string;
  base_salary: number;
  currency: string;
  benefits?: Record<string, any>;
  terms?: string;
  contract_file?: string;
  termination_reason?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  days_remaining?: number;
  is_expiring_soon?: boolean;
}

export interface Leave {
  id: number;
  tenant_id: number;
  employee_id: number;
  approved_by?: number;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'exceptional' | 'unpaid' | 'training';
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  rejection_reason?: string;
  approval_date?: string;
  attachment?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  approver?: User;
}

export interface LeaveBalance {
  id: number;
  tenant_id: number;
  employee_id: number;
  year: number;
  annual_entitled: number;
  annual_taken: number;
  annual_remaining: number;
  sick_entitled: number;
  sick_taken: number;
  sick_remaining: number;
  additional_balances?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: number;
  tenant_id: number;
  employee_id: number;
  date: string;
  clock_in?: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  total_hours?: number;
  overtime_hours?: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'leave';
  method: 'qr_code' | 'face_recognition' | 'manual' | 'badge' | 'mobile';
  qr_code?: string;
  notes?: string;
  location_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface Document {
  id: number;
  tenant_id: number;
  employee_id?: number;
  name: string;
  type: 'contract' | 'diploma' | 'id_card' | 'pay_slip' | 'certificate' | 'cv' | 'photo' | 'medical' | 'other';
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  uploaded_by?: string;
  expiry_date?: string;
  is_confidential: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface PayslipLineItem {
  code: string;
  label: string;
  gain: number | null;
  retenue: number | null;
  rappel: number | null;
  patronal?: boolean;
}

export interface Payroll {
  id: number;
  tenant_id: number;
  employee_id: number;
  qr_token?: string;
  month: string;
  base_salary: number;
  overtime_hours: number;
  overtime_amount: number;
  bonuses: number;
  deductions: number;
  taxes: number;
  social_security: number;
  net_salary: number;
  breakdown?: PayslipLineItem[];
  pay_slip_url?: string;
  status: 'draft' | 'processed' | 'paid';
  paid_at?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  tenant?: Tenant;
}

export interface Recruitment {
  id: number;
  tenant_id: number;
  position_id?: number;
  title: string;
  description: string;
  requirements?: string;
  number_of_positions: number;
  posted_date: string;
  closing_date: string;
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  interview_stages?: Record<string, any>;
  posting_url?: string;
  created_at: string;
  updated_at: string;
  position?: Position;
  candidates?: Candidate[];
}

export interface Candidate {
  id: number;
  tenant_id: number;
  recruitment_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  cv_path?: string;
  cover_letter?: string;
  education?: Record<string, any>;
  experience?: Record<string, any>;
  skills?: Record<string, any>;
  status: 'new' | 'screened' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  feedback?: string;
  expected_salary?: number;
  available_from?: string;
  created_at: string;
  updated_at: string;
  recruitment?: Recruitment;
}

export interface Training {
  id: number;
  tenant_id: number;
  title: string;
  description?: string;
  type: 'internal' | 'external' | 'online' | 'workshop';
  start_date: string;
  end_date: string;
  location?: string;
  trainer?: string;
  cost: number;
  max_participants?: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  objectives?: Record<string, any>;
  created_at: string;
  updated_at: string;
  participants?: TrainingParticipant[];
}

export interface TrainingParticipant {
  id: number;
  tenant_id: number;
  training_id: number;
  employee_id: number;
  status: 'enrolled' | 'in_progress' | 'completed' | 'cancelled';
  score?: number;
  feedback?: string;
  certificate_path?: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  training?: Training;
}

export interface Performance {
  id: number;
  tenant_id: number;
  employee_id: number;
  reviewer_id: number;
  period: string;
  ratings?: Record<string, any>;
  strengths?: string;
  weaknesses?: string;
  achievements?: string;
  goals_achieved?: string;
  recommendations?: string;
  overall_score?: number;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  review_date?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  reviewer?: Employee;
}

export interface Goal {
  id: number;
  tenant_id: number;
  employee_id: number;
  title: string;
  description?: string;
  category?: string;
  target?: number;
  progress: number;
  start_date: string;
  end_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  key_results?: Record<string, any>;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface Notification {
  id: number;
  tenant_id: number;
  user_id?: number;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  link?: string;
  status: 'unread' | 'read';
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  tenant_id: number;
  plan: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  features?: Record<string, any>;
  payment_reference?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: number;
  tenant_id: number;
  name: string;
  date: string;
  country?: string;
  type: 'national' | 'regional' | 'religious';
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DashboardStats {
  total_employees: number;
  total_departments: number;
  active_contracts: number;
  present_today: number;
  absent_today: number;
  pending_leaves: number;
  new_hires: number;
  contracts_expiring: number;
  payroll_total?: number;
}