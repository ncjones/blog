---
title: Node.js Stream Composition
date: 2023-05-26
author: Nathan
desc: |
  Node.js pipeline() utility was added in 2018 as a better alternative to
  Readable.pipe(). It is not widely used but it's a great way to create
  streaming data applications on Node.js because of better error handling,
  cleaner syntax and compatibility with async/await.
img: /img/coffee-cup-riding-tricycle-with-streamers-on-handle-bars-digital-art.jpg
---


Stream processing is useful for keeping memory usage low when processing large
amounts of data. Node.js excels at stream processing but it can be tricky
figuring out how to compose streams in Node.js with correct error handling.  By
using stream.pipeline(), error handling for Node.js stream composition is
greatly simplified.


## Quick Overview of Streams

[Node.js streams](https://nodejs.org/docs/latest-v18.x/api/stream.html) can be
Readable, Writable, or Duplex (both). They are modular and composable; any
Readable can be piped to any Writable. Additionally, Transform is a type of
Duplex Stream that effectively decorates any Readable stream.

Node.js streams keep memory usage low by [implementing back
pressure](https://nodejs.org/en/docs/guides/backpressuring-in-streams). Streams
will automatically pause reading when the piped downstream writable has a full
buffer.

Readable streams are also iterable and can be consumed by a "for await" loop:

```js
for await (const chunk of readable) {
  data += chunk;
}
```

Many parts of the Node.js standard library implement streams:

| | |
|--|--|
| **Readable** implementations: | [process.stdin](https://nodejs.dev/en/api/v18/process/#processstdin), [fs.ReadStream](https://nodejs.dev/en/api/v18/fs#fsreadstream), [http.IncomingMessage](https://nodejs.dev/en/api/v18/http/#httpincomingmessage) |
| **Writable** implementations: | [process.stdout](https://nodejs.dev/en/api/v18/process/#processstdout), [fs.WriteStream](https://nodejs.dev/en/api/v18/fs/#fswritestream), [http.OutgoingMessage](https://nodejs.dev/en/api/v18/http/#httpoutgoingmessage) |
| **Transform** implementations: | [zlib.Gzip](https://nodejs.dev/en/api/v18/zlib/#zlibcreategzipoptions), [zlib.Gunzip](https://nodejs.dev/en/api/v18/zlib/#zlibcreategunzipoptions), [crypto.Hmac](https://nodejs.dev/en/api/v18/crypto/#hmac), [stream.PassThrough](https://nodejs.org/docs/latest-v18.x/api/stream.html#class-streampassthrough) |
| | |


## Node.js Stream Composition Patterns

There are two patterns available for Node.js stream composition: Readable.pipe() and stream.pipeline().

The
[Readable.pipe()](https://nodejs.org/docs/latest-v18.x/api/stream.html#readablepipedestination-options)
method was introduced in Node.js v0.10 (released in 2013). The .pipe() method
enabled elegant stream composition but correct error handling was difficult.

The
[stream.pipeline()](https://nodejs.org/docs/latest-v18.x/api/stream.html#streampipelinesource-transforms-destination-options)
function was introduced in Node.js v10 (released in 2018). It addresses the
drawbacks with .pipe(). The "node:stream/promises" package, available since
Node.js v15 (released in 2020), simplifies stream error handling further by
making .pipeline() compatible with async/await.


## Composing Streams the Old Way with Readable.pipe()

The .pipe() function is used to compose a readable stream with other
writable streams. The following example demonstrates a solution to printing a gzipped
file to stdout.

```js
fs.createReadStream(inputFile)
  .pipe(zlib.createGunzip())
  .pipe(process.stdout);
```

This simple example has two problems:

1. It is missing error handling.
2. It cannot be awaited.

Adding error handling and promises will result in our .pipe() solution looking
something like the following:

```javascript
await new Promise((resolve, reject) => {
  fs.createReadStream(inputFile)
    .on('error', reject)
    .pipe(zlib.createGunzip())
    .on('error', reject)
    .pipe(process.stdout)
    .on('error', reject)
    .on('finish', resolve);
});
```

The readable and writable streams all need to have the error handler registered
separately.  In non-trivial applications, different parts of the stream
composition are likely to be defined in different functions. In that case, it
will be difficult to identify if errors are being handled correctly.

When error handling is missing, important context will be missing from logs and
memory leaks could be introduced.

The .pipe() chaining pattern does not close the writable destination for us
when an error occurs.  If we were writing to a file then our error handling may
also need to explicitly close the file to avoid a file descriptor leak.


## Better Stream Composition with stream.pipeline()

The Node.js core stream module includes the stream.pipeline() utility
function for addressing the above issues with Readable.pipe():

1. The pipeline can be awaited without Promise boilerplate.
2. All pipeline errors can be handled with a single promise rejection.
3. All streams are closed when an error occurs, avoiding file descriptor leaks.

We can import the promisified version from "node:stream/promises":

```js
const { pipeline } = require('node:stream/promises');
```

The stream composition is defined with a single call to pipeline() which
takes a Readable source, zero or more Transforms, and a Writable destination:

```js
pipeline(
  fs.createReadStream(inputFile),
  zlib.createGunzip(),
  process.stdout
)
```

The pipeline can be awaited and all errors can be handled in a single catch block:

```javascript
await pipeline(
  fs.createReadStream(inputFile),
  zlib.createGunzip(),
  process.stdout
).catch(err) {
  throw VError({ cause: err, info: { inputFile } }, 'MyPipelineFailed');
};
```

The stream.pipeline() function encourages us to define the stream composition
in one place and gives us confidence stream errors are handled correctly.
