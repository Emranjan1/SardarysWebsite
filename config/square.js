// config/square.js
const { Client } = require('square');

const squareClient = new Client({
  environment: 'sandbox', // Change to 'production' when you're ready to go live
  accessToken: 'EAAAl8obqqrSn0tVghLaYQGXzP9tkl2UUvBaDPXZxQudXvFOvuu-Y6p1d1_JpEkJ' // Your Square access token
});

module.exports = squareClient;

