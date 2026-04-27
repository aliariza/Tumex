const JobPosition = require('../models/JobPosition')

const defaultJobPositions = [
  {
    title: 'Bölge Satış Sorumlusu',
    department: 'Satış',
    locationType: 'Tam zamanlı',
    employmentType: 'Saha odaklı',
    summary: 'Makine satış süreçlerini takip edecek, müşteri ziyaretleri yapacak ve teklif hazırlıklarına destek verecek takım arkadaşları arıyoruz.',
    highlights: [
      'Tercihen endüstriyel ürün veya B2B satış deneyimi',
      'Takip disiplini ve güçlü iletişim becerisi',
      'Seyahat engeli olmayan çalışma düzeni'
    ],
    applicationEmail: 'info@tum-ex.com',
    applicationSubject: 'Bölge Satış Sorumlusu Başvurusu',
    sortOrder: 10,
    isPublished: true
  },
  {
    title: 'Genel Müdür Asistanı',
    department: 'Yönetim',
    locationType: 'Ofis içi',
    employmentType: 'Tam zamanlı',
    summary: 'Yönetim takvimini, toplantı organizasyonlarını ve kurum içi iletişimi düzenli biçimde yürütecek, temsil kabiliyeti yüksek ekip arkadaşı arıyoruz.',
    highlights: [
      'Planlama ve zaman yönetiminde güçlü yaklaşım',
      'Yazılı ve sözlü iletişimde özenli temsil',
      'Gizlilik, takip ve düzen konusunda yüksek hassasiyet'
    ],
    applicationEmail: 'info@tum-ex.com',
    applicationSubject: 'Genel Müdür Asistanı Başvurusu',
    sortOrder: 20,
    isPublished: true
  },
  {
    title: 'Servis ve Devreye Alma Uzmanı',
    department: 'TEKNİK SERVİS',
    locationType: 'Saha odaklı',
    employmentType: 'Tam zamanlı',
    summary: 'Kurulum, devreye alma ve teknik destek süreçlerinde sahada aktif rol alacak, çözüm üretmeyi seven ekip arkadaşları arıyoruz.',
    highlights: [
      'Mekanik veya elektrik sistemlerine ilgi',
      'Müşteri karşısında güven veren iletişim',
      'Planlı ve çözüm odaklı çalışma yaklaşımı'
    ],
    applicationEmail: 'info@tum-ex.com',
    applicationSubject: 'Servis ve Devreye Alma Uzmanı Başvurusu',
    sortOrder: 30,
    isPublished: true
  },
  {
    title: 'Operasyon ve Teklif Koordinatörü',
    department: 'Operasyon',
    locationType: 'Ofis içi',
    employmentType: 'Tam zamanlı',
    summary: 'Teklif, sipariş ve müşteri takip süreçlerini düzenli yürütecek; satış ve teknik ekip arasında koordinasyonu güçlendirecek adaylar arıyoruz.',
    highlights: [
      'Düzenli iş takibi ve dokümantasyon alışkanlığı',
      'Ekipler arası iletişimi güçlü şekilde yönetebilme',
      'Detaylara dikkat ve hızlı geri dönüş alışkanlığı'
    ],
    applicationEmail: 'info@tum-ex.com',
    applicationSubject: 'Operasyon ve Teklif Koordinatörü Başvurusu',
    sortOrder: 40,
    isPublished: true
  }
]

async function ensureDefaultJobPositions({ jobPositionModel = JobPosition } = {}) {
  const count = await jobPositionModel.countDocuments()

  if (count > 0) {
    return
  }

  await jobPositionModel.insertMany(defaultJobPositions)
}

module.exports = {
  defaultJobPositions,
  ensureDefaultJobPositions
}
