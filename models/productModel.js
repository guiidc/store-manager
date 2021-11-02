const { ObjectId } = require('mongodb');
const mongoConnection = require('./connection');

async function addProduct(name, quantity) {
  const product = await mongoConnection.getConnection()
  .then((db) => db.collection('products').insertOne({ name, quantity }));
  return { _id: product.insertedId, name, quantity };
}

async function getProductById(id) {
  if (!ObjectId.isValid(id)) return null;
  const product = await mongoConnection.getConnection()
  .then((db) => db.collection('products').findOne({ _id: ObjectId(id) }));
  return product;
}

async function getProductByName(name) {
  const product = await mongoConnection.getConnection()
  .then((db) => db.collection('products').findOne({ name }));
  return product;
}

async function getAllProducts() {
  const products = await mongoConnection.getConnection()
  .then((db) => db.collection('products').find().toArray());
  return products;
}

async function updateProduct(id, name, quantity) {
  if (!ObjectId.isValid(id)) return null;
  await mongoConnection.getConnection()
  .then((db) => db.collection('products')
  .updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } }));
  return { _id: id, name, quantity };
}

async function removeProduct(id) {
  if (!ObjectId.isValid(id)) return null;
  const removedProduct = await getProductById(id);
  const { name, quantity } = removedProduct;
  await mongoConnection.getConnection()
  .then((db) => db.collection('products').deleteOne({ _id: ObjectId(id) }));
  return { _id: id, name, quantity };
}

async function updateStock(id, quantity) {
  if (quantity < 0) return null;
  const updatedProduct = await mongoConnection.getConnection()
  .then((db) => db.collection('products').updateOne({ _id: ObjectId(id) }, { $set: { quantity } }));
  return updatedProduct;
}

module.exports = { 
  addProduct,
  getProductById,
  getProductByName,
  getAllProducts,
  updateProduct,
  removeProduct,
  updateStock,
};