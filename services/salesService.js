const salesModel = require('../models/salesModel');

const quantityError = {
  err: {
    code: 'invalid_data',
    message: 'Wrong product ID or invalid quantity',
  },
};

function validateQuantityLength(sales) {
  const quantitys = sales.filter(({ quantity }) => quantity < 1);
  if (quantitys.length) return false;
  return true;
}

function validateQuantityType(sales) {
  const quantitys = sales.filter(({ quantity }) => typeof quantity === 'string');
  if (quantitys.length) return false;
  return true;
}

async function addSales(sales) {
  if (!validateQuantityLength(sales)) return quantityError;
  if (!validateQuantityType(sales)) return quantityError;
  const insertedSales = await salesModel.addSales(sales);
  return insertedSales;
}

async function getAllSales() {
  return salesModel.getAllSales();
}

async function getSaleById(id) {
 return salesModel.getSaleById(id);
}

module.exports = {
  addSales,
  getAllSales,
  getSaleById,
};
