# README

The Ably Chat Component is a WebComponent that demos real-time chat using Ably, right in your browser.

To run this web component in dev mode, in your terminal type:

```bash
npm run start
```

## Usage

You have to import our code as a module to load the Web Component into the DOM.
The easiest way is using a service like `skypack` that will stream the code directly from our `npm package`.

An up-to-date Ably JavaScript SDK is required to be loaded before the Web Component is used as our component specifically uses the Ably SDK.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ably Chat</title>
    
    <script src="https://cdn.ably.io/lib/ably.min-1.js" lang="text/javascript"></script>
    <script src="https://cdn.skypack.dev/ably-chat-component" type="module"></script>
</head>
<body>    
    <ably-chat
        data-api-key="your-ably-api-key-here">
    </ably-chat>
</body>
</html>
```

You will want to use `Ably Token Authentication` for production.

## Configuration

The component can be configured through setting attributes.

While you're developing or testing, you can set your API key using `data-api-key`.

```html
<ably-chat data-api-key="your-api-key-here-for-dev"></ably-chat>
```

**This is INSECURE.** It makes your PRIVATE API key available to the public and you should
never do this in a production system. It is, however, useful for testing.

When you're deploying to production you'll want to use `createTokenRequest` to create
a temporary authentication token. Typically this will involve storing your API key in a
server side component, and exposing a URL for the Ably SDK to call.

You can configure this by setting the `data-get-token-url` attribute.

```html
<ably-chat data-get-token-url="https://my-token-api.com/createTokenRequest"></ably-chat>
```

This is the recommended way to include Ably API keys in front-end components.

## Setting up token authentication

Once you have **signed up for Ably and have your own API key** you can use the `AWS Lambda` function in `./api/createTokenRequest.js` if you'd like to create your own token endpoint.

If you run npm install and zip/upload the resulting directory (including the `node_modules`) directory to a Lambda + API Gateway, you can be up and running in no time.

The `Lambda Function` in `api/createTokenRequest` expects an environment variable to be configured called **ABLY_API_KEY** with your API key in it.