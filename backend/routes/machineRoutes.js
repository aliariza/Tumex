const Machine = require('../models/Machine')
const { createMachineBrochurePdf } = require('../services/brochurePdfService')
const {
  createGetMachineByIdHandler,
  createGetMachineByModelHandler,
  createListPublishedMachinesHandler
} = require('../controllers/machineController')

function registerMachineRoutes(app, { machineModel = Machine } = {}) {
  app.get('/machines', createListPublishedMachinesHandler({ machineModel }))
  app.get('/machines/model/:model', createGetMachineByModelHandler({ machineModel }))
  app.get('/machines/:id/brochure.pdf', async (req, res) => {
    try {
      const machine = await machineModel.findOne({
        _id: req.params.id,
        isPublished: true
      }).lean()

      if (!machine) {
        return res.status(404).json({
          message: 'Makine bulunamadı'
        })
      }

      const safeFileName = machine.model
        ? machine.model.replace(/[^a-zA-Z0-9-_]/g, '_')
        : 'machine'

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${safeFileName}_brosur.pdf"`
      )

      createMachineBrochurePdf(machine, res)
    } catch (error) {
      console.error('[/machines/:id/brochure.pdf GET]', error)

      if (!res.headersSent) {
        res.status(500).json({
          message: 'PDF broşür oluşturulamadı'
        })
      }
    }
  })
  app.get('/machines/:id', createGetMachineByIdHandler({ machineModel }))
}

module.exports = { registerMachineRoutes }
