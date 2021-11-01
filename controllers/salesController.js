const salesService = require('../services/salesService');

const notFoundError = {
  err: {
    code: 'not_found',
    message: 'Sale not found',
  },
};

async function addSales(req, res) {
  const insertedSales = await salesService.addSales(req.body);
  if (insertedSales.err) return res.status(422).json(insertedSales);
  res.status(200).json(insertedSales);
}

async function getAllSales(req, res) {
  const sales = await salesService.getAllSales();
  res.status(200).json(sales);
}

async function getSaleById(req, res) {
  const { id } = req.params;
  const sales = await salesService.getSaleById(id);
  if (!sales) return res.status(404).json(notFoundError);
  res.status(200).json(sales);
}

module.exports = {
  addSales,
  getAllSales,
  getSaleById,
};
