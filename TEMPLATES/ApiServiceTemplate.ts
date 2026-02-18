import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * TEMPLATE: API Service Layer
 *
 * ADAPT THIS:
 * 1. Update BASE_URL for your environment
 * 2. Change Entity type reference
 * 3. Update endpoint paths
 * 4. Add custom API methods
 * 5. Configure authentication if needed
 */

// CONFIGURATION
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Types (import from your types file)
interface Entity {
  id?: number;
  name: string;
  description?: string;
  status: string;
  createdAt?: string;
}

// Create axios instance with defaults
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor (add auth token, logging, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request (optional)
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (error handling, logging, etc.)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.status);
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      switch (status) {
        case 401:
          console.error('Unauthorized - please log in');
          // Redirect to login or clear token
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error:', message);
          break;
        default:
          console.error(`Error ${status}:`, message);
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// GENERIC API SERVICE
class ApiService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // GET ALL
  async getAll(params?: Record<string, any>): Promise<AxiosResponse<T[]>> {
    return apiClient.get<T[]>(this.endpoint, { params });
  }

  // GET BY ID
  async getById(id: number): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(`${this.endpoint}/${id}`);
  }

  // CREATE
  async create(data: Partial<T>): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(this.endpoint, data);
  }

  // UPDATE (full)
  async update(id: number, data: Partial<T>): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(`${this.endpoint}/${id}`, data);
  }

  // PATCH (partial update)
  async patch(id: number, data: Partial<T>): Promise<AxiosResponse<T>> {
    return apiClient.patch<T>(`${this.endpoint}/${id}`, data);
  }

  // DELETE
  async delete(id: number): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // CUSTOM QUERY
  async query(path: string, params?: Record<string, any>): Promise<AxiosResponse<T[]>> {
    return apiClient.get<T[]>(`${this.endpoint}/${path}`, { params });
  }
}

// ENTITY-SPECIFIC APIS
export class EntityApi extends ApiService<Entity> {
  constructor() {
    super('/entities');  // CHANGE THIS
  }

  // Custom methods for this entity

  async getByStatus(status: string): Promise<AxiosResponse<Entity[]>> {
    return this.getAll({ status });
  }

  async getByUserId(userId: number): Promise<AxiosResponse<Entity[]>> {
    return this.query(`user/${userId}`);
  }

  async updateStatus(id: number, status: { status: string }): Promise<AxiosResponse<Entity>> {
    return apiClient.patch<Entity>(`${this.endpoint}/${id}/status`, status);
  }

  async search(keyword: string): Promise<AxiosResponse<Entity[]>> {
    return this.getAll({ search: keyword });
  }

  async getByDateRange(startDate: string, endDate: string): Promise<AxiosResponse<Entity[]>> {
    return this.query('date-range', { startDate, endDate });
  }
}

// EXPORT API INSTANCES
export const entityApi = new EntityApi();

// UTILITY FUNCTIONS
export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data?.message || `Error ${error.response.status}`;
  } else if (error.request) {
    return 'Network error - please check your connection';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// FILE UPLOAD HELPER
export const uploadFile = async (
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  return apiClient.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// BATCH OPERATIONS
export const batchCreate = async <T>(
  endpoint: string,
  items: Partial<T>[]
): Promise<AxiosResponse<T[]>> => {
  return apiClient.post<T[]>(`${endpoint}/batch`, items);
};

export const batchDelete = async (
  endpoint: string,
  ids: number[]
): Promise<AxiosResponse<void>> => {
  return apiClient.delete<void>(`${endpoint}/batch`, { data: { ids } });
};

// EXPORT AXIOS INSTANCE (for custom calls)
export default apiClient;

/**
 * USAGE EXAMPLES:
 *
 * // In your component:
 * import { entityApi, handleApiError } from './services/api';
 *
 * // Get all
 * const response = await entityApi.getAll();
 * const entities = response.data;
 *
 * // Get with filters
 * const response = await entityApi.getByStatus('ACTIVE');
 *
 * // Create
 * const newEntity = { name: 'Test', status: 'ACTIVE' };
 * const response = await entityApi.create(newEntity);
 *
 * // Update
 * const updated = { ...entity, name: 'Updated Name' };
 * await entityApi.update(entity.id, updated);
 *
 * // Delete
 * await entityApi.delete(entity.id);
 *
 * // Error handling
 * try {
 *   await entityApi.getAll();
 * } catch (error) {
 *   const message = handleApiError(error);
 *   console.error(message);
 * }
 */