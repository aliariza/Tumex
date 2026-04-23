const Machine = require('../models/Machine')
const {
  createGetMachineByIdHandler,
  createGetMachineByModelHandler,
  createListPublishedMachinesHandler
} = require('../controllers/machineController')

function registerMachineRoutes(app, { machineModel = Machine } = {}) {
  app.get('/machines', createListPublishedMachinesHandler({ machineModel }))
  app.get('/machines/model/:model', createGetMachineByModelHandler({ machineModel }))
  app.get('/machines/:id', createGetMachineByIdHandler({ machineModel }))
}

module.exports = { registerMachineRoutes }
