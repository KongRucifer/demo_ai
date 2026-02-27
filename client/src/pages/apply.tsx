import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { useCreateCandidate } from "@/hooks/use-candidates";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Banknote, 
  UploadCloud, 
  FileText, 
  X, 
  ArrowRight,
  Loader2
} from "lucide-react";

const applySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
});

type ApplyFormValues = z.infer<typeof applySchema>;

export default function ApplyJob() {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: createCandidate, isPending } = useCreateCandidate();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const onSubmit = (data: ApplyFormValues) => {
    if (!file) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume in PDF format.",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("resume", file);

    createCandidate(formData, {
      onSuccess: () => {
        toast({
          title: "Application Submitted!",
          description: "Your application has been received and is being processed by our AI.",
        });
        setLocation("/");
      },
      onError: (err) => {
        toast({
          title: "Submission Failed",
          description: err.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mb-8 text-center sm:text-left"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Urgently Hiring
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground mb-4">Senior Fullstack Engineer</h1>
        
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            <Building2 className="h-4 w-4" /> TechCorp Inc.
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            <MapPin className="h-4 w-4" /> Remote / Hybrid
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            <Banknote className="h-4 w-4" /> $120k - $160k
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl bg-card rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden"
      >
        <div className="h-2 w-full bg-gradient-to-r from-primary to-indigo-400"></div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold border-b border-border pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name <span className="text-destructive">*</span></label>
                <input 
                  {...register("fullName")}
                  className={`w-full h-12 px-4 rounded-xl border ${errors.fullName ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                  placeholder="Jane Doe"
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address <span className="text-destructive">*</span></label>
                <input 
                  {...register("email")}
                  type="email"
                  className={`w-full h-12 px-4 rounded-xl border ${errors.email ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold">Phone Number <span className="text-destructive">*</span></label>
                <input 
                  {...register("phone")}
                  type="tel"
                  className={`w-full h-12 px-4 rounded-xl border ${errors.phone ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold border-b border-border pb-2">Resume / CV</h3>
            
            {!file ? (
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <input {...getInputProps()} />
                <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-border flex items-center justify-center mb-4 text-primary">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PDF only (max 5MB)</p>
              </div>
            ) : (
              <div className="border border-border rounded-2xl p-4 flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Submit Application <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
