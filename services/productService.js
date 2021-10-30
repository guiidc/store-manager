const productModel = require('../models/productModel');

const nameError = {
  err: {
    code: 'invalid_data',
    message: '"name" length must be at least 5 characters long',
  },
};
const alreadyExistError = {
  err: {
    code: 'invalid_data',
    message: 'Product already exists',
  },
};
const quantityLengthError = {
  err: {
    code: 'invalid_data',
    message: '"quantity" must be larger than or equal to 1',
  },
};
const quantityTypeError = {
  err: {
    code: 'invalid_data',
    message: '"quantity" must be a number',
  },
};
const wrongIdError = {
  err: {
    code: 'invalid_data',
    message: 'Wrong id format',
  },
};

function validateName(name) {
  if (typeof name !== 'string' || name.length < 6) return false;
  return true;
}
function validateQuantityType(quantity) {
  if (typeof quantity === 'string') return false;
  return true;
}
function validateQuantityLength(quantity) {
  if (quantity < 1) return false;
  return true;
}

async function addProduct({ name, quantity }) {
  if (!validateName(name)) return nameError;
  if (!validateQuantityType(quantity)) return quantityTypeError;
  if (!validateQuantityLength(quantity)) return quantityLengthError;
  if (await productModel.getProductByName(name)) return alreadyExistError;
  const product = await productModel.addProduct(name, quantity);
  return product;
}

async function getAllProducts() {
  const products = await productModel.getAllProducts();
  return products;
}

async function getProductById(id) {
  const product = await productModel.getProductById(id);
  if (!product) return wrongIdError;
  return product;
}

async function updateProduct(id, name, quantity) {
  if (!validateName(name)) return nameError;
  if (!validateQuantityType(quantity)) return quantityTypeError;
  if (!validateQuantityLength(quantity)) return quantityLengthError;
  const updatedProduct = await productModel.updateProduct(id, name, quantity);
  return updatedProduct;
}

async function removeProduct(id) {
  const removedProduct = await productModel.removeProduct(id);
  if (!removedProduct) return wrongIdError;
  return removedProduct;
}

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  removeProduct,
};
