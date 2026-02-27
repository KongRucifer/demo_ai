import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Briefcase,
  Bell,
  Search,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/apply", icon: Briefcase, label: "Job Portal" },
    // Mock links for visual completeness
    { href: "#", icon: Users, label: "Candidates" },
    { href: "#", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-primary">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">SmartATS</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src="https://i.pravatar.cc/150?u=hr" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">HR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">Sarah Jenkins</span>
              <span className="text-xs text-slate-500 mt-1">HR Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates, skills, or jobs..." 
                className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="h-10 w-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-white dark:border-slate-900"></span>
            </button>
            <Link 
              href="/apply" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Post a Job
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
