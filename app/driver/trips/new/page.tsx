import { redirect } from "next/navigation";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";
import { TripForm } from "./TripForm";

export default async function NewTripPage() {
  const labour = await requireLabourSession();
  const supabase = createSupabaseServiceRoleClient();
  const { data: session } = await supabase
    .from("vehicle_sessions")
    .select("id, truck_id, opening_odometer, trucks(registration_number)")
    .eq("labour_id", labour.id)
    .eq("status", "OPEN")
    .maybeSingle();

  if (!session) {
    redirect("/driver/select-truck");
  }

  const truck = session.trucks as unknown as { registration_number: string };

  return (
    <div className="mx-auto max-w-xl pb-10">
      <div className="mb-6 rounded-[28px] border border-slate-700 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/25 ring-1 ring-white/5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-400/80">
          Trip log
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Log a Trip</h1>
        <p className="mt-2 text-sm text-slate-300">
          Recording trip for <span className="font-semibold text-white">{truck?.registration_number}</span>
        </p>
      </div>

      <TripForm vehicleSessionId={session.id} startOdometer={Number(session.opening_odometer)} />
    </div>
  );
}
