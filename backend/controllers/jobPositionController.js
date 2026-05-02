const prisma = require('../prismaClient.cjs')
const { buildJobPositionPayload, sendInternalServerError } = require('../utils/http')

function toApiJobPosition(position) {
  if (!position) return position

  return {
    ...position,
    _id: position.id
  }
}

function toPrismaJobPositionData(body) {
  const payload = buildJobPositionPayload(body)

  return {
    title: payload.title,
    department: payload.department,
    locationType: payload.locationType || 'Ofis içi',
    employmentType: payload.employmentType || 'Tam zamanlı',
    summary: payload.summary,
    highlights: Array.isArray(payload.highlights) ? payload.highlights : [],
    applicationEmail: payload.applicationEmail || 'info@tum-ex.com',
    applicationSubject: payload.applicationSubject || '',
    sortOrder:
      payload.sortOrder != null && payload.sortOrder !== ''
        ? Number(payload.sortOrder)
        : 0,
    isPublished:
      typeof payload.isPublished === 'boolean'
        ? payload.isPublished
        : Boolean(payload.isPublished)
  }
}

function createAdminListJobPositionsHandler() {
  return async (_req, res) => {
    try {
      const positions = await prisma.jobPosition.findMany({
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      })

      return res.status(200).json(positions.map(toApiJobPosition))
    } catch (error) {
      return sendInternalServerError(res, '/admin/job-positions GET', error)
    }
  }
}

function createAdminCreateJobPositionHandler() {
  return async (req, res) => {
    try {
      const position = await prisma.jobPosition.create({
        data: toPrismaJobPositionData(req.body)
      })

      return res.status(201).json(toApiJobPosition(position))
    } catch (error) {
      console.error('[/admin/job-positions POST]', error.message)
      return res.status(400).json({ message: 'Pozisyon oluşturulamadı' })
    }
  }
}

function createAdminUpdateJobPositionHandler() {
  return async (req, res) => {
    try {
      const updatedPosition = await prisma.jobPosition.update({
        where: {
          id: req.params.id
        },
        data: toPrismaJobPositionData(req.body)
      })

      return res.status(200).json(toApiJobPosition(updatedPosition))
    } catch (error) {
      console.error('[/admin/job-positions/:id PUT]', error.message)

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Pozisyon bulunamadı' })
      }

      return res.status(400).json({ message: 'Pozisyon güncellenemedi' })
    }
  }
}

function createAdminDeleteJobPositionHandler() {
  return async (req, res) => {
    try {
      await prisma.jobPosition.delete({
        where: {
          id: req.params.id
        }
      })

      return res.status(200).json({ message: 'Pozisyon silindi' })
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Pozisyon bulunamadı' })
      }

      return sendInternalServerError(res, '/admin/job-positions/:id DELETE', error)
    }
  }
}

function createListPublishedJobPositionsHandler() {
  return async (_req, res) => {
    try {
      const positions = await prisma.jobPosition.findMany({
        where: {
          isPublished: true
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      })

      return res.status(200).json(positions.map(toApiJobPosition))
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