const Machine = require('../models/Machine')
const { buildMachinePayload, sendInternalServerError } = require('../utils/http')

function createAdminListMachinesHandler({ machineModel = Machine } = {}) {
  return async (_req, res) => {
    try {
      const machines = await machineModel.find().sort({ createdAt: -1 })
      return res.status(200).json(machines)
    } catch (error) {
      return sendInternalServerError(res, '/admin/machines GET', error)
    }
  }
}

function createAdminCreateMachineHandler({ machineModel = Machine } = {}) {
  return async (req, res) => {
    try {
      const machine = new machineModel(buildMachinePayload(req.body))
      await machine.save()
      return res.status(201).json(machine)
    } catch (error) {
      console.error('[/admin/machines POST]', error.message)
      return res.status(400).json({ message: 'Makine kaydı oluşturulamadı' })
    }
  }
}

function createAdminUpdateMachineHandler({ machineModel = Machine } = {}) {
  return async (req, res) => {
    try {
      const updatedMachine = await machineModel.findByIdAndUpdate(
        req.params.id,
        buildMachinePayload(req.body),
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedMachine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(200).json(updatedMachine)
    } catch (error) {
      console.error('[/admin/machines/:id PUT]', error.message)
      return res.status(400).json({ message: 'Makine güncellenemedi' })
    }
  }
}

function createAdminDeleteMachineHandler({ machineModel = Machine } = {}) {
  return async (req, res) => {
    try {
      const deletedMachine = await machineModel.findByIdAndDelete(req.params.id)

      if (!deletedMachine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(200).json({ message: 'Makine silindi' })
    } catch (error) {
      return sendInternalServerError(res, '/admin/machines/:id DELETE', error)
    }
  }
}

function createListPublishedMachinesHandler({ machineModel = Machine } = {}) {
  return async (req, res) => {
    try {
      const { category, series, brand } = req.query

      const filter = { isPublished: true }

      if (category) filter.category = category
      if (series) filter.series = series
      if (brand) filter.brand = brand

      const machines = await machineModel.find(filter).sort({
        pressForceTon: 1,
        bendingLengthMm: 1,
        title: 1
      })

      return res.status(200).json(machines)
    } catch (error) {
      console.error('[/machines GET]', error)
      return sendInternalServerError(res, '/machines GET', error)
    }
  }
}

function createGetMachineByModelHandler({ machineModel = Machine } = {}) {
  return async (req, res) => {
    try {
      const machine = await machineModel.findOne({
        model: req.params.model,
        isPublished: true
      })

      if (!machine) {
        return res.status(404).json({ message: 'Machine not found' })
      }

      return res.status(200).json(machine)
    } catch (error) {
      console.error('[/machines/model/:model GET]', error)
      return sendInternalServerError(res, '/machines/model/:model GET', error)
    }
  }
}

function createGetMachineByIdHandler({ machineModel = Machine } = {}) {
  return async (req, res) => {
    try {
      const machine = await machineModel.findOne({
        _id: req.params.id,
        isPublished: true
      })

      if (!machine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(200).json(machine)
    } catch (error) {
      return sendInternalServerError(res, '/machines/:id GET', error)
    }
  }
}

module.exports = {
  createAdminCreateMachineHandler,
  createAdminDeleteMachineHandler,
  createAdminListMachinesHandler,
  createAdminUpdateMachineHandler,
  createGetMachineByIdHandler,
  createGetMachineByModelHandler,
  createListPublishedMachinesHandler
}
