/**
 * Type-safe API client for Hyperion-Flux backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, ...fetchConfig } = config;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      url += `?${queryString}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.headers) {
      Object.assign(headers, config.headers);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Request failed',
        response.status,
        errorData.code,
        errorData.details
      );
    }

    return response.json();
  }

  // Auth endpoints
  auth = {
    login: (email: string, password: string) =>
      this.request<{ accessToken: string; refreshToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (email: string, password: string) =>
      this.request<{ accessToken: string; refreshToken: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    refresh: (refreshToken: string) =>
      this.request<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),
    
    me: () =>
      this.request<any>('/auth/me'),
    
    logout: () =>
      this.request('/auth/logout', {
        method: 'POST',
      }),
  };

  // Modules endpoints
  modules = {
    list: (params?: { status?: string; category?: string }) =>
      this.request<any[]>('/modules', { params }),
    
    get: (id: string) =>
      this.request<any>(`/modules/${id}`),
    
    create: (data: any) =>
      this.request<any>('/modules', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      this.request<any>(`/modules/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(`/modules/${id}`, {
        method: 'DELETE',
      }),
  };

  // Simulations endpoints
  simulations = {
    list: () =>
      this.request<any[]>('/simulations'),
    
    get: (id: string) =>
      this.request<any>(`/simulations/${id}`),
    
    create: (data: any) =>
      this.request<any>('/simulations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    start: (id: string) =>
      this.request<any>(`/simulations/${id}/start`, {
        method: 'POST',
      }),
    
    stop: (id: string) =>
      this.request<any>(`/simulations/${id}/stop`, {
        method: 'POST',
      }),
    
    events: (id: string) =>
      this.request<any[]>(`/simulations/${id}/events`),
  };

  // Security endpoints
  security = {
    risks: {
      list: () => this.request<any[]>('/security/risks'),
      get: (id: string) => this.request<any>(`/security/risks/${id}`),
      create: (data: any) => this.request<any>('/security/risks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      update: (id: string, data: any) => this.request<any>(`/security/risks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    },
    controls: {
      list: () => this.request<any[]>('/security/controls'),
    },
    dashboard: () => this.request<any>('/security/dashboard'),
  };

  // Roadmap endpoints
  roadmap = {
    stages: {
      list: () => this.request<any[]>('/roadmap/stages'),
      get: (id: string) => this.request<any>(`/roadmap/stages/${id}`),
    },
    tasks: {
      list: (params?: { stageId?: string; status?: string }) =>
        this.request<any[]>('/roadmap/tasks', { params }),
      create: (data: any) => this.request<any>('/roadmap/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      update: (id: string, data: any) => this.request<any>(`/roadmap/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    },
  };

  // Architecture endpoints
  architecture = {
    graph: () => this.request<any>('/architecture/graph'),
    components: {
      list: () => this.request<any[]>('/architecture/components'),
      get: (id: string) => this.request<any>(`/architecture/components/${id}`),
    },
  };

  // Billing endpoints
  billing = {
    plans: () => this.request<any[]>('/payments/plans'),
    subscription: () => this.request<any>('/payments/subscription'),
    createCheckout: (planId: string) => this.request<{ url: string }>('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
    createUSDTPayment: (planId: string) => this.request<any>('/payments/usdt/create', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
    verifyUSDTPayment: (paymentId: string, txHash: string) => this.request<any>('/payments/usdt/verify', {
      method: 'POST',
      body: JSON.stringify({ paymentId, txHash }),
    }),
  };

  // AI endpoints
  ai = {
    chat: (message: string, context?: any) => this.request<any>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
    analyze: (type: string, data: any) => this.request<any>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ type, data }),
    }),
    securityAnalysis: (riskId: string) => this.request<any>(`/ai/security/${riskId}`, {
      method: 'POST',
    }),
    architectureAnalysis: (componentId: string) => this.request<any>(`/ai/architecture/${componentId}`, {
      method: 'POST',
    }),
    aptSimulation: (scenario: string) => this.request<any>('/ai/apt/simulate', {
      method: 'POST',
      body: JSON.stringify({ scenario }),
    }),
    complianceCheck: (framework: string) => this.request<any>('/ai/compliance/check', {
      method: 'POST',
      body: JSON.stringify({ framework }),
    }),
    devsecopsAdvice: (repoUrl?: string) => this.request<any>('/ai/devsecops/advice', {
      method: 'POST',
      body: JSON.stringify({ repoUrl }),
    }),
  };

  // Tenants endpoints
  tenants = {
    list: () => this.request<any[]>('/tenants'),
    get: (id: string) => this.request<any>(`/tenants/${id}`),
    create: (data: any) => this.request<any>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => this.request<any>(`/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  };

  // Notifications endpoints
  notifications = {
    list: () => this.request<any[]>('/notifications'),
    markRead: (id: string) => this.request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
    markAllRead: () => this.request<any>('/notifications/read-all', {
      method: 'PATCH',
    }),
  };

  // Audit logs endpoints
  auditLogs = {
    list: (params?: { action?: string; resourceType?: string }) =>
      this.request<any[]>('/audit-logs', { params }),
  };

  // Hypervisor endpoints
  hypervisor = {
    dashboard: () => this.request<any>('/hypervisor/dashboard'),
    tenants: () => this.request<any[]>('/hypervisor/tenants'),
    users: () => this.request<any[]>('/hypervisor/users'),
    impersonate: (userId: string) => this.request<{ token: string }>('/hypervisor/impersonate', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
    analytics: () => this.request<any>('/hypervisor/analytics'),
  };

  // Findings endpoints
  findings = {
    list: () => this.request<any[]>('/findings'),
    get: (id: string) => this.request<any>(`/findings/${id}`),
    create: (data: any) => this.request<any>('/findings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => this.request<any>(`/findings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  };

  // Compliance endpoints
  compliance = {
    frameworks: () => this.request<any[]>('/compliance/frameworks'),
    check: (framework: string) => this.request<any>('/compliance/check', {
      method: 'POST',
      body: JSON.stringify({ framework }),
    }),
  };

  // DevSecOps endpoints
  devsecops = {
    scan: (repoUrl?: string) => this.request<any>('/devsecops/scan', {
      method: 'POST',
      body: JSON.stringify({ repositoryUrl: repoUrl }),
    }),
    reports: () => this.request<any[]>('/devsecops/reports'),
  };
}

export const apiClient = new ApiClient(API_BASE_URL);
