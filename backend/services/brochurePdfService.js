const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const logoPath = path.join(__dirname, '..', 'assets', 'tumex-logo.png')
const regularFontPath = path.join(__dirname, '..', 'assets', 'fonts', 'NotoSans-Regular.ttf')
const boldFontPath = path.join(__dirname, '..', 'assets', 'fonts', 'NotoSans-Bold.ttf')
const brochureVersion = 'V-1.0'


function regularFont() {
  return fs.existsSync(regularFontPath) ? 'TumexRegular' : 'Helvetica'
}

function boldFont() {
  return fs.existsSync(boldFontPath) ? 'TumexBold' : 'Helvetica-Bold'
}

function getMachineTitle(machine) {
  const model = machine.model || 'Makine'
  const category = formatCategory(machine.category)

  if (machine.category === 'abkant') {
    return `${model} ABKANT TEZGAHI`
  }

  if (machine.category === 'laser-cutting') {
    return `${model} LAZER TEZGAHI`
  }

  return model
}
function formatCategory(category) {
  if (category === 'abkant') return 'Abkant'
  if (category === 'laser-cutting') return 'Lazer Kesim'
  return category || '-'
}

function resolvePublicAssetPath(assetPath) {
  if (!assetPath || /^https?:\/\//i.test(assetPath)) {
    return null
  }

  const cleanPath = String(assetPath).replace(/^\/+/, '')

  return path.join(__dirname, '..', '..', 'frontend', 'public', cleanPath)
}

function drawLogo(doc) {
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, {
      width: 85
    })
    return
  }

  doc
    .fontSize(24)
    .fillColor('#00539c')
    .font(boldFont())
    .text('TUMEX', 50, 40)
}

function drawMachineImage(doc, machine) {
  console.log('[PDF MACHINE IMAGE VALUE]', machine.image)

  const imagePath = resolvePublicAssetPath(machine.image)

  console.log('[PDF RESOLVED IMAGE PATH]', imagePath)
  console.log('[PDF IMAGE EXISTS]', imagePath ? fs.existsSync(imagePath) : false)

  if (!imagePath || !fs.existsSync(imagePath)) {
    drawImagePlaceholder(doc)
    return
  }

  try {

    const boxX = 50
    const boxY = 118
    const boxW = 495
    const boxH = 235

    doc.image(imagePath, boxX + 6, boxY + 6, {
      fit: [boxW - 12, boxH - 12],
      align: 'center',
      valign: 'center'
    })
  } catch (error) {
    console.error('[PDF IMAGE ERROR]', error.message)
    drawImagePlaceholder(doc)
  }
}
function drawImagePlaceholder(doc) {
  const boxX = 50
  const boxY = 118
  const boxW = 495
  const boxH = 235

  doc
    .fontSize(12)
    .fillColor('#64748b')
    .font(regularFont())
    .text('Makine görseli bulunamadı', boxX, boxY + 108, {
      width: boxW,
      align: 'center'
    })
}

function drawFooter(doc, pageNumber, totalPages) {
  const y = 730

  doc.save()

  doc
    .moveTo(50, y)
    .lineTo(545, y)
    .strokeColor('#d0d7de')
    .stroke()

  doc
    .fontSize(8.5)
    .fillColor('#4b5563')
    .font(regularFont())
    .text('Tumex Ltd. Şti.', 50, y + 14, {
      width: 260,
      height: 12,
      lineBreak: false
    })

doc
  .fontSize(8.5)
  .fillColor('#4b5563')
  .font(regularFont())
  .text('V-1.0', 50, y + 14, {
    width: 495,
    height: 12,
    align: 'center',
    lineBreak: false
  })



  doc
    .fontSize(8.5)
    .fillColor('#4b5563')
    .font(regularFont())
    .text('www.tum-ex.com.tr', 430, y + 14, {
      width: 115,
      height: 12,
      align: 'right',
      lineBreak: false
    })

  doc.restore()
}
function drawFootersOnAllPages(doc) {
  const range = doc.bufferedPageRange()
  const totalPages = range.count

  for (let i = 0; i < totalPages; i += 1) {
    doc.switchToPage(range.start + i)
    drawFooter(doc, i + 1, totalPages)
  }
}

function formatWorkingArea(code) {
  if (!code) return '-'

  const cleanCode = String(code).trim()
  const match = cleanCode.match(/^(\d{2})(\d{2})$/)

  if (!match) {
    return cleanCode
  }

  const widthMeters = Number(match[1]) / 10
  const lengthMeters = Number(match[2]) / 10

  function formatMeter(value) {
    return Number.isInteger(value) ? String(value) : String(value).replace('.', '.')
  }

  return `${formatMeter(widthMeters)} M x ${formatMeter(lengthMeters)} M`
}

function getHeaderSummary(machine) {
  if (machine.category === 'abkant') {
    const ton = machine.pressForceTon ? `${machine.pressForceTon} TON` : '-'
    const length = machine.bendingLengthMm ? `${machine.bendingLengthMm} MM` : '-'
    return `${ton}    |    ${length}`
  }

  if (machine.category === 'laser-cutting') {
    let power = machine.powerKw ? `${machine.powerKw} KW` : ''
    let areaCode = machine.workingAreaCode || ''

    if ((!power || !areaCode) && machine.model) {
      const match = String(machine.model).match(/-(\d+)KW-(\d+)$/i)
      if (match) {
        power = `${match[1]} KW`
        areaCode = match[2]
      }
    }

    return `${power || '-'}    |    ${formatWorkingArea(areaCode)}`
  }
  return ''
}

function drawHeader(doc, machine) {
  drawLogo(doc)

doc
  .fontSize(18)
  .fillColor('#111827')
  .font(boldFont())
  .text(getMachineTitle(machine).toUpperCase(), 150, 40, {
    width: 395,
    height: 28,
    align: 'right',
    lineBreak: false,
    ellipsis: true
  })

  doc
    .fontSize(10)
    .fillColor('#374151')
    .font(boldFont())
    .text(getHeaderSummary(machine), 150, 70, {
      width: 395,
      height: 18,
      align: 'right',
      lineBreak: false
    })

  doc
    .moveTo(50, 105)
    .lineTo(545, 105)
    .strokeColor('#d0d7de')
    .stroke()

  if (machine.description) {
    doc
      .fontSize(10)
      .fillColor('#4b5563')
      .font(regularFont())
      .text(machine.description, 50, 118, {
        width: 495,
        lineGap: 3
      })
  }
}

function drawMachineSummary(doc, machine) {
  const y = 305

  doc
    .roundedRect(50, y, 495, 82, 8)
    .lineWidth(1)
    .strokeColor('#cbd5e1')
    .stroke()

  doc
    .fontSize(13)
    .fillColor('#00539c')
    .font(boldFont())
    .text('Genel Bilgiler', 65, y + 14)

  doc
    .fontSize(10)
    .fillColor('#374151')
    .font(regularFont())
  if (machine.category === 'abkant') {
    doc
      .text(`Baskı Gücü: ${machine.pressForceTon ? `${machine.pressForceTon} ton` : '-'}`, 65, y + 40)
      .text(`Bükme Uzunluğu: ${machine.bendingLengthMm ? `${machine.bendingLengthMm} mm` : '-'}`, 65, y + 58)
  } else if (machine.category === 'laser-cutting') {
    doc
      .text(`Lazer Gücü: ${machine.powerKw ? `${machine.powerKw} kW` : '-'}`, 65, y + 40)
      .text(`Çalışma Alanı: ${machine.workingAreaCode || '-'}`, 65, y + 58)
  } else {
    doc.text('Bu kategori için özel özet alanı tanımlanmadı.', 65, y + 45)
  }


}

function drawSpecsTable(doc, specs = []) {
  let y = 385

  const tableX = 50
  const labelW = 240
  const valueW = 255
  const rowH = 20
  const pageBottomLimit = 725

  function drawTableTitle() {
    doc
      .fontSize(16)
      .fillColor('#111827')
      .font(boldFont())
      .text('Teknik Özellikler', tableX, y)

    y += 30
  }

  function drawTableHeader() {
    doc.rect(tableX, y, labelW, 20).fillAndStroke('#f1f5f9', '#94a3b8')
    doc.rect(tableX + labelW, y, valueW, 20).fillAndStroke('#f1f5f9', '#94a3b8')

    doc
      .fontSize(10)
      .font(boldFont())
      .fillColor('#111827')
      .text('Özellik', tableX + 10, y + 5, {
        width: labelW - 20,
        lineBreak: false
      })

    doc.text('Değer', tableX + labelW + 10, y + 5, {
      width: valueW - 20,
      lineBreak: false
    })

    y += 20
  }

function startNewSpecsPage() {
  doc.addPage()
  y = 60
  drawTableTitle()
  drawTableHeader()
}

  drawTableTitle()
  drawTableHeader()

  const cleanSpecs = specs
    .filter((spec) => spec && (spec.label || spec.key))
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))

  if (!cleanSpecs.length) {
    doc
      .font(regularFont())
      .fontSize(10)
      .fillColor('#4b5563')
      .text('Bu makine için teknik özellik bulunamadı.', tableX, y + 12)

    return
  }

  cleanSpecs.forEach((spec, index) => {
    if (y + rowH > pageBottomLimit) {
      startNewSpecsPage()
    }

    const label = spec.label || spec.key || '-'
    const value = spec.value || '-'
    const fill = index % 2 === 0 ? '#ffffff' : '#f8fafc'

    doc.rect(tableX, y, labelW, rowH).fillAndStroke(fill, '#cbd5e1')
    doc.rect(tableX + labelW, y, valueW, rowH).fillAndStroke(fill, '#cbd5e1')

    doc
      .font(regularFont())
      .fontSize(7.8)
      .fillColor('#111827')
      .text(label, tableX + 8, y + 5, {
        width: labelW - 16,
        height: rowH - 5,
        ellipsis: true,
        lineBreak: false
      })

    doc
      .font(regularFont())
      .fontSize(7.8)
      .fillColor('#374151')
      .text(value, tableX + labelW + 8, y + 5, {
        width: valueW - 16,
        height: rowH - 5,
        ellipsis: true,
        lineBreak: false
      })

    y += rowH
  })
}
function createMachineBrochurePdf(machine, writableStream) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    bufferPages: true
  })
  if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
    doc.registerFont('TumexRegular', regularFontPath)
    doc.registerFont('TumexBold', boldFontPath)
  }
  doc.pipe(writableStream)

  drawHeader(doc, machine)
  drawMachineImage(doc, machine)
  drawSpecsTable(doc, machine.specs || [])

  drawFootersOnAllPages(doc)

  doc.end()
}

module.exports = {
  createMachineBrochurePdf
}