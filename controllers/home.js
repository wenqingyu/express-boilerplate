/**
 * GET /*
 * Greeting page.
 */
exports.greet = (req, res) => {
  res.json({result: 'hello, this is express 4 boilerplate!'});
};
