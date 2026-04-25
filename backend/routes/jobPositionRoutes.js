const JobPosition = require('../models/JobPosition')
const { createListPublishedJobPositionsHandler } = require('../controllers/jobPositionController')

function registerJobPositionRoutes(app, { jobPositionModel = JobPosition } = {}) {
  app.get('/job-positions', createListPublishedJobPositionsHandler({ jobPositionModel }))
}

module.exports = { registerJobPositionRoutes }
