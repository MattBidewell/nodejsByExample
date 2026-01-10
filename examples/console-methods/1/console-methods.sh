// Run the console methods example
$ node console-methods.js
# Regular log message
# ┌─────────┬───────────┬─────┬─────────┐
# │ (index) │   name    │ age │  role   │
# ...
# array-operation: 5.123ms
# success: 1
# success: 2


// Enable debug output
$ DEBUG=1 node console-methods.js
# [app] [DEBUG] +0ms: Debug info


// Redirect logs to files
$ node console-methods.js 2>error.log 1>app.log
