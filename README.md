# @gaia/api-client

TypeScript client SDK for the Gaia astrological charting backend API.

## Installation

```bash
pnpm add @gaia/api-client axios
```

or

```bash
npm install @gaia/api-client axios
```

## Usage

### Basic Usage

```typescript
import { createApiClient } from '@gaia/api-client';

// Create a client instance
const api = createApiClient('http://localhost:8000/api');

// Use the API
const charts = await api.charts.list();
const renderData = await api.instances.render(instanceId);
const wheels = await api.wheels.list();
```

### With Authentication

```typescript
import { createApiClient } from '@gaia/api-client';

const api = createApiClient('http://localhost:8000/api', {
  headers: {
    'Authorization': 'Bearer your-token-here',
  },
});
```

### SSR Support (Next.js)

The client accepts custom Axios config, allowing Next.js to pass server-side fetch adapters:

```typescript
import { createApiClient } from '@gaia/api-client';

const api = createApiClient(process.env.BACKEND_URL || '/api', {
  // Custom config for SSR
  adapter: require('axios/lib/adapters/http'), // Node.js adapter
});
```

## API Methods

### Charts API

- `create(data: ChartDefinitionCreate)` - Create a new chart definition
- `list(query?, chart_type?, page?, page_size?)` - List charts with optional filtering and pagination
- `get(id: string)` - Get a chart by ID
- `update(id: string, data: ChartUpdate)` - Update a chart
- `delete(id: string)` - Delete a chart
- `duplicate(id: string)` - Duplicate a chart

### Chart Instances API

- `create(data: ChartInstanceCreate)` - Create a new chart instance
- `list(chartId?, page?, pageSize?)` - List chart instances
- `get(instanceId: string)` - Get a chart instance by ID
- `update(instanceId: string, data: ChartInstanceUpdate)` - Update a chart instance
- `render(instanceId: string, wheelId?)` - Render a chart instance and get render data

### Wheels API

- `list(includeSystemDefaults?: boolean)` - List available wheels
- `get(id: string)` - Get a wheel by ID

## Type Exports

All API types are exported for use in your application:

### Chart Types
- `ChartDefinitionCreate`, `ChartDefinitionRecord`
- `ChartInstanceCreate`, `ChartInstanceRecord`, `ChartInstanceUpdate`
- `ChartSettings`, `Subject`

### Wheel Types
- `WheelRecord`

### Render Types
- `RenderResponse` - Complete render response with layers, aspects, and wheel data
- `LayerDTO`, `AspectPairDTO`, `AspectSetDTO`
- `RingDTO`, `RingItemDTO`
- `IndexesDTO` - For use with `buildIndexes` utility

### Utility Functions
- `buildIndexes(renderData: RenderResponse): IndexesDTO` - Build lookup indexes from render response

## Examples

### Creating and Rendering a Chart

```typescript
import { createApiClient } from '@gaia/api-client';
import type { ChartDefinitionCreate, ChartInstanceCreate } from '@gaia/api-client';

const api = createApiClient('http://localhost:8000/api');

// Create a chart definition
const chartDef = await api.charts.create({
  title: 'My Natal Chart',
  type: 'natal',
  subjects: [{
    id: 'subject-1',
    label: 'Person',
    birthDateTime: '1990-01-01T12:00:00',
    birthTimezone: 'America/New_York',
    location: {
      lat: 40.7128,
      lon: -74.0060,
      name: 'New York, NY',
    },
  }],
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
    includeObjects: ['sun', 'moon', 'mercury', 'venus', 'mars'],
  },
});

// Create a chart instance
const instance = await api.instances.create({
  chart_id: chartDef.id,
  title: 'My Chart Instance',
  wheel_id: 'default-wheel',
  layer_config: {
    natal: {
      kind: 'natal',
      subjectId: 'subject-1',
      dateTimeSource: 'birth',
    },
  },
});

// Render the instance
const renderData = await api.instances.render(instance.id);

// Use buildIndexes for efficient lookups
import { buildIndexes } from '@gaia/api-client';
const indexes = buildIndexes(renderData);
```

## Development

### Building

```bash
pnpm build
```

### Testing

This package uses Vitest for testing. To run tests:

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test --coverage

# Run tests in watch mode
pnpm test --watch
```

### Linting

```bash
pnpm lint
```

## Publishing

This package is published to npm. To publish a new version:

1. Update the version in `package.json`
2. Run `pnpm build` to ensure the latest code is built
3. Run `pnpm pack` to verify the package contents
4. Run `npm publish` (or `pnpm publish`)

The `prepublishOnly` script will automatically run lint, test, and build before publishing.

## License

MIT

## Repository

See the [repository](https://github.com/emmygrace/gaia-api) for more information.
