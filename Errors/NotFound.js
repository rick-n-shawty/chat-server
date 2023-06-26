const NotFound = (req, res) => res.status(404).json({err: 'Resource not found'})
module.exports = NotFound