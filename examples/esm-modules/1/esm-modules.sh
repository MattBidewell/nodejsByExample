// Run the ES Modules examples
$ node esm-modules.js

// Run a single ESM file without package.json
$ node --experimental-default-type=module script.js

// Check if running in ESM mode
$ node -e "console.log(typeof require)"
# undefined (ESM mode)
# function (CommonJS mode)

// package.json settings for ESM:
# {
#   "type": "module"
# }

// Use .mjs extension for ESM files in CJS projects
$ node script.mjs

// Use .cjs extension for CJS files in ESM projects
$ node script.cjs
