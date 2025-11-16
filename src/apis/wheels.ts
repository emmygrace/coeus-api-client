import { AxiosInstance } from 'axios';
import { WheelRecord } from '../types';

export interface WheelApi {
  list(includeSystemDefaults?: boolean): Promise<WheelRecord[]>;
  get(id: string): Promise<WheelRecord>;
}

export function createWheelApi(axios: AxiosInstance): WheelApi {
  return {
    async list(includeSystemDefaults = true) {
      const params = new URLSearchParams();
      params.append('include_system_defaults', includeSystemDefaults.toString());
      const response = await axios.get<WheelRecord[]>(
        `/v1/wheels?${params.toString()}`
      );
      return response.data;
    },

    async get(id) {
      const response = await axios.get<WheelRecord>(`/v1/wheels/${id}`);
      return response.data;
    },
  };
}

