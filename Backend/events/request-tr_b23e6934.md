# Request #tr_b23e6934

**Method**: POST  
**Route**: /captain/register  
**Status**: 400 Error  
**Timestamp**: 2026-08-03T16:53:33.613Z  
**Client IP**: ::1  

## Execution Tree
```text
✔ Express
✔ Router
✔ Middleware
✔ Response
```

## Data Payload Snapshot
```json
{}
```

## Response Payload Snapshot
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Vehicle color is required",
      "path": "vehicleColor",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Vehicle plate number is required",
      "path": "vehiclePlateNumber",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Vehicle capacity must be at least 1",
      "path": "vehicleCapacity",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Invalid vehicle type",
      "path": "vehicleType",
      "location": "body"
    }
  ]
}
```

## Performance Telemetry
- **Total Latency**: 23 ms  
- **Memory**: 24.1 MB  
- **CPU**: 0%  

### Stage Breakdown
- **express**: 0 ms
- **router**: 1 ms
- **middleware**: 15 ms
- **total**: 23 ms

## Backend Logs
None

## Errors
None
