const prisma = require('../prismaClient.cjs')
const { buildMachinePayload, sendInternalServerError } = require('../utils/http')
const { createMachineBrochurePdf } = require('../services/brochurePdfService')

function toPrismaCategory(category) {
  if (category === 'laser-cutting') return 'laser_cutting'
  if (category === 'laser-welding') return 'laser_welding'
  if (category === 'abkant') return 'abkant'
  return category
}

function fromPrismaCategory(category) {
  if (category === 'laser_cutting') return 'laser-cutting'
  if (category === 'laser_welding') return 'laser-welding'
  return category
}

function toApiMachine(machine) {
  if (!machine) return machine

  return {
    ...machine,
    _id: machine.id,
    category: fromPrismaCategory(machine.category),
    specs: machine.specs || []
  }
}

function toPrismaMachineData(body) {
  const payload = buildMachinePayload(body)

  const specs = Array.isArray(payload.specs)
    ? payload.specs
        .filter((spec) => spec && (spec.key || spec.label || spec.value))
        .map((spec, index) => ({
          key: String(spec.key || spec.label || `spec_${index + 1}`),
          label: String(spec.label || spec.key || `Spec ${index + 1}`),
          value: String(spec.value ?? ''),
          order: Number.isFinite(Number(spec.order)) ? Number(spec.order) : index + 1
        }))
    : []

  const data = {
    category: toPrismaCategory(payload.category),
    brand: payload.brand ?? null,
    family: payload.family ?? null,
    series: payload.series,
    model: payload.model,
    title: payload.title ?? null,
    description: payload.description ?? null,
    price: payload.price != null ? Number(payload.price) : null,
    isPublished: typeof payload.isPublished === 'boolean' ? payload.isPublished : true,
    image: payload.image ?? null,
    gallery: Array.isArray(payload.gallery) ? payload.gallery : [],

    pressForceTon:
      payload.pressForceTon != null && payload.pressForceTon !== ''
        ? Number(payload.pressForceTon)
        : null,

    bendingLengthMm:
      payload.bendingLengthMm != null && payload.bendingLengthMm !== ''
        ? Number(payload.bendingLengthMm)
        : null,

    powerKw:
      payload.powerKw != null && payload.powerKw !== ''
        ? Number(payload.powerKw)
        : null,

    workingAreaCode: payload.workingAreaCode ?? null
  }

  return { data, specs }
}

function createAdminListMachinesHandler() {
  return async (_req, res) => {
    try {
      const machines = await prisma.machine.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          specs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      return res.status(200).json(machines.map(toApiMachine))
    } catch (error) {
      return sendInternalServerError(res, '/admin/machines GET', error)
    }
  }
}

function createAdminCreateMachineHandler() {
  return async (req, res) => {
    try {
      const { data, specs } = toPrismaMachineData(req.body)

      const machine = await prisma.machine.create({
        data: {
          ...data,
          specs: {
            create: specs
          }
        },
        include: {
          specs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      return res.status(201).json(toApiMachine(machine))
    } catch (error) {
      console.error('[/admin/machines POST]', error.message)
      return res.status(400).json({ message: 'Makine kaydı oluşturulamadı' })
    }
  }
}

function createAdminUpdateMachineHandler() {
  return async (req, res) => {
    try {
      const { data, specs } = toPrismaMachineData(req.body)

      const updatedMachine = await prisma.machine.update({
        where: {
          id: req.params.id
        },
        data: {
          ...data,
          specs: {
            deleteMany: {},
            create: specs
          }
        },
        include: {
          specs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      return res.status(200).json(toApiMachine(updatedMachine))
    } catch (error) {
      console.error('[/admin/machines/:id PUT]', error.message)

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(400).json({ message: 'Makine güncellenemedi' })
    }
  }
}

function createAdminDeleteMachineHandler() {
  return async (req, res) => {
    try {
      await prisma.machine.delete({
        where: {
          id: req.params.id
        }
      })

      return res.status(200).json({ message: 'Makine silindi' })
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return sendInternalServerError(res, '/admin/machines/:id DELETE', error)
    }
  }
}

function createListPublishedMachinesHandler() {
  return async (req, res) => {
    try {
      const { category, series, brand } = req.query

      const where = {
        isPublished: true
      }
      if (category) where.category = toPrismaCategory(category)
      if (series) where.series = String(series)
      if (brand) where.brand = String(brand)

      const machines = await prisma.machine.findMany({
        where,
        orderBy: [
          { pressForceTon: 'asc' },
          { bendingLengthMm: 'asc' },
          { title: 'asc' }
        ],
        include: {
          specs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      return res.status(200).json(machines.map(toApiMachine))
    } catch (error) {
      console.error('[/machines GET]', error)
      return sendInternalServerError(res, '/machines GET', error)
    }
  }
}

function createGetMachineByModelHandler() {
  return async (req, res) => {
    try {
      const machine = await prisma.machine.findFirst({
        where: {
          model: req.params.model,
          isPublished: true
        },
        include: {
          specs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      if (!machine) {
        return res.status(404).json({ message: 'Machine not found' })
      }

      return res.status(200).json(toApiMachine(machine))
    } catch (error) {
      console.error('[/machines/model/:model GET]', error)
      return sendInternalServerError(res, '/machines/model/:model GET', error)
    }
  }
}

function createGetMachineByIdHandler() {
  return async (req, res) => {
    try {
        const machine = await prisma.machine.findFirst({
          where: {
            id: req.params.id,
            isPublished: true
          },
          include: {
          specs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      if (!machine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(200).json(toApiMachine(machine))
    } catch (error) {
      return sendInternalServerError(res, '/machines/:id GET', error)
    }
  }
}

function createMachineBrochureHandler() {
  return async (req, res) => {
    try {
      const machine = await prisma.machine.findFirst({
        where: {
          id: req.params.id,
          isPublished: true
        },
        include: {
          specs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      if (!machine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      const apiMachine = toApiMachine(machine)

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${apiMachine.model || 'machine'}-brochure.pdf"`
      )

      createMachineBrochurePdf(apiMachine, res)
    } catch (error) {
      console.error('[/machines/:id/brochure.pdf GET]', error)
      return sendInternalServerError(res, '/machines/:id/brochure.pdf GET', error)
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
  createListPublishedMachinesHandler,
  createMachineBrochureHandler
}