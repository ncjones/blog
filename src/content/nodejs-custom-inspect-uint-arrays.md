---
title: Custom Inspect for Node.js UInt Arrays
date: 2024-02-25
author: Nathan
desc: |
  Adding a [util.inspect.custom] method to Node.js UInt array types is a
  simple way to improve debugging experience when dealing with binary data. An
  example where this is beneficial is when inspecting Algorand blockchain
  transaction details.
img: /img/computer-with-binary-on-screen.jpg
---

The Node.js [util.inspect
function](https://nodejs.org/docs/latest-v20.x/api/util.html#utilinspectobject-options)
is what `console.log` uses internally to format objects. By default, when
inspecting binary data within Uint arrays, we get verbose raw integer values
that are harder to identify at a glance.

```js
const data = {
  bytes: Uint8Array.of(123, 45, 67),
};

console.log(data);
```

The default format for the above inspected Uint8Array will look like the
following:

```yaml
{ bytes: Uint8Array(3) [ 123, 45, 67 ] }
```

By defining a
[util.inspect.custom](https://nodejs.org/docs/latest-v20.x/api/util.html#custom-inspection-functions-on-objects)
method on any object, we can customize the display format used when the object
is inspected. The following example shows how the UInt8Array prototype can be
modified to have custom inspect formatting:

```js
import { inspect } from 'node:util';

Uint8Array.prototype[inspect.custom] = function () {
  return `UInt8[0x${Buffer.from(this).toString('hex')}]`;
}

const data = {
  bytes: Uint8Array.of(123, 45, 67),
};

console.log(data);
```

The console output from the above example will look like the following:

```yaml
{ bytes: UInt8[0x7b2d43] }
```

## Inspecting Algorand Transactions

Algorand addresses are usually presented as base32 encoding. By using base32 as
the default format when inspecting Uint8 arrays we get more compact output and
can spot Algorand sender and receiver addresses.

```js
import { inspect } from 'node:util';
import algosdk from 'algosdk';
import base32 from 'hi-base32';

Uint8Array.prototype[inspect.custom] = function () {
  return `UInt8[${base32.encode(this).replaceAll('=','')}]`;
}

// setup algod client, submit transaction
// see https://developer.algorand.org/docs/sdks/javascript/

const txInfo = await algosdk.waitForConfirmation(algodClient, txId, 4);
console.log(txInfo);
```

Console output for the inspected Algorand transaction will look like the
following:

```yaml
{
  sig: UInt8[3FMU46ANM2ZLSGJBUMXQRE6LUFMRYEU6ICYF4GFWKMJ2LJ5AF4HUXC7FWXNQGQZXI2EVCLXKG5VE3ATQCVSJ6CYWOMYRVCBPQLKY4AI],
  txn: {
    amt: 125,
    fee: 1000,
    fv: 28,
    gen: 'dockernet-v1',
    gh: UInt8[GPV7SJUAYE7VMR6WNT2DQYKBAZE4I4EOCQUICSKJP5HNGZ3562NQ],
    lv: 1028,
    note: UInt8[NBSWY3DPEB3W64TMMQ],
    rcv: UInt8[HNVCPPGOW2SC2YQ5BLGEWBG7BCG3TNRDK3DFPLSP4LINK62Z3IUQ],
    snd: UInt8[XJOVAFHGJ5J5QXVDVDICU3YNONSTEFLXDXREHJR2YBEKDCVYWYYA],
    type: 'pay'
  }
}
```
