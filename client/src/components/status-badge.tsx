import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <Badge variant="outline" className="text-slate-500">Pending</Badge>;

  const s = status.toLowerCase();
  
  if (s === 'pass' || s === 'hired' || s === 'shortlist') {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
        {status}
      </Badge>
    );
  }
  
  if (s === 'fail' || s === 'rejected') {
    return (
      <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 border-0">
        {status}
      </Badge>
    );
  }

  return (
    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-0">
      {status}
    </Badge>
  );
}
