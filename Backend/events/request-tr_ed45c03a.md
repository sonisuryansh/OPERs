# Request #tr_ed45c03a

**Method**: POST  
**Route**: /user/login  
**Status**: 200 OK  
**Timestamp**: 2026-08-02T07:39:54.200Z  
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
- **Total Latency**: 71 ms  
- **Memory**: 25.4 MB  
- **CPU**: 0%  

### Stage Breakdown
- **express**: 0 ms
- **router**: 1 ms
- **middleware**: 1 ms
- **total**: 71 ms

## Backend Logs
None

## Errors
None
