const mongoose = require('mongoose')
const Machine = require('../models/Machine')

async function loadDataModule(relativePath) {
  const mod = await import(relativePath)
  return mod.default || mod
}

function cleanString(value) {
  if (value == null) return ''
  return String(value).trim()
}

function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function getOldSpecField(specItem) {
  const entries = Object.entries(specItem).filter(([key]) => key !== 'key')
  if (!entries.length) return { field: 'unknown', value: '' }

  const [field, value] = entries[0]
  return {
    field: cleanString(field),
    value: cleanString(value)
  }
}

function normalizeSpecKey(oldFieldName) {
  return slugify(oldFieldName)
}

function parsePowerKw(powerText) {
  const normalized = cleanString(powerText).toUpperCase().replace('KW', '')
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

function buildSpecs(oldSpecs) {
  if (!Array.isArray(oldSpecs)) return []

  return oldSpecs
    .map((item, index) => {
      const label = cleanString(item.key)
      const { field, value } = getOldSpecField(item)
      const key = normalizeSpecKey(field)

      if (!key) return null

      return {
        key,
        label: label || key,
        value,
        order: index + 1
      }
    })
    .filter(Boolean)
}

function buildMachineDoc({ brand, family, series, power, size, oldSpecs }) {
  const powerKw = parsePowerKw(power)
  const workingAreaCode = cleanString(size)
  const model = `${series}-${powerKw}KW-${workingAreaCode}`

  return {
    category: 'laser-cutting',
    brand,
    family,
    series,
    model,
    title: `${brand} ${model} Fiber Lazer Kesim Makinesi`,
    powerKw,
    workingAreaCode,
    description: '',
    price: 0,
    image: '',
    gallery: [],
    specs: buildSpecs(oldSpecs),
    isPublished: true
  }
}

function flattenSeriesData(seriesData, meta) {
  const docs = []

  for (const [power, sizeMap] of Object.entries(seriesData || {})) {
    if (!sizeMap || typeof sizeMap !== 'object') continue

    for (const [size, oldSpecs] of Object.entries(sizeMap)) {
      if (!Array.isArray(oldSpecs)) continue

      docs.push(
        buildMachineDoc({
          ...meta,
          power,
          size,
          oldSpecs
        })
      )
    }
  }

  return docs
}

async function upsertMachines(docs) {
  for (const doc of docs) {
    await Machine.findOneAndUpdate(
      {
        category: doc.category,
        series: doc.series,
        model: doc.model
      },
      { $set: doc },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    )

    console.log(`Upserted: ${doc.model}`)
  }
}

async function run() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tumex'

  const D_DLCModule = await loadDataModule('../../src/data/laser/D-DLC.js')
  const DLCModule = await loadDataModule('../../src/data/laser/DLC.js')
  const D_DLC_SModule = await loadDataModule('../../src/data/laser/D-DLC-S.js')

  const D_DLCData = D_DLCModule.D_DLCData || D_DLCModule
  const DLCData = DLCModule.DLCData || DLCModule
  const D_DLC_SData = D_DLC_SModule.D_DLC_SData || D_DLC_SModule

  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  const docs = [
    ...flattenSeriesData(D_DLCData, {
      brand: 'Durmark',
      family: 'Fiber Lazer',
      series: 'D-DLC'
    }),
    ...flattenSeriesData(DLCData, {
      brand: 'Durmark',
      family: 'Fiber Lazer',
      series: 'DLC'
    }),
    ...flattenSeriesData(D_DLC_SData, {
      brand: 'Durmark',
      family: 'Fiber Lazer',
      series: 'D-DLC-S'
    })
  ]

  console.log(`Prepared ${docs.length} laser cutting machine documents`)

  await upsertMachines(docs)

  console.log('Done')
  await mongoose.disconnect()
  console.log('Disconnected from MongoDB')
}

run().catch(async (error) => {
  console.error('Laser migration failed:')
  console.error(error)

  try {
    await mongoose.disconnect()
  } catch (_) {}

  process.exit(1)
})