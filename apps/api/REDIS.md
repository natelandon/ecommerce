# Redis Caching Implementation

Redis has been integrated to cache API responses from the FakeStore API, significantly improving response times for repeated requests.

## Features

- **Automatic Caching**: All product API calls are automatically cached
- **Smart Cache Keys**: Separate cache keys for product lists and individual products
- **Configurable TTL**: Cache expiration time can be configured via environment variable
- **Graceful Degradation**: If Redis is unavailable, the API falls back to direct FakeStore API calls
- **Health Monitoring**: Redis connection includes automatic reconnection with exponential backoff

## Architecture

### Cache Keys
- `fakestore:products` - All products list
- `fakestore:product:{id}` - Individual product by ID

### Cache Strategy
1. **Read-Through Caching**: On cache miss, fetch from FakeStore API and populate cache
2. **Time-Based Expiration**: Entries expire after TTL (default: 1 hour)
3. **Automatic Serialization**: JSON serialization/deserialization handled automatically

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_HOST` | `localhost` | Redis server hostname |
| `REDIS_PORT` | `6379` | Redis server port |
| `CACHE_TTL` | `3600` | Cache time-to-live in seconds (1 hour) |

### Docker Compose

Redis is automatically configured in `docker-compose.yml`:

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    volumes:
      - redis-data:/data

  api:
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - CACHE_TTL=3600
    depends_on:
      redis:
        condition: service_healthy
```

## Running with Docker

Start all services including Redis:

```bash
docker-compose up --build
```

The API will automatically:
1. Wait for Redis to be healthy
2. Connect to Redis on startup
3. Begin caching responses

## Running Locally (Development)

### Prerequisites
- Redis installed locally or running in Docker

### Start Redis
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Using Homebrew (macOS)
brew install redis
redis-server
```

### Start the API
```bash
npm run dev
```

## Testing the Cache

### First Request (Cache Miss)
```bash
curl http://localhost:4000/products
```

Console output:
```
Cache miss: products - fetching from API
```

### Second Request (Cache Hit)
```bash
curl http://localhost:4000/products
```

Console output:
```
Cache hit: products
```

## Performance Impact

### Without Cache
- First request: ~500-1000ms (external API call)
- Subsequent requests: ~500-1000ms each

### With Cache
- First request: ~500-1000ms (cache miss + external API)
- Subsequent requests: ~5-10ms (cache hit)

**Result**: ~100x faster response times for cached data!

## Cache Management

### Manual Cache Operations

The Redis service provides utility functions for manual cache management:

```typescript
import { getCached, setCache, deleteCache, clearCachePattern } from './services/redis';

// Get cached value
const products = await getCached<Product[]>('fakestore:products');

// Set cached value with custom TTL (300 seconds)
await setCache('custom:key', data, 300);

// Delete single cache entry
await deleteCache('fakestore:products');

// Clear all product caches
await clearCachePattern('fakestore:*');
```

### Cache Invalidation

To invalidate the cache after data updates, you can add endpoints:

```typescript
// Example: Clear all caches
app.post('/admin/cache/clear', async (_req, res) => {
  const count = await clearCachePattern('fakestore:*');
  res.json({ message: `Cleared ${count} cache entries` });
});
```

## Monitoring

### Redis CLI

Connect to Redis and inspect cache:

```bash
# Connect to Redis
docker exec -it <redis-container-id> redis-cli

# List all keys
KEYS *

# Get cached products
GET fakestore:products

# Check TTL
TTL fakestore:products

# Monitor cache hits/misses
MONITOR
```

### Logs

The API logs cache operations:
- `Cache hit: products` - Data served from cache
- `Cache miss: products - fetching from API` - Data fetched from FakeStore API
- `Redis: Connected` - Redis connection established
- `Redis: Reconnecting...` - Automatic reconnection in progress

## Error Handling

### Redis Connection Failures

The API gracefully handles Redis failures:

1. **Startup**: If Redis isn't available, the API will retry connection with exponential backoff
2. **Runtime**: If Redis becomes unavailable, API falls back to direct FakeStore API calls
3. **Reconnection**: Automatic reconnection attempts with logging

### Cache Operation Failures

All cache operations (`getCached`, `setCache`, etc.) return null/false on failure without throwing errors, ensuring the API remains available even if Redis fails.

## Best Practices

1. **TTL Configuration**: Adjust `CACHE_TTL` based on your data freshness requirements
   - Products rarely change: Use longer TTL (3600s or more)
   - Products change frequently: Use shorter TTL (300s-600s)

2. **Cache Warming**: Pre-populate cache on startup for frequently accessed data

3. **Cache Invalidation**: Implement invalidation strategies for data updates

4. **Monitoring**: Monitor cache hit rates and adjust TTL accordingly

5. **Memory Management**: Redis uses memory. Monitor usage and set maxmemory policies if needed

## Troubleshooting

### API can't connect to Redis

**Symptom**: `Redis Client Error: connect ECONNREFUSED`

**Solution**:
- Verify Redis is running: `docker ps` or `redis-cli ping`
- Check `REDIS_HOST` and `REDIS_PORT` environment variables
- Ensure firewall allows connection on port 6379

### Cache not updating after data changes

**Symptom**: Old data returned even after external updates

**Solution**:
- Data is cached with TTL - wait for expiration or manually invalidate
- Implement cache invalidation on data updates
- Reduce `CACHE_TTL` for more frequent updates

### High memory usage

**Symptom**: Redis consuming too much memory

**Solution**:
- Reduce `CACHE_TTL` to expire entries faster
- Configure Redis maxmemory and eviction policy
- Monitor cache key patterns and optimize

## Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [node-redis Client](https://github.com/redis/node-redis)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
