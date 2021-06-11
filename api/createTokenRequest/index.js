const AWS = require('aws-sdk');
const Ably = require('ably/promises');

exports.handler = async (event, context) => {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'awsThing' });
    
    const statusCode = '200';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(tokenRequestData);
    
    return { statusCode, body, headers };
};