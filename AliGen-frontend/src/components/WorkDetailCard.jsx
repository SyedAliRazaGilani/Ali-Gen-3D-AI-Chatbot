import { getWorkDetailBullets } from "../utils/workDetailBlurbs";
import { workRoleWithoutDates } from "../utils/workText";

export default function WorkDetailCard({ title, summary }) {
  const company = title?.trim() || "Untitled";
  const raw = summary?.trim() || "";
  const roleNoDates = workRoleWithoutDates(raw);
  const detailBullets = getWorkDetailBullets(company);

  const items = [];
  if (roleNoDates) items.push(roleNoDates);
  items.push(...detailBullets);

  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl overflow-hidden text-white">
      <div className="relative bg-gradient-to-br from-emerald-900/70 via-slate-800/80 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
        <div className="relative px-4 sm:px-5 py-4">
          <div className="font-bold text-base sm:text-lg leading-snug text-balance">
            {company}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {items.length > 0 ? (
          <ul className="list-disc pl-4 space-y-2.5 text-[0.8125rem] sm:text-sm text-white/88 leading-relaxed marker:text-white/45">
            {items.map((line, i) => (
              <li key={i} className="text-pretty pl-0.5">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.8125rem] sm:text-sm text-white/80 leading-relaxed text-pretty">
            No role details added for this entry yet.
          </p>
        )}
      </div>
    </div>
  );
}
