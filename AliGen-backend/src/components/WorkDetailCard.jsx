import { workRoleWithoutDates } from "../utils/workText";

export default function WorkDetailCard({ title, summary }) {
  const company = title?.trim() || "Untitled";
  const raw = summary?.trim() || "";
  const roleNoDates = workRoleWithoutDates(raw);

  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl overflow-hidden text-white">
      <div className="relative min-h-[5.5rem] sm:min-h-[6rem] bg-gradient-to-br from-emerald-900/70 via-slate-800/80 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="relative px-4 sm:px-5 py-4 flex flex-col justify-center">
          <div className="font-bold text-base sm:text-lg leading-snug text-balance">
            {company}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[0.8125rem] sm:text-sm text-white/90 leading-relaxed whitespace-pre-wrap text-pretty">
          {roleNoDates || "No role details added for this entry yet."}
        </p>
      </div>
    </div>
  );
}
