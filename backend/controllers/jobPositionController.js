const JobPosition = require('../models/JobPosition')
const { buildJobPositionPayload, sendInternalServerError } = require('../utils/http')

function createAdminListJobPositionsHandler({ jobPositionModel = JobPosition } = {}) {
  return async (_req, res) => {
    try {
      const positions = await jobPositionModel.find().sort({ sortOrder: 1, createdAt: -1 })
      return res.status(200).json(positions)
    } catch (error) {
      return sendInternalServerError(res, '/admin/job-positions GET', error)
    }
  }
}

function createAdminCreateJobPositionHandler({ jobPositionModel = JobPosition } = {}) {
  return async (req, res) => {
    try {
      const position = new jobPositionModel(buildJobPositionPayload(req.body))
      await position.save()
      return res.status(201).json(position)
    } catch (error) {
      console.error('[/admin/job-positions POST]', error.message)
      return res.status(400).json({ message: 'Pozisyon oluşturulamadı' })
    }
  }
}

function createAdminUpdateJobPositionHandler({ jobPositionModel = JobPosition } = {}) {
  return async (req, res) => {
    try {
      const updatedPosition = await jobPositionModel.findByIdAndUpdate(
        req.params.id,
        buildJobPositionPayload(req.body),
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedPosition) {
        return res.status(404).json({ message: 'Pozisyon bulunamadı' })
      }

      return res.status(200).json(updatedPosition)
    } catch (error) {
      console.error('[/admin/job-positions/:id PUT]', error.message)
      return res.status(400).json({ message: 'Pozisyon güncellenemedi' })
    }
  }
}

function createAdminDeleteJobPositionHandler({ jobPositionModel = JobPosition } = {}) {
  return async (req, res) => {
    try {
      const deletedPosition = await jobPositionModel.findByIdAndDelete(req.params.id)

      if (!deletedPosition) {
        return res.status(404).json({ message: 'Pozisyon bulunamadı' })
      }

      return res.status(200).json({ message: 'Pozisyon silindi' })
    } catch (error) {
      return sendInternalServerError(res, '/admin/job-positions/:id DELETE', error)
    }
  }
}

function createListPublishedJobPositionsHandler({ jobPositionModel = JobPosition } = {}) {
  return async (_req, res) => {
    try {
      const positions = await jobPositionModel
        .find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: -1 })

      return res.status(200).json(positions)
    } catch (error) {
      return sendInternalServerError(res, '/job-positions GET', error)
    }
  }
}

module.exports = {
  createAdminCreateJobPositionHandler,
  createAdminDeleteJobPositionHandler,
  createAdminListJobPositionsHandler,
  createAdminUpdateJobPositionHandler,
  createListPublishedJobPositionsHandler
}
