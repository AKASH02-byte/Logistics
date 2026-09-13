import type { AppRole } from "@/config/roles";

export interface UserRow {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: AppRole;
  status: "ACTIVE" | "SUSPENDED" | "INVITED";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LabourRow {
  id: string;
  labour_code: string;
  full_name: string;
  phone: string;
  address: string | null;
  licence_number: string | null;
  licence_expiry: string | null;
  joining_date: string;
  language: string;
  status: "ACTIVE" | "ON_LEAVE" | "SUSPENDED" | "EXITED";
  photo_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface VehicleSessionRow {
  id: string;
  labour_id: string;
  truck_id: string;
  status: "OPEN" | "CLOSED" | "FORCE_CLOSED";
  opening_odometer: string;
  closing_odometer: string | null;
  opened_at: string;
  closed_at: string | null;
  closed_by: string | null;
  notes: string | null;
}

export interface TruckRow {
  id: string;
  registration_number: string;
  make: string | null;
  model: string | null;
  status: "ACTIVE" | "IN_MAINTENANCE" | "IDLE" | "RETIRED";
  current_odometer: string;
}
