# Request #tr_b5e603b9

**Method**: GET  
**Route**: /user/profile  
**Status**: 200 OK  
**Timestamp**: 2026-08-02T07:25:17.770Z  
**Client IP**: ::1  

## Execution Tree
```text
✔ Express
✔ Router
✔ Controller
✔ Response
```

## Data Payload Snapshot
```json
{}
```

## Response Payload Snapshot
```json
{
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
          "require": {
            "password": "********"
          },
          "init": {
            "_id": true,
            "fullname.firstname": true,
            "fullname.lastname": true,
            "email": true,
            "__v": true
          }
        }
      },
      "skipId": true,
      "selected": {
        "password": "********"
      },
      "exclude": true
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
      "__v": 0
    }
  }
}
```

## Performance Telemetry
- **Total Latency**: 21 ms  
- **Memory**: 23.1 MB  
- **CPU**: 0%  

### Stage Breakdown
- **express**: 0 ms
- **router**: 1 ms
- **controller**: 3 ms
- **total**: 21 ms

## Backend Logs
None

## Errors
None
