/**
 * TreeGuard API Client
 * Connects the frontend to the backend API
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// Trees
export const treesApi = {
  list: (params?: { status?: string; zone?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.zone) qs.set("zone", params.zone);
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<any>(`/trees?${qs.toString()}`);
  },
  get: (idOrCode: string | number) => apiFetch<any>(`/trees/${idOrCode}`),
  create: (data: any) => apiFetch<any>("/trees", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/trees/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// Custody
export const custodyApi = {
  assign: (data: { treeId: number; custodianId: number; expiryDate: string; notes?: string }) =>
    apiFetch<any>("/custody/assign", { method: "POST", body: JSON.stringify(data) }),
  getCandidates: (treeId: number) => apiFetch<any>(`/custody/candidates/${treeId}`),
  initiateHandoff: (data: { treeId: number; previousCustodianId: number; newCustodianId?: number; reason: string }) =>
    apiFetch<any>("/custody/handoff/initiate", { method: "POST", body: JSON.stringify(data) }),
  acceptHandoff: (data: { handoffId: number; pledgeAccepted: boolean; expiryDate?: string }) =>
    apiFetch<any>("/custody/handoff/accept", { method: "POST", body: JSON.stringify(data) }),
};

// Checkpoints & Verification
export const checkpointsApi = {
  submit: (data: any) => apiFetch<any>("/checkpoints", { method: "POST", body: JSON.stringify(data) }),
  analyze: (data: { plantingPhotoUrl: string; checkpointPhotoUrl: string; species: string; plantingDate: string }) =>
    apiFetch<any>("/verification/analyze", { method: "POST", body: JSON.stringify(data) }),
};

// Maintenance
export const maintenanceApi = {
  log: (data: { treeId: number; custodianId: number; actionType: string; notes?: string; photoUrl?: string }) =>
    apiFetch<any>("/maintenance", { method: "POST", body: JSON.stringify(data) }),
};

// Dashboard
export const dashboardApi = {
  getMetrics: () => apiFetch<any>("/dashboard"),
};

// Risks
export const risksApi = {
  list: () => apiFetch<any>("/risks"),
  resolve: (id: number) => apiFetch<any>(`/risks/${id}/resolve`, { method: "POST" }),
};

// Notifications
export const notificationsApi = {
  list: () => apiFetch<any>("/notifications"),
};

// Users & Organizations
export const usersApi = {
  list: (role?: string) => apiFetch<any>(`/users${role ? `?role=${role}` : ""}`),
};

export const organizationsApi = {
  list: () => apiFetch<any>("/organizations"),
};

// Demo
export const demoApi = {
  timeTravel: (action: string) => apiFetch<any>("/demo/time-travel", { method: "POST", body: JSON.stringify({ action }) }),
};

// Failure Autopsy
export const autopsyApi = {
  create: (data: any) => apiFetch<any>("/failure-autopsy", { method: "POST", body: JSON.stringify(data) }),
};
