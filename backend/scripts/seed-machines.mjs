/**
 * Seeds all machines (abkant + laser) into MongoDB.
 * Run from the backend folder:  node scripts/seed-machines.mjs
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'

// ── Legacy data files ────────────────────────────────────────────────────────
import WC67K    from '../../legacy/unused-files/frontend/src/data/legacy/abkant/WC67K.js'
import PSH4     from '../../legacy/unused-files/frontend/src/data/legacy/abkant/PSH4.js'
import DGE      from '../../legacy/unused-files/frontend/src/data/legacy/abkant/DGE.js'
import { DLCData }    from '../../legacy/unused-files/frontend/src/data/legacy/laser/DLC.js'
import { D_DLCData }  from '../../legacy/unused-files/frontend/src/data/legacy/laser/D-DLC.js'
import { D_DLC_SData } from '../../legacy/unused-files/frontend/src/data/legacy/laser/D-DLC-S.js'

// ── Machine model (CommonJS) ─────────────────────────────────────────────────
const require = createRequire(import.meta.url)
const Machine = require('../models/Machine.js')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'

// ── Image map ────────────────────────────────────────────────────────────────
const SERIES_IMAGES = {
  WC67K:   '/assets/images/WCK.png',
  PSH4:    '/assets/images/PSH4.png',
  DGE:     '/assets/images/DGE.png',
  DLC:     '/assets/images/DLC.png',
  'D-DLC': '/assets/images/D-DLC.png',
  'D-DLC-S': '/assets/images/D-DLC-S.png'
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function clean(value) {
  return value == null ? '' : String(value).trim()
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const KEY_FIXES = {
  hydrolic_system: 'hydraulic_system',
  oil_cilynder: 'oil_cylinder'
}

function buildAbkantSpecs(oldSpecs) {
  if (!Array.isArray(oldSpecs)) return []
  return oldSpecs.map((item, index) => {
    const label = clean(item.key)
    const entries = Object.entries(item).filter(([k]) => k !== 'key')
    if (!entries.length || !label) return null
    const [field, value] = entries[0]
    const rawKey = slugify(field)
    const key = KEY_FIXES[rawKey] || rawKey
    return { key, label, value: clean(value), order: index + 1 }
  }).filter(Boolean)
}

function buildLaserSpecs(oldSpecs) {
  if (!Array.isArray(oldSpecs)) return []
  return oldSpecs.map((item, index) => {
    const label = clean(item.key)
    const entries = Object.entries(item).filter(([k]) => k !== 'key')
    if (!entries.length || !label) return null
    const [field, value] = entries[0]
    const key = slugify(field)
    return { key, label, value: clean(value), order: index + 1 }
  }).filter(Boolean)
}

// ── Abkant: { ton: { length: [...specs] } } ──────────────────────────────────
function flattenAbkant(data, { brand, family, series }) {
  const docs = []
  for (const [ton, lengthMap] of Object.entries(data)) {
    for (const [length, specs] of Object.entries(lengthMap)) {
      if (!Array.isArray(specs)) continue
      const model = `${series}-${ton}T-${length}`
      docs.push({
        category: 'abkant',
        brand,
        family,
        series,
        model,
        title: `${series} ${ton}T ${length}mm`,
        pressForceTon: Number(ton),
        bendingLengthMm: Number(length),
        image: SERIES_IMAGES[series] || '',
        specs: buildAbkantSpecs(specs),
        isPublished: true
      })
    }
  }
  return docs
}

// ── Laser: { power: { size: [...specs] } } ───────────────────────────────────
function flattenLaser(data, { brand, family, series }) {
  const docs = []
  for (const [power, sizeMap] of Object.entries(data)) {
    for (const [size, specs] of Object.entries(sizeMap)) {
      if (!Array.isArray(specs)) continue
      const model = `${series}-${power}-${size}`
      const kwMatch = String(power).match(/(\d+(?:[.,]\d+)?)/)
      docs.push({
        category: 'laser-cutting',
        brand,
        family,
        series,
        model,
        title: `${series} ${power} ${size}`,
        powerKw: kwMatch ? Number(kwMatch[1].replace(',', '.')) : null,
        workingAreaCode: size,
        image: SERIES_IMAGES[series] || '',
        specs: buildLaserSpecs(specs),
        isPublished: true
      })
    }
  }
  return docs
}

// ── Upsert ───────────────────────────────────────────────────────────────────
async function upsertAll(docs) {
  let inserted = 0, updated = 0
  for (const doc of docs) {
    const result = await Machine.findOneAndUpdate(
      { category: doc.category, series: doc.series, model: doc.model },
      { $set: doc },
      { upsert: true, new: true, runValidators: true }
    )
    if (result.createdAt?.getTime() === result.updatedAt?.getTime()) {
      inserted++
    } else {
      updated++
    }
    process.stdout.write('.')
  }
  console.log(`\nInserted: ${inserted}  Updated: ${updated}`)
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB:', MONGO_URI)

  const docs = [
    ...flattenAbkant(WC67K,   { brand: 'Durmark', family: 'Abkant', series: 'WC67K'   }),
    ...flattenAbkant(PSH4,    { brand: 'Durmark', family: 'Abkant', series: 'PSH4'    }),
    ...flattenAbkant(DGE,     { brand: 'Durmark', family: 'Abkant', series: 'DGE'     }),
    ...flattenLaser(DLCData,    { brand: 'Durmark', family: 'Laser',  series: 'DLC'     }),
    ...flattenLaser(D_DLCData,  { brand: 'Durmark', family: 'Laser',  series: 'D-DLC'   }),
    ...flattenLaser(D_DLC_SData,{ brand: 'Durmark', family: 'Laser',  series: 'D-DLC-S' }),
  ]

  console.log(`Prepared ${docs.length} machine documents. Upserting...`)
  await upsertAll(docs)

  await mongoose.disconnect()
  console.log('Done.')
}

run().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
