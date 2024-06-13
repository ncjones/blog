---
title: Node.js Custom Streams
date: 2024-06-14
author: Nathan
desc: |
  How to stream jsonlines with Node.JS.
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
      Part 2: <a href="/posts/nodejs-streaming-json-lines">Streaming JSON Lines with Node.js</a><br>
    </div>
  </div>
</div>



JSON Lines (JSONL) is a flat file format with each line containing a well
formatted JSON object. It is similar to CSV in it's simplicity but allows for
arbitrary complexity within each line of data. JSONL is sometimes referred to
as Newline Delimited JSON (NDJSON).

JSONL is used as a structured streaming data format in a number of places:

- Structured logging typically uses JSONL. It is the format produced by Pino
  and is native to Fluentbit and Cloudwatch.
- Dynamo DB export produces gzipped JSONL.

JSONL is a good alternative choice for a data import/export format when
streaming is required and JSON, CSV, or XML is being considered. Implementing
Node.js stream transforms for encoding or decoding JSONL with zero dependencies
is relatively straight forward.


## JSONL Decoder

```javascript
class JsonlDecoder extends stream.Transform {

  constructor() {
    super({ readableObjectMode: true });
    this.buffer = '';
    this.maxLineLength = 2 ** 16; // 65k
  }

  _transform(chunk, encoding, callback) {
    const lines = (this.buffer + chunk.toString()).split('\n');
    this.buffer = lines.pop();
    for (var line of lines) {
      this.push(JSON.parse(line));
      if (this.bufferOverflow) {
        this.bufferOverflow = false;
        this.buffer = '';
      }
    }
    if (this.buffer.length > this.maxLineLength) {
      this.emit('skipped', {
        msg: 'Item skipped: max line length exceeded',
        bufferSize: this.buffer.length,
        bufferSlice: this.buffer.slice(0, 64),
      });
      this.buffer = '';
      this.bufferOverflow = true;
    }
    callback();
  }

  _flush(callback) {
    if(this.buffer.length) {
      this.push(JSON.parse(this.buffer));
    }
    callback();
  }
}
```


Example

```javascript
await stream.pipeline(
  fs.createReadStream('example.jsonl'),
  new JsonlDecoder(),
  myObjectWriter,
);
```

## JSONL Encoder

```javascript
class JsonlEncoder extends stream.Transform {

  constructor() {
    super({ writableObjectMode: true });
  }

  _transform(item, encoding, callback) {
    this.push(JSON.stringify(item));
    this.push('\n');
    callback();
  }

}
```

Example
```javascript
const readableObjectStream = stream.Readable.from([
    { id: 1 },
    { id: 2 },
  ]);
await stream.pipeline(
  readableObjectStream,
  new JsonlEncoder(),
  process.stdout,
);
```
