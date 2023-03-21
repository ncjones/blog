---
title: Node.js Streaming with Pipeline
date: 2023-03-22
author: Nathan
desc: |
  Node.js pipeline() utility was added in 2018 as a better alternative to
  stream.pipe(). It is not widely used but it's a great way to create
  streaming data applications on Node.js because of better error handling,
  cleaner syntax and compatibility with async/await.
img: /img/coffee-cup-riding-tricycle-with-streamers-on-handle-bars-digital-art.jpg
---

Stream processing is useful for keeping memory pressure under control when
processing large files. Node.js is very good at stream processing but correct
error handling with streams in Node.js can be tricky.

The [Node.js stream docs][node-stream-docs] are somewhat of a beast and
do not provide enough examples for effective stream processing in application
code. That's what we'll cover in this article.


## Quick Overview of Streams

Node.js streams can be Readable or Writable or Duplex (both). Additionally,
Transform is a type of Duplex Stream which can create a new Stream by decorating
another. They are extremely modular and flexible; Readables, Transforms and
Writables can be recombined to produced novel streaming applications.

Many parts of the Node.js standard library implement streams. Some examples are:

| Readable              | Writable               | Transform           |
|-----------------------|------------------------|---------------------|
| process.stdin         | process.stdout         | zlib.createGunzip() |
| fs.createReadStream() | fs.createWriteStream() | crypto.createHmac() |
| http.IncomingMessage  | http.OutgoingMessage   |                     |


Streams are also iterable and can be consumed by a "for await" loop:


```js
for await (const chunk of readable) {
  data += chunk;
}
```

## Streaming with pipe

Every stream has a .pipe() function that is used to compose it with other
streams. The following  example demonstrates a solution to printing a gzipped
file to stdout.

```js
fs.createReadStream(inputFile)
  .pipe(zlib.createGunzip())
  .pipe(process.stdout);
```

It looks nice but this simple example has two big problems:

1. It is missing error handling.
1. It cannot be awaited.

Allowing the .pipe() to resolve a promise is not too challenging but it adds
unnecessary boilerplate. Adding error handling to stream processing using
.pipe() is not trivial because it requires manually cleaning up the individual
readable and writable stream components.

```
TODO example correct pipe solution
```

Correctly handling streams with .pipe() results in the the
stream composition to be split apart and potentially even spread across
multiple functions. This further reduces the readability and increases the
chance of errors.


## Streaming with pipeline

The Node.js stream package includes a [pipeline][node-pipeline-docs] utility
for addressing the issues with stream.pipe.  We can import the promisified
version from "node:stream/promises":

```
const { pipeline } = require('node:stream/promises');
```

Instead of chaining stream.pipe(), the task to print a gzipped file to stdout
can be achieved by creating a pipeline:

```js
pipeline(
  fs.createReadStream(inputFile),
  zlib.createGunzip(),
  process.stdout
)
```


On the surface it looks the same as chaining .pipe() but now we can await the
stream consumption and we can handle all pipeline errors in a a single catch
block:


```javascript
await pipeline(
  fs.createReadStream(inputFile),
  zlib.createGunzip(),
  process.stdout
).catch(err) {
  throw VError({ cause: err, info: { inputFile } }, 'MyPipelineFailed');
};
```


Pipeline encourages us to define the stream composition in
one place and gives us confidence the errors are handled correctly.

If we use the stream.pipeline utility then a lot of the
pitfalls with Node.js streams can be avoided. The "node:stream/promises" was added in Node.js v15,
seamless integration between streams and async/await became possible, further
improving the developer experience with streams.

## Recipe: Parsing Transform

## Recipe: Async Transform

## Recipe: Streaming Upload to S3

```js
const passthru = ...
pipeline(reader, transformer, passthru);
await s3.upload(passthru);

```

[backpressure]: https://nodejs.org/en/docs/guides/backpressuring-in-streams
[node-pipeline-docs]: https://nodejs.org/docs/latest-v18.x/api/stream.html#streampipelinesource-transforms-destination-callback
[node-stream-docs]: https://nodejs.org/docs/latest-v18.x/api/stream.html

[3]: https://ljn.io/posts/async-stream-handlers
