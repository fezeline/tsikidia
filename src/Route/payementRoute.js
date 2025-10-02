const express = require('express');
const router = express.Router();

const {
  getAllPayementController,
  createPayementController,
  updatePayementController,
  deletePayementController,
  verifierStatusController,
  getModePayementController,

} = require('../Controller/payementController');

// Routes Paiement
router.get('/', getAllPayementController);
router.post('/', createPayementController);
router.put('/:id', updatePayementController);
router.delete('/:id', deletePayementController);
router.get('/:id/status', verifierStatusController);
router.get('/:id/mode', getModePayementController);


module.exports = router;
