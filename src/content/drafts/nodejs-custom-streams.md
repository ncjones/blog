---
title: Node.js Custom Streams
date: 2024-06-14
author: Nathan
desc: |
  How to create custom Node.JS readable, writable and transformer stream
  components.
img: /img/manuscript-on-wooden-desk.webp
---


<div class="p-4 bg-gray-400 bg-opacity-5 rounded-lg shadow-sm flex space-x-2 mt-12">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
  <div>
    <div>This is a draft!</div>
    </div>
  </div>
</div>

<div class="p-4 bg-gray-400 bg-opacity-5 rounded-lg shadow-sm flex space-x-2 mt-12">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <div>
    <div><b>This is part of a series on handling streams with Node.js</b></div>
      Part 1: <a href="/posts/nodejs-stream-composition">Node.js Stream Composition</a><br>
      Part 2: <a href="/posts/nodejs-custom-streams">Node.js Custom Streams</a><br>
      Part 3: [[Streaming to AWS S3 with Node.js]] <br>
      Part 4: [[Streaming JSON Lines with Node.js]] <br>
    </div>
  </div>
</div>


## Overview

Node.js `stream.Readable`, `stream.Writable` and `stream.Transform` are base
classes that can be extended to create custom streams. They have internal
methods that are intended to be overridden by implementors. The internal
methods are prefixed with an underscore. The internal methods should not be
invoked directly.

Each of the base classes has a constructor which takes options to control the
stream behavior. The base constructor must be invoked even when no options are
supplied. 

## Object Mode

The “objectMode” option allows a stream to handle objects instead of buffers.
Transform implementations can also specify object mode for just the readable or
writable sides of the stream by using “readableObjectMode” or
“writableObjectMode” options respectively.

When composing stream pipelines, the modes for each interfacing stream
component must match. For example, piping a readable in object mode into a
non-object mode writable like
[zlib.Gzip]([https://nodejs.org/api/zlib.html#zlibcreategzipoptions](https://nodejs.org/api/zlib.html#zlibcreategzipoptions))
would produce an error.

See: [https://nodejs.org/api/stream.html#object-mode](https://nodejs.org/api/stream.html#object-mode)

## Shorthand Syntax

The stream.Readable, stream.Writable and stream.Transform base classes can be
instantiated directly and the overridable methods can be provided as
constructor options. This pattern avoids some boilerplate but makes the code
harder to understand. Defining a new class that extends Readable, Writable or
Transform will improve clarity.

## Custom Readable

Readable is implemented by extending stream.Readable and overriding the
`_read()` method. The `_read()` implementation should fetch underlying data and
call `this.push()` until pushing returns false. The value `null` is pushed to
indicate the end of the stream.

### Official Guide for Implementing Readable
[https://nodejs.org/api/stream.html#implementing-a-readable-stream](https://nodejs.org/api/stream.html#implementing-a-readable-stream)

### Tips for Implementing Readable

- Readable is the more complicated stream type to implement because back
  pressure needs to be respected.
- The null reference pushed to end a readable stream is not propagated to the
  connected writable streams.

### Respecting Readable Back Pressure

The push function returns false to indicate back pressure is being applied.
This will happen when the stream’s buffer high-water mark is met. Respecting
the back pressure signal prevents buffers from growing faster than they can be
consumed. Respecting back pressure significantly improves memory efficiency and
allows a streaming application to handle arbitrarily large streams.

### Readable Example Using Item Emitter

Delegating to a stateful [EventEmitter](https://nodejs.dev/en/api/v19/events/#eventemitter) that can be started and stopped can help simplify the implementation of a custom readable.

The `_destroy()` method also needs to be overridden to clean up the item emitter when a stream pipeline encounters an error.

```javascript
class MyReadable extends stream.Readable {

  constructor({ itemEmitter }) {
	super({ objectMode: true });
	this.itemEmitter = itemEmitter;
	this.itemEmitter.on('item', item => {
	  if(!this.push(item)) {
		this.itemEmitter.stop();
	  }
	});
	this.itemEmitter.on('done', () => {
	  this.push(null);
	});
	this.itemEmitter.on('error', (err) => {
	  this.destroy(err);
	});

  }

  _destroy(err, callback) {
	this.itemEmitter.stop();
	callback(err);
  }

  _read() {
	this.itemEmitter.start();
  }

}
```



## Custom Writable

General pattern: implement `_write()` by consuming a chunk and then notifying the callback. 


### Writable Example
TODO example


### Official guide for implementing Writable
[https://nodejs.org/api/stream.html#implementing-a-writable-stream](https://nodejs.org/api/stream.html#implementing-a-writable-stream)

### Tips for Implementing Writable

* The `_write()` function can be async.

## Custom Transform

Transform is implemented by overriding the `_transform()` method. The `_transform()` implementation should call `this.push()` with transformed data and then notify the callback. 

### Transform Example

```javascript
class MyObjectTransform extends stream.Transform {
  constructor() {
	super({ objectMode: true });
  }
  _transform(item, encoding, callback) {
	this.push(transformItem(item));
	callback();
  }
}
```


### Official guide for implementing Transform
[https://nodejs.org/api/stream.html#implementing-a-transform-stream](https://nodejs.org/api/stream.html#implementing-a-transform-stream)

### Tips for Implementing Transform

- The \_transform() method can be async. When a transform depends on
  asynchronous I/O it can simply await the operation before notifying the
  callback.
- A transformer can filter out objects from the stream by making the push
  conditional.
- Back pressure doesn't need to be considered when implementing Transform. Back
  pressure is automatically propagated back to the Readable at the start of a
  stream pipeline.
- The `_flush()` method should be overridden when a Transform is buffering
  chunks such as when parsing items from a raw data stream.



TODO What happens when a transformer pushes null?

Todo what other methods can be overridden?



