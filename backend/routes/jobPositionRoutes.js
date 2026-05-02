const { createListPublishedJobPositionsHandler } = require('../controllers/jobPositionController')

function registerJobPositionRoutes(app) {
  app.get('/job-positions', createListPublishedJobPositionsHandler())
}

module.exports = { registerJobPositionRoutes }