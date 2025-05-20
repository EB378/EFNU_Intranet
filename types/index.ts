
//Profiles
export interface ProfileData {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  avatar_url?: string;
  ratings: string[];
  licence?: string;
  role: "admin" | "pilot" | "staff";
  status: "active" | "pending" | "suspended";
  updated_at: string;
  created_at: string;
}


// Fuels

export type FuelOption = {
  label: string;
  capacity?: number;
  remaining?: number;
  price?: number;
  value: string;
  icon: JSX.Element;
  color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  remarks?: string;
  updated_at: string;
  created_at: string;
}


// Fuelings

export interface FuelingValues {
  aircraft: string;
  amount: number;
  fuel: string;
  uid: string;
  created_at: string;
  price: number;
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



// Prior Notice

export interface PriorNotice {
    id: string;
    uid: string;
    aircraft_reg: string;
    pic_name: string;
    dep_time: string;
    arr_time: string;
    dep_date: string;
    arr_date: string;
    from_location: string;
    to_location: string;
    mtow: number;
    status: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
    ifr_arrival: boolean;
}
  
  



// SMS

// Blog

