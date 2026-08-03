# Request #tr_d0e31edb

**Method**: POST  
**Route**: /captain/register  
**Status**: 400 Error  
**Timestamp**: 2026-08-03T16:52:49.029Z  
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
- **Total Latency**: 31 ms  
- **Memory**: 28.9 MB  
- **CPU**: 0%  

### Stage Breakdown
- **express**: 0 ms
- **router**: 0 ms
- **middleware**: 21 ms
- **total**: 31 ms

## Backend Logs
None

## Errors
None
