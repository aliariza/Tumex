const prisma = require('../prismaClient.cjs')

const defaultJobPositions = [
  {
    title: 'Satış Temsilcisi',
    department: 'Satış',
    locationType: 'Ofis içi',
    employmentType: 'Tam zamanlı',
    summary: 'Tumex satış süreçlerinde müşteri ilişkileri ve teklif takibi yapacak takım arkadaşı.',
    highlights: [
      'Müşteri taleplerini takip etmek',
      'Teklif süreçlerine destek vermek',
      'CRM ve bayi iletişimini yönetmek'
    ],
    applicationEmail: 'info@tum-ex.com',
    applicationSubject: 'Satış Temsilcisi Başvurusu',
    sortOrder: 1,
    isPublished: false
  }
]

async function ensureDefaultJobPositions() {
  const count = await prisma.jobPosition.count()

  if (count > 0) {
    return
  }

  await prisma.jobPosition.createMany({
    data: defaultJobPositions
  })
}

module.exports = {
  defaultJobPositions,
  ensureDefaultJobPositions
}