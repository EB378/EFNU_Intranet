
//Profiles
export interface ProfileData {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  avatar_url?: string;
  ratings: string[];
  license?: string;
  role: "admin" | "pilot" | "staff" | "organisation";
  status: "active" | "pending" | "suspended";
  updated_at: string;
  created_at: string;
  presaved: string[];
  quick_nav?:string[];
  aircraft: string[];
  public: string;
}


export interface OrganisationData {
  id: string;
  name: string;
  aircraft: string[];
  members: string[];
  created_by: string;
  updated_at: string;
  created_at: string;
}

export interface AircraftData {
  id: string;
  mtow: number;
  created_by: string;
  updated_at: string;
  created_at: string;
}

// Fuels

export interface FuelOption {
  id: string;
  label: string;
  capacity?: number;
  remaining?: number;
  price?: number;
  value: string;
  color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  lastFueling?: Date;
  remarks?: string;
  updated_at: string;
  created_at: string;
  last_fuel_tank_refueling?: string;
}

// Fuelings

export interface FuelingValues {
  id: string;
  aircraft: string;
  amount: number;
  fuel: string;
  uid: string;
  created_at: string;
  price: number;
  billed_to: string;
  billed_to_type: string;
}
export interface FuelItem extends FuelingValues {
  id: string;
  created_at: string;
}
export interface ProcessedFuelData {
    month: string;
    amount: number;
}
export interface FuelStats {
    totalYTD: number;
    currentMonth: number;
    monthlyAverage: number;
}
export interface FuelTypeUsage {
  name: string;
  total: number;
  color: string;
}



// Prior Notice

export interface PriorNotice {
    id: string;
    uid: string;
    aircraft: string;
    pic_name: string;
    dep_time?: string;
    arr_time?: string;
    dof: string;
    mtow: number;
    status: string;
    created_at: string;
    updated_at: string;
    ifr_arrival: boolean;
    billable: string;
}
  
  



// SMS

export type ReportStatus = 'open' | 'in-progress' | 'resolved';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ReportCategory = 'inflight' | 'infrastructure' | 'aircraft' | 'medical' | 'security' | 'enviromental' | 'communication' | 'other';

export interface SafetyReport {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  severity: SeverityLevel;
  reported_by: string;
  reported_at: string;
  resolved_at?: string;
  location?: string;
  comments?: string;
}

export interface CreateSafetyReport {
  title: string;
  description: string;
  category: ReportCategory;
  severity: SeverityLevel;
  location?: string;
}

export interface UpdateSafetyReport {
  title?: string;
  description?: string;
  category?: ReportCategory;
  status?: ReportStatus;
  severity?: SeverityLevel;
  resolved_at?: string;
  location?: string;
  comments?: string;
}

// Blog

export type Blog = {
  id: string;
  title: string;
  content: string;
  image_link: string | null;
  published_at: string | null;
  created_at: string;
  uid: string;
  updated_at: string;
  published: boolean;
};

// types/index.ts
export interface AlertItem {
  id: string;
  title: string;
  description: string;
  alert_type: 'emergency' | 'warning' | 'info' | 'ongoing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  start_time: string; // ISO string
  end_time?: string; // ISO string
  is_active: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
}


export type QuickButton = {
  icon: React.ReactElement;
  label: string;
  path: string;
  name: string;
};

export interface LocalBlog extends Blog {
  category: string;
  categoryColor?: string;
  excerpt: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  is_all_day: boolean;
  description?: string;
  location?: string;
  event_type: string;
  status: string;
  timezone: string;
  organizer_id: string;
}