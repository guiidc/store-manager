const salesService = require('../services/salesService');

async function addSales(req, res) {
  const insertedSales = await salesService.addSales(req.body);
  if (insertedSales.err) return res.status(422).json(insertedSales);
  res.status(200).json(insertedSales);
}

module.exports = { addSales };
