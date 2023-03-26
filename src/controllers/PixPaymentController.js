if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const {GNRequest} = require('../configs/gerencianet.js');
  
const reqGNAlready = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET
});

class PixPaymentController {
  async create(req, res) {
    const { price } = req.body;
      const reqGN = await reqGNAlready;
      const dataCob = {
        calendario: {
          expiracao: 3600
        },
        valor: {
          original: "0.01"
        },
        chave: 'a1f3e115-02ea-4dcd-be23-551b0a0bfca6',
        solicitacaoPagador: 'Cobrança dos serviços prestados.'
      };
    
      const cobResponse = await reqGN.post('/v2/cob', dataCob);
      const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);
      console.log(cobResponse.data, "<<<<--->>>>", qrcodeResponse.data)

      return res.send([qrcodeResponse.data])
  }

  async index(req, res) {
      const reqGN = await reqGNAlready;
      const newDate = new Date();
      let date = newDate.getDate();
      let month;
      let year = newDate.getFullYear();

      if(newDate.getMonth() <= 9) {
        month = `0${newDate.getMonth() + 1}`;
      } else {
        month = newDate.getMonth() + 1;
      }
    
      const cobResponse = await reqGN.get(`/v2/cob?inicio=${year}-01-01T16:01:35Z&fim=${year}-${month}-${date}T20:01:35Z`);
      return res.send(cobResponse.data);
  }

  async show(req, res) {
      console.log(req.body);
      return res.send('200');
  }
}

module.exports = PixPaymentController;