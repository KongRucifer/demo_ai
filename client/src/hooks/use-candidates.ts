import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Define the shape based on our backend schema projection
export interface CandidateAnalysis {
  id: number;
  extractedSkills: string[] | null;
  matchingScore: number | null;
  aiSummary: string | null;
  status: string | null;
}

export interface CandidateDocument {
  id: number;
  filePath: string;
  fileType: string;
  rawText: string | null;
}

export interface CandidateWithAnalysis {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  appliedAt: string | null;
  document: CandidateDocument | null;
  analysis: CandidateAnalysis | null;
}

export function useCandidates() {
  return useQuery({
    queryKey: [api.candidates.list.path],
    queryFn: async () => {
      const res = await fetch(api.candidates.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      return data as CandidateWithAnalysis[];
    },
  });
}

export function useCandidate(id: number) {
  return useQuery({
    queryKey: [api.candidates.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.candidates.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch candidate");
      const data = await res.json();
      return data as CandidateWithAnalysis;
    },
    enabled: !!id,
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Using native fetch because we need the browser to set the multipart/form-data boundary automatically
      const res = await fetch(api.candidates.create.path, {
        method: api.candidates.create.method,
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to submit application" }));
        throw new Error(errorData.message || "Failed to submit application");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path] });
    },
  });
}

export function useAnalyzeCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { documentId: number; rawText: string }) => {
      const res = await fetch(api.analyze.create.path, {
        method: api.analyze.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to trigger analysis");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.candidates.get.path] });
    },
  });
}
