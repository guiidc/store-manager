const { getConnection } = require('./connection');

async function addSales(sales) {
  const insertedSales = await getConnection()
  .then((db) => db.collection('sales').insertOne({ sales }));
  return { _id: insertedSales.insertedId, itensSold: sales };
}

module.exports = { addSales };
