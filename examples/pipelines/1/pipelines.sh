// Create test files
$ echo "Hello World" > input.txt
$ echo "some test data" > data.txt


// Run the pipeline examples
$ node pipelines.js
# File copied successfully
# Generated file from async iterator


// Verify the output
$ cat output.txt
# Hello World

$ cat generated.txt
# Line 1
# Line 2
# ...
