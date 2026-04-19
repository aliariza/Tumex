import mongoose from 'mongoose'
import Machine from '../models/Machine.js'

import WC67K from '../../src/data/abkant/WC67K.js'
import PSH4 from '../../src/data/abkant/PSH4.js'
import DGE from '../../src/data/abkant/DGE.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tumex'

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
  const raw = slugify(oldFieldName)

  const replacements = {
    hydrolic_system: 'hydraulic_system',
    oil_cilynder: 'oil_cylinder'
  }

  return replacements[raw] || raw
}

function buildSpecs(oldSpecs) {
  if (!Array.isArray(oldSpecs)) return []

  return oldSpecs
    .map((item, index) => {
      const label = cleanString(item.key)
      const { field, value } = getOldSpecField(item)
      const key = normalizeSpecKey(field)

      if (!label || !key) return null

      return {
        key,
        label,
        value,
        order: index + 1
      }
    })
    .filter(Boolean)
}

function buildModel(series, pressForceTon, bendingLengthMm) {
  return `${series}-${pressForceTon}T-${bendingLengthMm}`
}

function buildTitle(brand, model) {
  return `${brand} ${model} Abkant Pres`
}

function buildMachineDoc({ brand, family, series, ton, length, oldSpecs }) {
  const pressForceTon = Number(ton)
  const bendingLengthMm = Number(length)
  const model = buildModel(series, pressForceTon, bendingLengthMm)

  return {
    category: 'abkant',
    brand,
    family,
    series,
    model,
    title: buildTitle(brand, model),
    pressForceTon,
    bendingLengthMm,
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

  for (const [ton, lengthMap] of Object.entries(seriesData || {})) {
    if (!lengthMap || typeof lengthMap !== 'object') continue

    for (const [length, oldSpecs] of Object.entries(lengthMap)) {
      if (!Array.isArray(oldSpecs)) continue

      docs.push(
        buildMachineDoc({
          ...meta,
          ton,
          length,
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
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  const docs = [
    ...flattenSeriesData(WC67K, {
      brand: 'Durmark',
      family: 'Abkant',
      series: 'WC67K'
    }),
    ...flattenSeriesData(PSH4, {
      brand: 'Durmark',
      family: 'Abkant',
      series: 'PSH4'
    }),
    ...flattenSeriesData(DGE, {
      brand: 'Durmark',
      family: 'Abkant',
      series: 'DGE'
    })
  ]

  console.log(`Prepared ${docs.length} ABKANT machine documents`)

  await upsertMachines(docs)

  console.log('Done')
  await mongoose.disconnect()
  console.log('Disconnected from MongoDB')
}

run().catch(async (error) => {
  console.error('Migration failed:')
  console.error(error)

  try {
    await mongoose.disconnect()
  } catch {}

  process.exit(1)
})