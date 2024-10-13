---
title: Shared Logging Context
date: 2024-10-12
author: Nathan
desc: |
  Shared logging context radically improves the quality of application logs
  while reducing developer burden. This can be achieved easily in Node.js using
  AsyncLocalStorage.
img: /img/segmented-layered-glowing-application-log-file.webp
---



Application logs are footprints that let us see what our applications have been doing. Without logging, we have little hope of debugging issues with remote systems. Often, analyzing logs is difficult because they do not include enough information.

Shared logging context is a pattern we can use to ensure logs always have enough information to correlate them back to the surrounding transaction context. In Node.js, AsyncLocalStorage helps to implement shared logging context easily.

## What Makes For Great Logging

There are three aspects to making effective logs. Log analysis becomes much easier when we emit log events that follow these principles.

1. **Structured Logs** — Emitting log events from our application as structured data allows us to query and visualize our logs with logging aggregators like Grafana, Datadog, Newrelic, or Cloudwatch.
2. **Event Type Discriminators** — Ensuring every logged event has a unique event type discriminator enables greater insights from our logging data. It allows us to treat any log event as a custom application metric.
3. **Common Log Context** — Log messages include additional structured attributes to provide context for the surrounding transaction execution context.

### Bad Logging Example

A typical server log for a web application may contain entries like the following:

```
[2024-10-01T10:10:00.013Z] Found 3 active widgets for customer b6c63
[2024-10-01T10:10:00.000Z] Response GET /customers/b6c63/widgets 200
```

There are several issues with the way these two entries appear in the log:

1. **The log events are unstructured** — The events present information optimized for human readability. Instead, we should use a log event format optimized for a log aggregator to make our logs indexed and searchable.
2. **The log event type is hard to identify** — When log messages contain dynamic text, it's infeasible to treat them as a log-based metric in a log aggregator.
3. **Additional context is in a separate log event** — To fully understand what the first log message relates to, we need to hunt for context in another log message.

### Good Logging Example

The following shows the same "Found 3 active widgets" log event from above but
reworked to address the issues mentioned above.

```json
{ timestamp: "2024-10-01T10:10:00.000Z", msg: "Active widgets found", widgetCount: 3, customerId: "b6c63", "method": "GET", "path": "/users/b6c63/widgets" }
```

The issues outlined previously have now been addressed:

1. **The log event is structured** — The event is emitted to the log as a simple JSON document that a log aggregator can easily consume and index.
2. **The log event has an identifiable type** — We can treat the static message "Active widgets found" as a unique discriminator to create log metrics in our log aggregator.
3. **The log event includes additional context** — The event includes details from the surrounding application transaction, such as the HTTP method and path.

The first two points — structured events and static log messages — are intuitive and straightforward. Realizing them mainly involves adopting and adhering to standards regarding how logging statements are emitted. The rest of this post focuses on the third point — including additional context in the log event — which poses more technical challenges.

## Better Logs Via Shared Context

A shared logging context enables a different approach to logging. Instead of emitting additional log events every time useful information is encountered, we can choose to simply update the log context. The common logging that occurs after every web request is completed will include the context that was attached while handling the request.

Decoupling log event emitters from their surrounding context also improves the separation of concerns in our modules. Emitting a contextualized log event no longer requires the caller's context to be explicitly provided.

An alternative to using shared logging context is to rely on a distributed tracing tool like Newrelic to provide log traceability. If a distributed trace ID is included in log events, related logs for a single transaction can be discovered easily. Including the context directly on every log event is a superior option, though, because the information is easier to find, and more powerful logging insights are possible.

SDKs for popular APM tools like Newrelic and Sentry also support and encourage this approach whereby log events are enhanced by additional context. For example, we can configure a single global exception handler in a front-end application that emits application error events with Sentry. By adding extra context, tags, and breadcrumbs at key points within our application, Sentry error events will contain more information to aid with debugging without us needing to add special error handling.


## Async Local Storage

How to create a shared logging context will vary by runtime environment. [Async Local Storage][async-local-storage] is the key enabler for creating a shared logging context in Node.js. It provides a mechanism for scoping a variable to an async call chain. All async tasks scheduled on the event loop will inherit the Async Local Storage store from their common ancestor task that initialized the store. Async Local Storage has been part of the Node.js standard library since Node.js 16 (released April 2021).

## Implementing Shared Log Context With Node.js

The following sections explain how to implement a shared logging context in Node.js. Although the code samples use the [Pino][pino] logging library and the [Hapi][] web application framework, the demonstrated patterns will apply to other logging libraries and application frameworks.

We will follow these high-level steps: 1) define a custom logging context object that can attach additional attributes from anywhere in our codebase; 2) configure our logger to include the current logging context in every emitted log event; and 3) configure our web server to attach details for every HTTP request to the shared logging context.

### Define Logging Context

Using AsyncLocalStorge, we can create a shared logging context object that accepts arbitrary additional attribute values for the current transaction context. The AsyncLocalStorage state for the current context is created using `enterWith()` when it is undefined.

```js
import { AsyncLocalStorage } from 'node:async_hooks';

const loggingContext = {

  _storage: new AsyncLocalStorage();

  get attributes() {
     return this._storage.getStore();
   },

  addAttribute(name, value) {
    if (!this.attributes) {
       this._storage.enterWith({});
    }
    this.attributes[name] = value;
  },
};
```

We must be careful about where we call the `addAttribute()` method within the application lifecycle. For instance, the AsyncLocalStorage might be scoped incorrectly if we call `addAttribute()` while the application starts. In that case, every web request handler could inherit the same AsyncLocalStorage state. There will be no issue if we only call `addAttribute()` while handling a web request.

### Include Shared Context in Log Events

We configure the logger to include shared context attributes in every log message. The following example shows how to configure Pino to include custom attributes in every log event.

```js
 export const logger = pino({
   // ...
   mixin() {
     return loggingContext.attributes ?? {};
   },
 });
```


### Add HTTP Request Attributes

We configure the web application server to add attributes relating to every request. The following example shows how to configure Hapi to include attributes relating the request ID, request path, and authenticated user.

```js
server.ext('onRequest', (req, h) => {
  loggingContext.addAttribute('req.id', req.info.id);
  loggingContext.addAttribute('req.path', req.path);
});
server.ext('onCredentials', (req, h) => {
  const creds = req.auth.credentials;
  loggingContext.addAttribute('credentials.subject', creds.sub);
});
```

We can also enhance the logging context by adding attributes from anywhere else we handle a transaction. For example, we could attach the ID of a specific resource type every time an instance is loaded from the database.

```js
async function loadWidget(id) {
  loggingContext.addAttribute('widgetId', widget.id);
  // ... get widget from database
}
```


## Summary

Including dynamic shared context in logs radically improves the usefulness of structured application logs. A shared logging context enables a different approach to logging whereby we can emit fewer but richer log events. In Node.js, this is easy to achieve by using AsyncLocalStorage and just a few lines of code to connect it to our web request logging.


[pino]: https://github.com/pinojs
[hapi]: https://hapi.dev
[async-local-storage]: https://nodejs.org/docs/latest-v20.x/api/async_context.html#class-asynclocalstorage
