const { ObjectId } = require('mongodb');
const salesModel = require('../models/salesModel');
const productModel = require('../models/productModel');

const quantityError = {
  err: {
    code: 'invalid_data',
    message: 'Wrong product ID or invalid quantity',
  },
};
const idError = {
  err: {
    code: 'invalid_data',
    message: 'Wrong sale ID format',
  },
};
const stockError = {
  err: {
    code: 'stock_problem',
    message: 'Such amount is not permitted to sell',
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

async function decreaseStock(sales) {
  let quantitys = sales.map(async ({ productId, quantity }) => {
    const actualProduct = await productModel.getProductById(productId);
    return { _id: productId, saleQuantity: quantity, stockQuantity: actualProduct.quantity };
  });

  quantitys = await Promise.all(quantitys);

  if (!quantitys.every(({ saleQuantity, stockQuantity }) => saleQuantity <= stockQuantity)) {
    return false;
  }

  quantitys.forEach(async ({ _id, saleQuantity, stockQuantity }) => {
    await productModel.updateStock(_id, (stockQuantity - saleQuantity));
  });
  return true;
}

async function increaseStock(id) {
  const sale = await salesModel.getSaleById(id);
  sale.itensSold.forEach(async ({ productId, quantity }) => {
    const { quantity: stockQuantity } = await productModel.getProductById(productId);
    await productModel.updateStock(productId, (stockQuantity + quantity));
  });
}

async function addSales(sales) {
  if (!validateQuantityLength(sales)) return quantityError;
  if (!validateQuantityType(sales)) return quantityError;
  if (!await decreaseStock(sales)) return stockError;
  const insertedSales = await salesModel.addSales(sales);
  return insertedSales;
}

async function getAllSales() {
  return salesModel.getAllSales();
}

async function getSaleById(id) {
 return salesModel.getSaleById(id);
}

async function updateSale(id, sale) {
  if (!validateQuantityLength(sale)) return quantityError;
  if (!validateQuantityType(sale)) return quantityError;
  return salesModel.updateSale(id, sale);
}

async function deleteSale(id) {  
  if (!ObjectId.isValid(id)) return idError;
  await increaseStock(id);
  const deletedSale = await salesModel.deleteSale(id);
  return deletedSale;
}

module.exports = {
  addSales,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
