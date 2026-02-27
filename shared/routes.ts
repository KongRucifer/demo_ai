import { z } from 'zod';
import { insertCandidateSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  candidates: {
    list: {
      method: 'GET' as const,
      path: '/api/candidates' as const,
      responses: {
        200: z.array(z.any()), // array of CandidateWithAnalysis
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/candidates/:id' as const,
      responses: {
        200: z.any(), // CandidateWithAnalysis
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/candidates' as const,
      // Input is FormData (multipart/form-data), so we can't type check with Zod on frontend easily.
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
      },
    },
  },
  analyze: {
    create: {
      method: 'POST' as const,
      path: '/api/analyze' as const,
      input: z.object({ documentId: z.number(), rawText: z.string() }),
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
