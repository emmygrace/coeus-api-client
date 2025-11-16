import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { createApiClient } from '../client';
import type {
  ChartDefinitionCreate,
  ChartDefinitionRecord,
  ChartInstanceCreate,
  ChartInstanceRecord,
  WheelRecord,
  ChartRecord,
  ChartListResponse,
} from '../types';
import type { RenderResponse } from '../render_types';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('API Client', () => {
  let mockAxiosInstance: Partial<AxiosInstance>;
  let mockPost: ReturnType<typeof vi.fn>;
  let mockGet: ReturnType<typeof vi.fn>;
  let mockPatch: ReturnType<typeof vi.fn>;
  let mockDelete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPost = vi.fn();
    mockGet = vi.fn();
    mockPatch = vi.fn();
    mockDelete = vi.fn();

    mockAxiosInstance = {
      post: mockPost,
      get: mockGet,
      patch: mockPatch,
      delete: mockDelete,
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  describe('Chart API', () => {
    it('creates chart via API', async () => {
      const mockChart: ChartDefinitionRecord = {
        id: 'chart-1',
        owner_user_id: 'user-1',
        title: 'Test Chart',
        type: 'natal',
        subjects: [],
        default_settings: {
          zodiacType: 'tropical',
          houseSystem: 'placidus',
          orbSettings: {
            conjunction: 8,
            opposition: 8,
            trine: 7,
            square: 6,
            sextile: 4,
          },
          includeObjects: ['sun', 'moon'],
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockPost.mockResolvedValue({ data: mockChart });

      const client = createApiClient('http://localhost:8000');
      const chartData: ChartDefinitionCreate = {
        title: 'Test Chart',
        type: 'natal',
        subjects: [],
        default_settings: mockChart.default_settings,
      };

      const result = await client.charts.create(chartData);

      expect(result).toEqual(mockChart);
      expect(mockPost).toHaveBeenCalledWith('/v1/charts', chartData);
    });

    it('lists charts with pagination', async () => {
      const mockCharts: ChartDefinitionRecord[] = [
        {
          id: 'chart-1',
          owner_user_id: 'user-1',
          title: 'Chart 1',
          type: 'natal',
          subjects: [],
          default_settings: {
            zodiacType: 'tropical',
            houseSystem: 'placidus',
            orbSettings: {
              conjunction: 8,
              opposition: 8,
              trine: 7,
              square: 6,
              sextile: 4,
            },
            includeObjects: [],
          },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockGet.mockResolvedValue({ data: mockCharts });

      const client = createApiClient('http://localhost:8000');
      const result = await client.charts.list('test', 'natal', 1, 20);

      expect(result).toBeDefined();
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('/v1/charts')
      );
    });

    it('gets chart by ID', async () => {
      const mockChart: ChartRecord = {
        id: 'chart-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
        chart_name: 'Test Chart',
        chart_type: 'natal',
        iso_local: '1990-01-01T12:00:00',
        lat: 40.7128,
        lon: -74.0060,
        tzid: 'America/New_York',
        house_system: 'placidus',
        bodies: ['sun', 'moon'],
        aspects: [],
        orb_deg: 8,
        params: {},
        notes: null,
      };

      mockGet.mockResolvedValue({ data: mockChart });

      const client = createApiClient('http://localhost:8000');
      const result = await client.charts.get('chart-1');

      expect(result).toEqual(mockChart);
      expect(mockGet).toHaveBeenCalledWith('/v1/charts/chart-1');
    });

    it('updates chart', async () => {
      const mockChart: ChartRecord = {
        id: 'chart-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
        chart_name: 'Updated Chart',
        chart_type: 'natal',
        iso_local: '1990-01-01T12:00:00',
        lat: 40.7128,
        lon: -74.0060,
        tzid: 'America/New_York',
        house_system: 'placidus',
        bodies: ['sun', 'moon'],
        aspects: [],
        orb_deg: 8,
        params: {},
        notes: null,
      };

      mockPatch.mockResolvedValue({ data: mockChart });

      const client = createApiClient('http://localhost:8000');
      const updateData = { chart_name: 'Updated Chart' };
      const result = await client.charts.update('chart-1', updateData);

      expect(result).toEqual(mockChart);
      expect(mockPatch).toHaveBeenCalledWith('/v1/charts/chart-1', updateData);
    });

    it('deletes chart', async () => {
      mockDelete.mockResolvedValue({});

      const client = createApiClient('http://localhost:8000');
      await client.charts.delete('chart-1');

      expect(mockDelete).toHaveBeenCalledWith('/v1/charts/chart-1');
    });

    it('duplicates chart', async () => {
      const mockChart: ChartRecord = {
        id: 'chart-2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
        chart_name: 'Duplicated Chart',
        chart_type: 'natal',
        iso_local: '1990-01-01T12:00:00',
        lat: 40.7128,
        lon: -74.0060,
        tzid: 'America/New_York',
        house_system: 'placidus',
        bodies: ['sun', 'moon'],
        aspects: [],
        orb_deg: 8,
        params: {},
        notes: null,
      };

      mockPost.mockResolvedValue({ data: mockChart });

      const client = createApiClient('http://localhost:8000');
      const result = await client.charts.duplicate('chart-1');

      expect(result).toEqual(mockChart);
      expect(mockPost).toHaveBeenCalledWith('/v1/charts/chart-1/duplicate');
    });
  });

  describe('Chart Instance API', () => {
    it('creates chart instance', async () => {
      const mockInstance: ChartInstanceRecord = {
        id: 'instance-1',
        chart_id: 'chart-1',
        owner_user_id: 'user-1',
        title: 'Test Instance',
        wheel_id: 'wheel-1',
        layer_config: {
          natal: {
            kind: 'natal',
            subjectId: 'subject-1',
            dateTimeSource: 'birth',
          },
        },
        settings_override: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockPost.mockResolvedValue({ data: mockInstance });

      const client = createApiClient('http://localhost:8000');
      const instanceData: ChartInstanceCreate = {
        chart_id: 'chart-1',
        title: 'Test Instance',
        wheel_id: 'wheel-1',
        layer_config: mockInstance.layer_config,
      };

      const result = await client.instances.create(instanceData);

      expect(result).toEqual(mockInstance);
      expect(mockPost).toHaveBeenCalledWith('/v1/chart-instances', instanceData);
    });

    it('renders chart instance', async () => {
      const mockRenderResponse: RenderResponse = {
        chartInstance: {
          id: 'instance-1',
          chartDefinitionId: 'chart-1',
          title: 'Test Instance',
          ownerUserId: 'user-1',
          subjects: [],
          effectiveDateTimes: {},
        },
        settings: {
          zodiacType: 'tropical',
          houseSystem: 'placidus',
          orbSettings: {
            conjunction: 8,
            opposition: 8,
            trine: 7,
            square: 6,
            sextile: 4,
          },
          includeObjects: [],
        },
        coordinateSystem: {
          angleUnit: 'degrees',
          angleRange: [0, 360],
          direction: 'cw',
          zeroPoint: {
            type: 'zodiac',
            signStart: 'aries',
            offsetDegrees: 0,
          },
        },
        layers: {},
        aspects: {
          sets: {},
        },
        wheel: {
          id: 'wheel-1',
          name: 'Test Wheel',
          radius: { inner: 0, outer: 100 },
          rings: [],
        },
      };

      mockGet.mockResolvedValue({ data: mockRenderResponse });

      const client = createApiClient('http://localhost:8000');
      const result = await client.instances.render('instance-1');

      expect(result).toEqual(mockRenderResponse);
      expect(mockGet).toHaveBeenCalledWith('/v1/chart-instances/instance-1/render');
    });

    it('renders chart instance with wheel ID', async () => {
      const mockRenderResponse: RenderResponse = {
        chartInstance: {
          id: 'instance-1',
          chartDefinitionId: 'chart-1',
          title: 'Test Instance',
          ownerUserId: 'user-1',
          subjects: [],
          effectiveDateTimes: {},
        },
        settings: {
          zodiacType: 'tropical',
          houseSystem: 'placidus',
          orbSettings: {
            conjunction: 8,
            opposition: 8,
            trine: 7,
            square: 6,
            sextile: 4,
          },
          includeObjects: [],
        },
        coordinateSystem: {
          angleUnit: 'degrees',
          angleRange: [0, 360],
          direction: 'cw',
          zeroPoint: {
            type: 'zodiac',
            signStart: 'aries',
            offsetDegrees: 0,
          },
        },
        layers: {},
        aspects: {
          sets: {},
        },
        wheel: {
          id: 'wheel-2',
          name: 'Custom Wheel',
          radius: { inner: 0, outer: 100 },
          rings: [],
        },
      };

      mockGet.mockResolvedValue({ data: mockRenderResponse });

      const client = createApiClient('http://localhost:8000');
      const result = await client.instances.render('instance-1', 'wheel-2');

      expect(result).toEqual(mockRenderResponse);
      expect(mockGet).toHaveBeenCalledWith(
        '/v1/chart-instances/instance-1/render?wheelId=wheel-2'
      );
    });
  });

  describe('Wheel API', () => {
    it('lists wheels', async () => {
      const mockWheels: WheelRecord[] = [
        {
          id: 'wheel-1',
          name: 'Test Wheel',
          description: 'Test Description',
        },
      ];

      mockGet.mockResolvedValue({ data: mockWheels });

      const client = createApiClient('http://localhost:8000');
      const result = await client.wheels.list();

      expect(result).toEqual(mockWheels);
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('/v1/wheels')
      );
    });

    it('gets wheel by ID', async () => {
      const mockWheel: WheelRecord = {
        id: 'wheel-1',
        name: 'Test Wheel',
        description: 'Test Description',
      };

      mockGet.mockResolvedValue({ data: mockWheel });

      const client = createApiClient('http://localhost:8000');
      const result = await client.wheels.get('wheel-1');

      expect(result).toEqual(mockWheel);
      expect(mockGet).toHaveBeenCalledWith('/v1/wheels/wheel-1');
    });
  });

  describe('Error Handling', () => {
    it('handles 404 errors', async () => {
      const error = new Error('Not Found') as AxiosError;
      error.response = {
        status: 404,
        statusText: 'Not Found',
        data: { detail: 'Chart not found' },
        headers: {},
        config: {} as any,
      };

      mockGet.mockRejectedValue(error);

      const client = createApiClient('http://localhost:8000');

      await expect(client.charts.get('nonexistent')).rejects.toThrow();
    });

    it('handles 500 errors', async () => {
      const error = new Error('Internal Server Error') as AxiosError;
      error.response = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { detail: 'Server error' },
        headers: {},
        config: {} as any,
      };

      mockPost.mockRejectedValue(error);

      const client = createApiClient('http://localhost:8000');
      const chartData: ChartDefinitionCreate = {
        title: 'Test Chart',
        type: 'natal',
        subjects: [],
        default_settings: {
          zodiacType: 'tropical',
          houseSystem: 'placidus',
          orbSettings: {
            conjunction: 8,
            opposition: 8,
            trine: 7,
            square: 6,
            sextile: 4,
          },
          includeObjects: [],
        },
      };

      await expect(client.charts.create(chartData)).rejects.toThrow();
    });

    it('handles network errors', async () => {
      const error = new Error('Network Error');
      mockGet.mockRejectedValue(error);

      const client = createApiClient('http://localhost:8000');

      await expect(client.charts.get('chart-1')).rejects.toThrow('Network Error');
    });
  });
});

