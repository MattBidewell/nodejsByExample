// Run the util module examples
$ node util-module.js

// Enable debug output with NODE_DEBUG
$ NODE_DEBUG=myapp node util-module.js
# MYAPP 12345: Application starting...

// Enable multiple debug namespaces
$ NODE_DEBUG=myapp,myapp-db node util-module.js

// Use wildcard for all myapp namespaces
$ NODE_DEBUG=myapp* node util-module.js
