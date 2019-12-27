# Mock Moon #

**Mock Moon** is a software to easily build stubs(mock) for Web services used in demos and integration tests.
It is written in JavaScript<sup>&circledR;</sup> and runs on [Node.js<sup>&circledR;</sup>](https://nodejs.org/).

The core functions are implemented as [Express](http://expressjs.com/) middleware, and can use not only as a standalone process but also in combination with [webpack-dev-server](https://github.com/webpack/webpack-dev-server).


## Functions ##

- Mapping requested URL path to response contents.
    - can use Path regexp for URL path

## License ##

[Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Requirements ##

- **Runtime**
   - Node.js 12.14.0 LTS and below
- **Dependencies**
   - express
   - path-to-regexp
   - yaml
   - iconv-lite
