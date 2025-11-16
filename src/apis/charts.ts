import { AxiosInstance } from 'axios';
import {
  ChartDefinitionCreate,
  ChartDefinitionRecord,
  ChartCreate,
  ChartUpdate,
  ChartRecord,
  ChartListResponse,
} from '../types';

export interface ChartApi {
  create(data: ChartDefinitionCreate): Promise<ChartDefinitionRecord>;
  list(
    query?: string,
    chart_type?: string,
    page?: number,
    page_size?: number
  ): Promise<ChartListResponse | ChartDefinitionRecord[]>;
  get(id: string): Promise<ChartRecord>;
  update(id: string, data: ChartUpdate): Promise<ChartRecord>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<ChartRecord>;
  // Legacy method for backward compatibility
  createChart(data: ChartCreate): Promise<ChartRecord>;
}

export function createChartApi(axios: AxiosInstance): ChartApi {
  return {
    async create(data) {
      const response = await axios.post<ChartDefinitionRecord>('/v1/charts', data);
      return response.data;
    },

    async list(query, chart_type, page = 1, page_size = 20) {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (chart_type) params.append('chart_type', chart_type);
      // Note: Backend may not support pagination yet, so we include these but they may be ignored
      params.append('page', page.toString());
      params.append('page_size', page_size.toString());

      const response = await axios.get<ChartDefinitionRecord[] | ChartListResponse>(
        `/v1/charts?${params.toString()}`
      );
      
      // Handle both list response and paginated response
      const data = response.data;
      if (Array.isArray(data)) {
        // Convert array to ChartListResponse format for consistency
        return {
          items: data.map(item => ({
            id: item.id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            deleted_at: null,
            chart_name: item.title,
            chart_type: item.type,
            iso_local: '', // Not available in ChartDefinitionRecord
            lat: 0,
            lon: 0,
            tzid: '',
            house_system: item.default_settings.houseSystem,
            bodies: item.default_settings.includeObjects,
            aspects: [],
            orb_deg: 0,
            params: {},
            notes: null,
          })),
          total: data.length,
          page: page,
          page_size: page_size,
        };
      }
      
      return data as ChartListResponse;
    },

    async get(id) {
      const response = await axios.get<ChartRecord>(`/v1/charts/${id}`);
      return response.data;
    },

    async update(id, data) {
      const response = await axios.patch<ChartRecord>(`/v1/charts/${id}`, data);
      return response.data;
    },

    async delete(id) {
      await axios.delete(`/v1/charts/${id}`);
    },

    async duplicate(id) {
      const response = await axios.post<ChartRecord>(`/v1/charts/${id}/duplicate`);
      return response.data;
    },

    // Legacy method
    async createChart(data) {
      const response = await axios.post<ChartRecord>('/v1/charts', data);
      return response.data;
    },
  };
}

