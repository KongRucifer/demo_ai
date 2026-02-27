import { useCandidates } from "@/hooks/use-candidates";
import { Link } from "wouter";
import { format } from "date-fns";
import { AppLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { ScoreRing } from "@/components/score-ring";
import { 
  Users, 
  UserCheck, 
  BrainCircuit, 
  ChevronRight,
  TrendingUp,
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const { data: candidates, isLoading } = useCandidates();

  const stats = [
    {
      title: "Total Candidates",
      value: candidates?.length || 0,
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      title: "Shortlisted",
      value: candidates?.filter(c => c.analysis?.status === 'Pass').length || 0,
      icon: UserCheck,
      trend: "+5%",
      trendUp: true,
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    },
    {
      title: "Avg Match Score",
      value: candidates?.length ? Math.round(candidates.reduce((acc, c) => acc + (c.analysis?.matchingScore || 0), 0) / candidates.length) + "%" : "0%",
      icon: BrainCircuit,
      trend: "+2.4%",
      trendUp: true,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
    }
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Recruitment Overview</h1>
            <p className="text-slate-500 mt-1">Real-time candidate analytics and AI screening results.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-700'}`}>
                  {stat.trendUp && <TrendingUp className="h-3 w-3 mr-1" />}
                  {stat.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-display font-bold mt-1 text-foreground">{isLoading ? "-" : stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Table Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-display font-bold">Recent Candidates</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter candidates..." 
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <button className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium flex items-center gap-2 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">AI Match Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p>Loading candidates...</p>
                      </div>
                    </td>
                  </tr>
                ) : candidates?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No candidates found. <Link href="/apply" className="text-primary hover:underline">Submit an application</Link> to see data.
                    </td>
                  </tr>
                ) : (
                  candidates?.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">
                              {candidate.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{candidate.fullName}</p>
                            <p className="text-xs text-muted-foreground">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {candidate.appliedAt ? format(new Date(candidate.appliedAt), 'MMM d, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ScoreRing score={candidate.analysis?.matchingScore} size={36} strokeWidth={3} />
                          <div className="flex-1 w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${candidate.analysis?.matchingScore || 0}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                (candidate.analysis?.matchingScore || 0) >= 80 ? 'bg-emerald-500' : 
                                (candidate.analysis?.matchingScore || 0) >= 60 ? 'bg-primary' : 'bg-amber-500'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={candidate.analysis?.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/candidates/${candidate.id}`}
                          className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
