# API Connection Issues - FIXED ✅

## Problem Diagnosed
The Next.js app was experiencing `ERR_CONNECTION_REFUSED` errors because the `NEXT_PUBLIC_REST_API_ENDPOINT` environment variable was not configured, causing axios to make requests to `undefined/api/products.json`.

## Solution Applied

### 1. Fixed Axios Base URL Configuration
**File:** `src/framework/basic-rest/utils/http.ts`

**Change:** Added fallback baseURL when environment variable is missing:
```typescript
baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT || "/api"
```

This ensures that all API requests default to `/api` which correctly serves the JSON files from the `public/api` folder.

### 2. Cleared Build Cache
- Stopped the running Next.js dev server
- Deleted `.next` folder to clear build cache
- Restarted the dev server

## How It Works Now
- All API files in `public/api/*.json` are now accessible at `http://localhost:3000/api/*.json`
- Axios automatically routes requests to the correct endpoints
- No environment variables needed for local development

## Environment Variable (Optional)
If you want to point to a different API endpoint in production, create a `.env.local` file:

```env
NEXT_PUBLIC_REST_API_ENDPOINT=https://your-api-domain.com/api
```

## Verification Steps
1. ✅ Dev server is running on http://localhost:3000
2. ✅ API endpoints are accessible:
   - http://localhost:3000/api/products.json
   - http://localhost:3000/api/categories.json
   - http://localhost:3000/api/brands.json
3. ✅ No more ERR_CONNECTION_REFUSED errors
4. ✅ Products load successfully on the homepage

## Available API Endpoints
All JSON files in `public/api/`:
- `/api/products.json` - All products
- `/api/categories.json` - Product categories
- `/api/brands.json` - Perfume brands
- `/api/search.json` - Search data
- `/api/products_flash_sale.json` - Flash sale products
- `/api/products_best_seller.json` - Best sellers
- `/api/products_new_arrival.json` - New arrivals
- And more...

## Next Steps
The application should now work perfectly at http://localhost:3000 with all API data loading correctly!
