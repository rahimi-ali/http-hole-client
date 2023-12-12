# Minimum Viable Just Works Client for HTTP Hole

This is a command line client for http-hole written with node. It subscribes to a number of webhooks on the `http hole server` specified via its config file and calls user specified http endpoints for each one allowing you to replay webhook calls to your public `http hole server` on you local machine for testing and development.

## Usage

1. Install dependencies using `npm install`
2. copy `config.example.json` to `config.json` and edit it to suit your needs.
3. run `node index.js` to start the client.

## Warnings

This is a local development tool only and comes with no guarantee for scalability or security.

If you set your `http hole server` webhook path as the listener for the same webhook you will create an infinite loop. Don't do that unless you like crashing things!
