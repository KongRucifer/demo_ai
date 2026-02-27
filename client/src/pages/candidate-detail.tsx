import { useRoute } from "wouter";
import { useCandidate, useAnalyzeCandidate } from "@/hooks/use-candidates";
import { AppLayout } from "@/components/layout";
import { ScoreRing } from "@/components/score-ring";
import { StatusBadge } from "@/components/status-badge";
import { 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  Clock,
  ChevronLeft,
  Sparkles,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function CandidateDetail() {
  const [, params] = useRoute("/candidates/:id");
  const candidateId = params?.id ? parseInt(params.id) : 0;
  
  const { data: candidate, isLoading } = useCandidate(candidateId);
  const { mutate: analyze, isPending: isAnalyzing } = useAnalyzeCandidate();
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!candidate?.document?.id || !candidate?.document?.rawText) {
      toast({
        title: "Cannot analyze",
        description: "Document text is not available for analysis.",
        variant: "destructive"
      });
      return;
    }
    
    analyze(
      { documentId: candidate.document.id, rawText: candidate.document.rawText },
      {
        onSuccess: () => {
          toast({ title: "Analysis Complete", description: "AI has finished reviewing the profile." });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!candidate) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Candidate not found</h2>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">Return to Dashboard</Link>
        </div>
      </AppLayout>
    );
  }

  const hasAnalysis = !!candidate.analysis;
  const initials = candidate.fullName.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm text-center"
            >
              <Avatar className="h-24 w-24 mx-auto border-4 border-primary/10 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-display font-bold text-foreground">{candidate.fullName}</h2>
              <div className="mt-2 flex justify-center">
                <StatusBadge status={candidate.analysis?.status} />
              </div>
              
              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Mail className="h-4 w-4 text-foreground" /></div>
                  <span className="text-sm font-medium text-foreground truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Phone className="h-4 w-4 text-foreground" /></div>
                  <span className="text-sm font-medium text-foreground">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Calendar className="h-4 w-4 text-foreground" /></div>
                  <span className="text-sm font-medium text-foreground">
                    {candidate.appliedAt ? format(new Date(candidate.appliedAt), 'MMMM d, yyyy') : 'Unknown'}
                  </span>
                </div>
              </div>

              {candidate.document && (
                <div className="mt-8 pt-6 border-t border-border">
                  <a 
                    href={`/api/documents/${candidate.document.id}/download`} 
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
                  >
                    <FileText className="h-4 w-4" /> View Original Resume
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: AI Analysis */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header / Score Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div>
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" /> AI Match Analysis
                </h3>
                <p className="text-sm text-muted-foreground mt-1">SmartATS automatically evaluates candidate fit based on job requirements.</p>
              </div>
              
              {hasAnalysis ? (
                <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-2xl border border-border">
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                    <p className="text-xs text-emerald-500 font-bold mt-1 flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Strong Fit
                    </p>
                  </div>
                  <ScoreRing score={candidate.analysis?.matchingScore} size={72} strokeWidth={6} />
                </div>
              ) : (
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  Run AI Screening
                </button>
              )}
            </motion.div>

            {/* Analysis Content */}
            {hasAnalysis ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-6 sm:p-8 border border-indigo-100 dark:border-indigo-900/50">
                  <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Executive Summary
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {candidate.analysis?.aiSummary || "No summary available."}
                  </p>
                </div>

                {/* Skills */}
                <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
                  <h4 className="text-lg font-bold mb-4">Extracted Skills</h4>
                  {candidate.analysis?.extractedSkills && candidate.analysis.extractedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {candidate.analysis.extractedSkills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">No specific skills extracted.</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-border p-12 text-center"
              >
                <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-full mb-4 shadow-sm">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">Pending Evaluation</h4>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This candidate's resume has been received but not yet processed by the SmartATS AI. Run the screening to view skills, summary, and match score.
                </p>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
