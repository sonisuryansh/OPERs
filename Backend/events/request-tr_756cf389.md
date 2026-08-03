# Request #tr_756cf389

**Method**: POST  
**Route**: /user/login  
**Status**: 200 OK  
**Timestamp**: 2026-08-02T06:49:32.930Z  
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
  "token": "********",
  "user": {
    "$__": {
      "activePaths": {
        "paths": {
          "password": "********",
          "email": "init",
          "fullname.firstname": "init",
          "_id": "init",
          "fullname.lastname": "init",
          "__v": "init"
        },
        "states": {
          "require": {},
          "init": {
            "_id": true,
            "fullname.firstname": true,
            "fullname.lastname": true,
            "email": true,
            "password": "********",
            "__v": true
          }
        }
      },
      "skipId": true
    },
    "$isNew": false,
    "_doc": {
      "fullname": {
        "firstname": "test-first-name",
        "lastname": "test-last-name"
      },
      "_id": {
        "buffer": {
          "0": 106,
          "1": 101,
          "2": 165,
          "3": 183,
          "4": 81,
          "5": 164,
          "6": 250,
          "7": 44,
          "8": 151,
          "9": 196,
          "10": 166,
          "11": 61
        }
      },
      "email": "test@gmail.com",
      "password": "********",
      "__v": 0
    }
  }
}
```

## Performance Telemetry
- **Total Latency**: 129 ms  
- **Memory**: 24 MB  
- **CPU**: 0%  

### Stage Breakdown
- **express**: 0 ms
- **router**: 0 ms
- **middleware**: 22 ms
- **total**: 129 ms

## Backend Logs
None

## Errors
None
