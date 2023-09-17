# nodejsByExample

The source code for the project [NodejsByExample](https://nodejsbyexample.dev/).

The site is made up from the examples directory which contains a list of executable files which can independently be run. The comments in the code make up for the content on the site as well. The logic to generate the site is found inside the `tools/generate.js` file.

## How to run

To run this locally you need to have NodeJS 18+ installed. Then run the following commands:

``` shell
npm install
npm generate
npm dev
```

This will generate the site in the `./public` folder and start a local server on [port 3000](http://localhost:3000), serving the static content.

# Contribution

I'm open to contributions, raise an MR or an issue if you have any suggestions.

# Thanks

Primarily thanks to [Mark McGranaghan](https://markmcgranaghan.com/) and [Eli Bendersky](https://eli.thegreenplace.net/) for GoByExample, which inspired this project.

But also the other *By Example* projects:
- [CbyExample](https://www.cbyexample.com/) by [Sean Valeo](https://github.com/seanvaleo)
- [DartByExample](https://www.jpryan.me/dartbyexample/) by [John Ryan](https://twitter.com/jryanio)
- [HaskellByExample](https://lotz84.github.io/haskellbyexample/) by [Tatsuya Hirose](https://github.com/lotz84)
- [JavascriptByExample](https://javascriptbyexample.com/) by [Eric Windmill](https://ericwindmill.com/)
