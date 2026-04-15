const { MachineType } = require('../models/MachineType')

/**
 * Seeds the database with initial machine data.
 * Skips if data already exists to prevent duplicate inserts on restart.
 */
const insertData = async () => {
  const existing = await MachineType.countDocuments()
  if (existing > 0) return // already seeded

  const wc67kTypes = [
    { name: '30Tons', lengths: [{ length: 1600, price: 10000, stroke: 150 }] },
    {
      name: '40Tons',
      lengths: [
        { length: 1600, price: 11000, stroke: 150 },
        { length: 2000, price: 12000, stroke: 160 },
        { length: 2500, price: 13000, stroke: 170 }
      ]
    },
    { name: '50Tons', lengths: [{ length: 2500, price: 14000, stroke: 180 }] },
    {
      name: '63Tons',
      lengths: [
        { length: 2500, price: 15000, stroke: 190 },
        { length: 3200, price: 16000, stroke: 200 }
      ]
    },
    {
      name: '80Tons',
      lengths: [
        { length: 2500, price: 17000, stroke: 210 },
        { length: 3200, price: 18000, stroke: 220 }
      ]
    },
    {
      name: '100Tons',
      lengths: [
        { length: 2500, price: 19000, stroke: 230 },
        { length: 3200, price: 20000, stroke: 240 },
        { length: 4000, price: 21000, stroke: 250 }
      ]
    }
  ]

  const abkant = new MachineType({
    name: 'Abkant',
    series: [
      { name: 'WC67K', types: wc67kTypes },
      { name: 'PSH4', types: [] },
      { name: 'DGE', types: [] },
      { name: 'PSH8', types: [] }
    ]
  })

  const laserCutting = new MachineType({
    name: 'Laser-Cutting',
    series: [
      { name: 'DLC', types: [] },
      { name: 'D-DLC', types: [] },
      { name: 'D-DLC-S', types: [] }
    ]
  })

  await Promise.all([abkant.save(), laserCutting.save()])
  console.log('Seed data inserted')
}

module.exports = insertData
