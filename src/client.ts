import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ChartApi, createChartApi } from './apis/charts';
import { ChartInstanceApi, createInstanceApi } from './apis/instances';
import { WheelApi, createWheelApi } from './apis/wheels';
import { RenderApi, createRenderApi } from './apis/render';

export interface ApiClient {
  charts: ChartApi;
  instances: ChartInstanceApi;
  wheels: WheelApi;
  render: RenderApi;
}

export function createApiClient(
  baseURL: string = '/api',
  config?: AxiosRequestConfig
): ApiClient {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    ...config,
  });

  return {
    charts: createChartApi(axiosInstance),
    instances: createInstanceApi(axiosInstance),
    wheels: createWheelApi(axiosInstance),
    render: createRenderApi(axiosInstance),
  };
}

