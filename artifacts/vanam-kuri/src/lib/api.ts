/**
 * TreeGuard / Pasumai Kaval API Client
 * Connects the frontend to the backend Express / PostgreSQL API
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem("pasumai_auth_token");
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem("pasumai_auth_token", token);
    } else {
      localStorage.removeItem("pasumai_auth_token");
    }
  } catch {
    // Ignore storage errors
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// Authentication API
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: "custodian" | "verifier" | "admin" | string;
    organization?: string;
    location?: string;
  }) => apiFetch<{ success: boolean; token: string; user: any }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  login: (data: {
    identifier?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: string;
  }) => apiFetch<{ success: boolean; token: string; user: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  getMe: () => apiFetch<{ user: any }>("/auth/me"),

  listUsers: (role?: string) => apiFetch<{ users: any[] }>(`/users${role ? `?role=${role}` : ""}`),
};

// Image Upload API
export const uploadApi = {
  uploadImage: async (imagePayload: string, fileName?: string, contentType?: string) => {
    return apiFetch<{ success: boolean; url: string; fileName: string; sizeBytes: number }>("/upload", {
      method: "POST",
      body: JSON.stringify({
        image: imagePayload,
        fileName,
        contentType,
      }),
    });
  },
};

// Trees API
export const treesApi = {
  list: (params?: { status?: string; zone?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.zone) qs.set("zone", params.zone);
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<{ trees: any[]; total: number }>(`/trees?${qs.toString()}`);
  },
  get: (idOrCode: string | number) => apiFetch<any>(`/trees/${idOrCode}`),
  create: (data: any) => apiFetch<any>("/trees", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/trees/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// Custody API
export const custodyApi = {
  assign: (data: { treeId: number; custodianId: number; expiryDate: string; notes?: string }) =>
    apiFetch<any>("/custody/assign", { method: "POST", body: JSON.stringify(data) }),
  getCandidates: (treeId: number) => apiFetch<any>(`/custody/candidates/${treeId}`),
  initiateHandoff: (data: { treeId: number; previousCustodianId: number; newCustodianId?: number; reason: string }) =>
    apiFetch<any>("/custody/handoff/initiate", { method: "POST", body: JSON.stringify(data) }),
  acceptHandoff: (data: { handoffId: number; pledgeAccepted: boolean; expiryDate?: string }) =>
    apiFetch<any>("/custody/handoff/accept", { method: "POST", body: JSON.stringify(data) }),
};

// Checkpoints & Verification API
export const checkpointsApi = {
  submit: (data: any) => apiFetch<any>("/checkpoints", { method: "POST", body: JSON.stringify(data) }),
  analyze: (data: { plantingPhotoUrl: string; checkpointPhotoUrl: string; species: string; plantingDate: string }) =>
    apiFetch<any>("/verification/analyze", { method: "POST", body: JSON.stringify(data) }),
};

// Maintenance API
export const maintenanceApi = {
  log: (data: { treeId: number; custodianId: number; actionType: string; notes?: string; photoUrl?: string }) =>
    apiFetch<any>("/maintenance", { method: "POST", body: JSON.stringify(data) }),
};

// Dashboard API
export const dashboardApi = {
  getMetrics: () => apiFetch<any>("/dashboard"),
  getReliability: () => apiFetch<any>("/dashboard/reliability"),
  getRisks: () => apiFetch<any>("/dashboard/risks"),
  getDeadTrees: () => apiFetch<any>("/dashboard/dead-trees"),
};

// Risk Center API
export const risksApi = {
  list: () => apiFetch<any>("/risks"),
  resolve: (id: number) => apiFetch<any>(`/risks/${id}/resolve`, { method: "POST" }),
};

// Notifications API
export const notificationsApi = {
  list: () => apiFetch<any>("/notifications"),
};

// Organizations API
export const organizationsApi = {
  list: () => apiFetch<any>("/organizations"),
};

// Failure Autopsy API
export const autopsyApi = {
  create: (data: {
    treeId: number | string;
    primaryCause: string;
    contributingFactors?: string[] | string;
    classification?: string;
    autopsyNotes?: string;
    preventiveLesson?: string;
    reportedBy?: number | string;
  }) => apiFetch<any>("/failure-autopsy", { method: "POST", body: JSON.stringify(data) }),
};
