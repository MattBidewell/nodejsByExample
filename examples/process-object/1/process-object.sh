// Run with environment variable
$ NODE_ENV=production node process-object.js
# NODE_ENV: production


// Run with command line arguments
$ node process-object.js --name test -v file.txt
# Arguments: ['/path/to/node', '/path/to/script.js', '--name', 'test', '-v', 'file.txt']
# Options: { name: 'test', v: true }
# Positional: ['file.txt']


// Check process info
$ node -e "console.log(process.version)"
# v24.0.0
