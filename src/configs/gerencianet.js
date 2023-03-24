const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

const cert = fs.readFileSync(
  path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`)
);

const agent = new https.Agent({
  pfx: cert,
  passphrase: ''
});

const authenticate = ({ clientID, clientSecret }) => {
  const credentials = Buffer.from(
    `${clientID}:${clientSecret}`
  ).toString('base64');

  return axios({
    method: 'POST',
    url: `${process.env.GN_PIX_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: {
      grant_type: 'client_credentials'
    }
  });
};

const GNRequest = async (credentials) => {
  const authResponse = await authenticate(credentials);
  const accessToken = authResponse.data?.access_token;

  return axios.create({
    baseURL: process.env.GN_PIX_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

const createPaymentToken = async () => {
  let salt = await axios.get(`https://tokenizer.gerencianet.com.br/salt`, {'account-code': `${process.env.GN_ACCOUNT_CODE}`})
  .then(function (response) {
    return response;
  })

  let publicKey = await axios.get(`https://sandbox.gerencianet.com.br/v1/pubkey?code=${process.env.GN_ACCOUNT_CODE}`)
  .then(function (response) {
    return response.data;
  })

  return {
    salt,
    publicKey
  }
}; 


const authenticateCardAuthorization = ({clientID, clientSecret}) => {
  const credentials = Buffer.from(
    `${clientID}:${clientSecret}`
  ).toString('base64');

  return axios({
    method: 'POST',
    url: `https://sandbox.gerencianet.com.br/v1/authorize`,
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: {
      grant_type: 'client_credentials'
    }
  });
};

const GNCardRequest = async (credentials) => {
  const authResponse = await authenticateCardAuthorization(credentials);
  const accessToken = authResponse.data?.access_token;

  return axios.create({
    baseURL: 'https://sandbox.gerencianet.com.br',
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

const generatePaymentToken = async () => {
  const payment_token = await createPaymentToken();
    
  let cardData = {
    brand,
    number,
    cvv,
    expiration_month,
    expiration_year,
    salt: "salt.gerado.aqui",
    reuse: 1

}
module.exports = {GNRequest, createPaymentToken, GNCardRequest};