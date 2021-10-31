const nameError = {
  err: {
    code: 'invalid_data',
    message: '"name" length must be at least 5 characters long',
  },
};

function validateName(req, res, next) {
  console.log('oi')
  const { name } = req.body;
  if (typeof name !== 'string' || name.length < 6) {
    return res.status(422).json(nameError);
  }
  next();
}

module.exports = { validateName };
