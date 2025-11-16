import { AxiosInstance } from 'axios';
import { ChartInstanceCreate, ChartInstanceRecord, ChartInstanceUpdate } from '../types';
import { RenderResponse } from '../render_types';

export interface ChartInstanceApi {
  create(data: ChartInstanceCreate): Promise<ChartInstanceRecord>;
  list(chartId?: string, page?: number, pageSize?: number): Promise<ChartInstanceRecord[]>;
  get(instanceId: string): Promise<ChartInstanceRecord>;
  update(instanceId: string, data: ChartInstanceUpdate): Promise<ChartInstanceRecord>;
  render(instanceId: string, wheelId?: string): Promise<RenderResponse>;
}

export function createInstanceApi(axios: AxiosInstance): ChartInstanceApi {
  return {
    async create(data) {
      const response = await axios.post<ChartInstanceRecord>(
        '/v1/chart-instances',
        data
      );
      return response.data;
    },

    async list(chartId, page = 1, pageSize = 20) {
      const params = new URLSearchParams();
      if (chartId) {
        params.append('chart_id', chartId);
      }
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());
      const response = await axios.get<ChartInstanceRecord[]>(
        `/v1/chart-instances?${params.toString()}`
      );
      return response.data;
    },

    async get(instanceId) {
      const response = await axios.get<ChartInstanceRecord>(
        `/v1/chart-instances/${instanceId}`
      );
      return response.data;
    },

    async update(instanceId, data) {
      const response = await axios.patch<ChartInstanceRecord>(
        `/v1/chart-instances/${instanceId}`,
        data
      );
      return response.data;
    },

    async render(instanceId, wheelId) {
      const params = new URLSearchParams();
      if (wheelId) {
        params.append('wheelId', wheelId);
      }
      const url = `/v1/chart-instances/${instanceId}/render${
        params.toString() ? `?${params.toString()}` : ''
      }`;
      const response = await axios.get<RenderResponse>(url);
      return response.data;
    },
  };
}

