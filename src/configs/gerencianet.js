const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
var JSEncrypt = require('node-jsencrypt');

const NodeRSA = require('node-rsa');

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

const getSaltAndPubKey = async (sandbox) => {
  let salt = await axios.get(`https://tokenizer.gerencianet.com.br/salt`, {'account-code': `${process.env.GN_ACCOUNT_CODE}`})
  .then(function (response) {
    return response;
  })

  let publicKey = await axios.get(`${sandbox ? ('https://sandbox.gerencianet.com.br/v1/pubkey?code=') 
  : ('https://api.gerencianet.com.br/v1/pubkey?code=')}${process.env.GN_ACCOUNT_CODE}`)
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

const GNCardRequest = async (credentials, sandbox) => {
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

const encryptCardData = async (cardData, saltTokenizer, publicKey) => {
  cardData.salt = saltTokenizer;

  console.log('cardData' + JSON.stringify(cardData));
  let crypt = await new JSEncrypt();

  try {
      await crypt.setPublicKey(publicKey);
      var encryptedCardData = await crypt.encrypt(JSON.stringify(cardData));

      return encryptedCardData;
  } catch (e) {
      console.error(e)
      alert('erro ao criptografar dados')
  }
}

const generatePaymentToken = async (cardData, account_identifier, sandbox) => {
  const saltAndPubKey = await getSaltAndPubKey(sandbox);

  let encryptedData = await encryptCardData(cardData, saltAndPubKey.salt.data.data, saltAndPubKey.publicKey.data);

  let dataResponse = await axios({
    'method': 'POST',
    'url': `${ sandbox ? ('https://sandbox.gerencianet.com.br/v1/card') : ('https://tokenizer.gerencianet.com.br/card')}`,
    'headers': {
      'account-code': account_identifier,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({ "data": encryptedData })
  })
  .catch((err) => console.error(err));

  return dataResponse.data;
}

module.exports = {GNRequest, GNCardRequest, generatePaymentToken};