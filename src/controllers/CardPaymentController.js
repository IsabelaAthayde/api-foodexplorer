'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const sandbox = true;

const {generatePaymentToken, GNCardRequest} = require('../configs/gerencianet.js');
const reqGNAlready = GNCardRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET
});

class CardPaymentController {
  async create(req, res) {
    const {street, number, neighborhood, zipcode,
    city, state, name, email, cpf, birth, phone_number,
    brand, cardNumber, expiration_month, expiration_year, cvc } = req.body.data;
    const cartItems = req.body.items;

    const reqGN = await reqGNAlready;
    var cardData = new Object();

    cardData = {
      brand,
      number: cardNumber,
      cvv: cvc,
      expiration_month,
      expiration_year,
      reuse: true
    }

    const token = await generatePaymentToken(cardData, process.env.GN_ACCOUNT_CODE, sandbox)
    const {payment_token, card_mask} = token.data;
    console.log(token.data, "pa:", payment_token, card_mask)

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
            payment_token: payment_token,
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

      return res.json(cobRES.data)
    } catch(e) {
      console.error(e)
    }
  }

}

module.exports = CardPaymentController;