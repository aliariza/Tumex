const {
  createGetMachineByIdHandler,
  createGetMachineByModelHandler,
  createListPublishedMachinesHandler
} = require('../controllers/machineController')

function registerMachineRoutes(app) {
  app.get('/machines', createListPublishedMachinesHandler())
  app.get('/machines/model/:model', createGetMachineByModelHandler())
  app.get('/machines/:id', createGetMachineByIdHandler())
}

module.exports = { registerMachineRoutes }