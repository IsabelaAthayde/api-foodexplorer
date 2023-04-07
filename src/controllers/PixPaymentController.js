if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const AppError = require('../utils/AppError.js')
const {GNRequest} = require('../configs/gerencianet.js');
  
const reqGNAlready = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET
});

class PixPaymentController {
  async create(req, res) {
    const { price, productsCart } = req.body;

      const reqGN = await reqGNAlready;

      const dataCob = {
        calendario: {
          expiracao: 3600
        },
        valor: {
          original: String(price)
        },
        chave: 'a1f3e115-02ea-4dcd-be23-551b0a0bfca6',
        solicitacaoPagador: 'Cobrança dos serviços prestados.'
      };
    
      const cobResponse = await reqGN.post('/v2/cob', dataCob);
      const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);
      
      productsCart.txid = cobResponse.data.txid
      
      return res.send([qrcodeResponse.data, [cobResponse.data.txid, ...productsCart]])
  }

  async index(req, res) {
    const { txid, type} = req.query;
      const reqGN = await reqGNAlready;

      try {

        if(type == "less") {
          let cobResponse = await reqGN.get(`/v2/cob/${txid}`);
  
          return res.json(cobResponse.data);
  
        } else if(type == "all") {
          const newDate = new Date();
          let date = newDate.getDate();
          let prevmonth = newDate.getMonth();
          let year = newDate.getFullYear();
          let month;
          if(newDate.getMonth() <= 9) {
            month = `0${newDate.getMonth() + 1}`;
          } else {
            month = newDate.getMonth() + 1;
          }
        
          const cobResponse = await reqGN.get(`/v2/cob?inicio=${year}-03-25T16:01:35Z&fim=${year}-${month}-${date}T20:01:35Z`);
    
           return res.json(cobResponse.data);
        }
      } catch(e) {
        console.error(e);
      }

  }

  async show(req, res) {
      console.log(req.body);
      return res.send('200');
  }
}

module.exports = PixPaymentController;
