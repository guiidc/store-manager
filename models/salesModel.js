const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

async function addSales(sales) {
  const insertedSales = await getConnection()
  .then((db) => db.collection('sales').insertOne({ itensSold: sales }));
  return { _id: insertedSales.insertedId, itensSold: sales };
}

async function getAllSales() {
  const allSales = await getConnection()
  .then((db) => db.collection('sales').find().toArray());
  return { sales: allSales };
}

async function getSaleById(id) {
  if (!ObjectId.isValid(id)) return null;
  return getConnection()
  .then((db) => db.collection('sales').findOne({ _id: ObjectId(id) }));
}

async function updateSale(id, sales) {
  if (!ObjectId.isValid(id)) return null;
  await getConnection()
  .then((db) => db.collection('sales')
  .updateOne({ _id: ObjectId(id) }, { $set: { itensSold: sales } }));
  return { _id: id, itensSold: sales };
}

async function deleteSale(id) {
  if (!ObjectId.isValid(id)) return null;
  const deletedSale = await getSaleById(id);
  await getConnection()
  .then((db) => db.collection('sales').deleteOne({ _id: ObjectId(id) }));
  return deletedSale;
}

module.exports = {
  addSales,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
