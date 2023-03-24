'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const axios = require('axios');
const {hash} = require('bcryptjs');

const AppError = require('../utils/AppError');

const {createPaymentToken, GNCardRequest, authenticateCardAuthorization} = require('../configs/gerencianet.js');

const reqGNAlready = GNCardRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET
});

class CardPaymentController {
  async create(req, res) {
    const {street, number, neighborhood, zipcode, city, state, name, email, cpf, birth, phone_number} = req.body.data;
    const cartItems = req.body.items;

    const reqGN = await reqGNAlready;

    try{
      const body = {
        payment: {
          credit_card: {
            customer: {
              name,
              email,
              cpf,
              birth,
              phone_number
            },
            installments: 1,
            payment_token: 'cd79b344c2da4f00af6396f56d694a08ed251057',
            billing_address: {
              street,
              number,
              neighborhood,
              zipcode,
              city,
              state
            }
          }
        },
    
        items: cartItems,
        shippings: [{
          name: 'Default Shipping Cost',
          value: 0
        }]
      }

      let cobRES = await reqGN.post('/v1/charge/one-step', body)
      console.log(cobRES)

      return res.json(cobRES.data)
    } catch(e) {
      console.error(e)
    }
  }

  async created(req, res) {
    const {brand, number, cvv, expiration_month, expiration_year } = req.body;
    const reqGN = await reqGNAlready;

    
    // let cardData = {
    //   "brand":"mastercard",
    //   "number":"4539161853069500",
    //   "cvv":"762",
    //   "expiration_month":"02",
    //   "expiration_year":"2022",
    //   "salt":payment_token.salt.data,
    //   "reuse":"1"
    // };
      
      const encryptCardData = JSON.stringify(cardData);
      // if(!encryptCardData) {hash(JSON.stringify(cardData), 16)
      //   new AppError("Erro ao ler os dados, tente novamente mais tarde!");
      // }
        // let encryptedCardData =JSON.stringify(cardData);
        // console.log(encryptCardData, 'aaaaaaaaaaaaaaa<<<<<<', String(encryptCardData));

      // const axiosconfig = { 
      //   headers: {
      //     'account-code': `${process.env.GN_ACCOUNT_CODE}`,
      //     'Content-Type': 'application/json;charset=UTF-8'
      //   }
      // }
      // const cardTokenRes = await reqGN.post('/card', , axiosconfig)
      // .then((res) => {
      //   console.log("RESPONSE RECEIVED: ", res);
      // })
      // .catch((err) => {
      //   console.log("AXIOS ERROR: ", err);
      // })

}

module.exports = CardPaymentController;