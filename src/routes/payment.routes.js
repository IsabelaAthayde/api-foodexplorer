const { Router } = require('express');

const paymentRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
// const roleAuthentication = require('../middlewares/roleAuthentication');

const PixPaymentController = require('../controllers/PixPaymentController.js');
const pixPaymentController = new PixPaymentController;

const CardPaymentController = require('../controllers/CardPaymentController.js');
const cardPaymentController = new CardPaymentController;

paymentRoutes.use(ensureAuthenticated)
  
paymentRoutes.post('/', pixPaymentController.create);
paymentRoutes.get('/cobrancas', pixPaymentController.index);
paymentRoutes.get('/webhook(/pix)?', pixPaymentController.show);

paymentRoutes.post('/card', cardPaymentController.create);

module.exports = paymentRoutes;