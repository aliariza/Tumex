const {
  createGetMachineByIdHandler,
  createGetMachineByModelHandler,
  createListPublishedMachinesHandler,
  createMachineBrochureHandler
} = require('../controllers/machineController')

function registerMachineRoutes(app) {
  app.get('/machines', createListPublishedMachinesHandler())
  app.get('/machines/model/:model', createGetMachineByModelHandler())
  app.get('/machines/:id/brochure.pdf', createMachineBrochureHandler())
  app.get('/machines/:id', createGetMachineByIdHandler())
}

module.exports = { registerMachineRoutes }