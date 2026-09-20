# API Reference

Complete documentation of the Clinicians Semantic Search API endpoints.

## 📌 Base URL

```
Local: http://localhost:8000
Production: https://api.example.com  # Update with your domain
```

## 🔐 Authentication

Currently, the API does not require authentication. For production deployments, consider adding:
- API key authentication
- JWT tokens
- OAuth2

## 📡 Endpoints

### Health Check

Verify the API is running and healthy.

**Request**
```http
GET /health
```

**Response**
```json
{
  "status": "ok",
  "timestamp": "2025-01-21T12:00:00Z"
}
```

**Status Codes**
- `200` - Server is healthy
- `500` - Server error

---

### Get Filters

Retrieve available filter options for searches.

**Request**
```http
GET /api/v1/filters
```

**Response**
```json
{
  "specialties": [
    "Anxiety Disorders",
    "Depression",
    "ADHD",
    "Trauma/PTSD",
    "Relationship Issues",
    "Family Therapy",
    "Bipolar Disorder",
    "OCD",
    "Eating Disorders",
    "Substance Abuse"
  ],
  "locations": [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose"
  ],
  "insurances": [
    "Aetna",
    "Anthem",
    "Blue Cross Blue Shield",
    "Cigna",
    "Humana",
    "Medicare",
    "Medicaid",
    "UnitedHealth",
    "Tricare",
    "Self-Pay"
  ]
}
```

**Status Codes**
- `200` - Successfully retrieved filters
- `500` - Server error

---

### Search Therapists

Search for therapists using semantic search with optional filters.

**Request**
```http
POST /api/v1/search
Content-Type: application/json

{
  "query": "therapist specializing in anxiety",
  "criteria": {
    "specialties": ["Anxiety Disorders"],
    "location": "New York",
    "insurance": "Aetna"
  },
  "limit": 20
}
```

**Query Parameters (JSON Body)**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes* | Natural language search query |
| `criteria` | object | No | Filter criteria object |
| `criteria.specialties` | array | No | List of specialties to filter by |
| `criteria.location` | string | No | Geographic location to filter by |
| `criteria.insurance` | string | No | Insurance provider to filter by |
| `limit` | integer | No | Max results to return (default: 10, max: 100) |

*Either `query` or `criteria` must be provided.

**Response**
```json
{
  "count": 3,
  "results": [
    {
      "id": "uuid-1",
      "name": "Dr. Sarah Johnson",
      "specialty": "Anxiety Disorders",
      "location": "New York, NY",
      "insurance": "Aetna",
      "phone": "(555) 123-4567",
      "email": "sarah@example.com",
      "credentials": "Ph.D., LMHC",
      "experience_years": 12,
      "accepts_new_clients": true,
      "telehealth_available": true,
      "rating": 4.8,
      "review_count": 24,
      "relevance_score": 0.95
    },
    {
      "id": "uuid-2",
      "name": "Dr. Michael Chen",
      "specialty": "Anxiety Disorders",
      "location": "New York, NY",
      "insurance": "Aetna",
      "phone": "(555) 987-6543",
      "email": "michael@example.com",
      "credentials": "M.D., Psychiatrist",
      "experience_years": 15,
      "accepts_new_clients": true,
      "telehealth_available": true,
      "rating": 4.9,
      "review_count": 42,
      "relevance_score": 0.92
    },
    {
      "id": "uuid-3",
      "name": "Dr. Emily Rodriguez",
      "specialty": "Anxiety Disorders",
      "location": "New York, NY",
      "insurance": "Aetna",
      "phone": "(555) 456-7890",
      "email": "emily@example.com",
      "credentials": "LCSW, DBT Specialist",
      "experience_years": 8,
      "accepts_new_clients": true,
      "telehealth_available": false,
      "rating": 4.7,
      "review_count": 18,
      "relevance_score": 0.89
    }
  ]
}
```

**Therapist Object Fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique therapist identifier |
| `name` | string | Therapist's name |
| `specialty` | string | Primary area of specialization |
| `location` | string | City and state |
| `insurance` | string | Insurance provider accepted |
| `phone` | string | Contact phone number |
| `email` | string | Contact email address |
| `credentials` | string | Professional credentials |
| `experience_years` | integer | Years of experience |
| `accepts_new_clients` | boolean | Whether therapist accepts new clients |
| `telehealth_available` | boolean | Whether telehealth appointments available |
| `rating` | float (0-5) | Average rating from reviews |
| `review_count` | integer | Number of reviews |
| `relevance_score` | float (0-1) | Relevance to search query |

**Error Responses**

400 Bad Request
```json
{
  "detail": "Either 'query' or 'criteria' must be provided"
}
```

400 Bad Request (Invalid limit)
```json
{
  "detail": "limit must be between 1 and 100"
}
```

500 Server Error
```json
{
  "detail": "Internal server error"
}
```

**Status Codes**
- `200` - Successfully returned results
- `400` - Invalid request parameters
- `500` - Server error

---

## 🔄 Search Examples

### Example 1: Simple Query Search
```bash
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "anxiety therapist"}'
```

### Example 2: Location-based Search
```bash
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "depression treatment",
    "criteria": {"location": "Los Angeles"}
  }'
```

### Example 3: Insurance Filter
```bash
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "criteria": {
      "insurance": "Blue Cross Blue Shield",
      "specialties": ["ADHD", "Anxiety Disorders"]
    },
    "limit": 5
  }'
```

### Example 4: JavaScript Fetch
```javascript
const response = await fetch('http://localhost:8000/api/v1/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'therapist specializing in family therapy',
    criteria: {
      location: 'New York',
      insurance: 'Cigna'
    },
    limit: 20
  })
});

const data = await response.json();
console.log(data.results);
```

### Example 5: Python Requests
```python
import requests

response = requests.post(
    'http://localhost:8000/api/v1/search',
    json={
        'query': 'trauma therapy',
        'criteria': {
            'location': 'Chicago',
            'specialties': ['Trauma/PTSD']
        },
        'limit': 10
    }
)

therapists = response.json()['results']
for therapist in therapists:
    print(f"{therapist['name']} - {therapist['specialty']}")
```

---

## 📊 Pagination

For large result sets, use the `limit` parameter:

```bash
# Get first 20 results
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "therapist", "limit": 20}'
```

Maximum limit: 100 results per request.

---

## ⚠️ Error Handling

All endpoints return standard HTTP status codes and error messages:

| Status | Meaning | Example |
|--------|---------|---------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Invalid query parameters |
| `404` | Not Found | Endpoint not found |
| `500` | Server Error | Internal error - try again later |

Error Response Format:
```json
{
  "detail": "Error description"
}
```

---

## 🔄 Rate Limiting

Currently, no rate limiting is implemented. For production, consider implementing:
- Per-IP rate limits
- Per-API-key rate limits
- Request throttling

---

## 📝 Request/Response Format

### Content-Type
All requests should include:
```
Content-Type: application/json
```

### Character Encoding
All responses use UTF-8 encoding.

### Timestamps
All timestamps are in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

---

## 🧪 Testing the API

### Using Postman
1. Create a new request
2. Set method to `POST`
3. Set URL to `http://localhost:8000/api/v1/search`
4. Go to Body tab, select "raw" and "JSON"
5. Enter your search parameters

### Using cURL
```bash
curl -X GET http://localhost:8000/health
curl -X GET http://localhost:8000/api/v1/filters
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "anxiety"}'
```

### Using Python
```python
import requests

# Health check
response = requests.get('http://localhost:8000/health')
print(response.json())

# Get filters
response = requests.get('http://localhost:8000/api/v1/filters')
print(response.json())

# Search
response = requests.post(
    'http://localhost:8000/api/v1/search',
    json={'query': 'anxiety therapist'}
)
print(response.json())
```

---

## 📚 Additional Resources

- [Backend README](../backend/README.md)
- [Architecture](./ARCHITECTURE.md)
- [Quick Start Guide](./QUICK_START.md)
