import fs from 'node:fs/promises'
import path from 'node:path'
import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import { MODEL_DATA } from '../src/data/modelData.js'
import { PRODUCT_BROCHURES } from '../src/data/productBrochures.js'

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const outputDir = path.join(rootDir, 'public/assets/pdf')
const fontRegular = '/System/Library/Fonts/Supplemental/Arial.ttf'
const fontBold = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
const tumexLogoComponentPath = path.join(
  rootDir,
  'src/shared/components/icons/TumexBlue.vue'
)

const contactDetails = {
  email: 'info@tum-ex.com',
  phone: '+90 530 392 72 59',
  addressLine1: 'Ivedik OSB Melih Gokcek Blv.',
  addressLine2: '63/33 Yenimahalle, Ankara / Turkiye',
  instagram: '@tumex.ltd'
}

const paletteByBadge = {
  'Lazer Kesim Serisi': {
    primary: '#00539c',
    dark: '#112f47',
    accent: '#2d89c9',
    soft: '#eef6fc',
    border: '#cfe1ef'
  },
  'Abkant Serisi': {
    primary: '#0c6b58',
    dark: '#16382f',
    accent: '#4ea287',
    soft: '#eef8f4',
    border: '#cfe5dc'
  }
}

function resolveAsset(assetPath) {
  return path.join(rootDir, 'public', assetPath.replace(/^\//, ''))
}

async function imageBufferFromFile(filePath, options = {}) {
  const width = options.width ? Math.round(options.width) : undefined
  const height = options.height ? Math.round(options.height) : undefined

  if (options.removeBlackEdgeBackground) {
    let pipeline = sharp(filePath).trim({
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 255
      }
    })

    if (options.cropHorizontalPadding) {
      const metadata = await pipeline.metadata()
      const sourceWidth = metadata.width || width || 0
      const sourceHeight = metadata.height || height || 0
      const cropPadding = Math.round(sourceWidth * options.cropHorizontalPadding)
      const cropWidth = Math.max(sourceWidth - cropPadding * 2, Math.round(sourceWidth * 0.7))

      pipeline = pipeline.extract({
        left: Math.max(0, cropPadding),
        top: 0,
        width: cropWidth,
        height: sourceHeight
      })
    }

    return pipeline
      .resize({
        width,
        height,
        fit: options.fit || 'contain',
        withoutEnlargement: true
      })
      .flatten({ background: '#ffffff' })
      .png()
      .toBuffer()
  }

  let pipeline = sharp(filePath)

  if (options.cropHorizontalPadding) {
    const metadata = await pipeline.metadata()
    const sourceWidth = metadata.width || 0
    const sourceHeight = metadata.height || 0

    if (sourceWidth > 0 && sourceHeight > 0) {
      const cropPadding = Math.round(sourceWidth * options.cropHorizontalPadding)
      const cropWidth = Math.max(sourceWidth - cropPadding * 2, Math.round(sourceWidth * 0.7))

      pipeline = pipeline.extract({
        left: Math.max(0, cropPadding),
        top: 0,
        width: cropWidth,
        height: sourceHeight
      })
    }
  }

  const resizedPipeline = pipeline.resize({
      width,
      height,
      fit: options.fit || 'contain',
      withoutEnlargement: true
    })

  if (!options.removeDarkSideBands) {
    if (!options.whitenOuterDarkZonesAfterResize) {
      return resizedPipeline.flatten({ background: '#ffffff' }).png().toBuffer()
    }

    const { data, info } = await resizedPipeline
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const sideZoneWidth = Math.round(info.width * 0.2)

    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        const inOuterZone = x < sideZoneWidth || x >= info.width - sideZoneWidth
        if (!inOuterZone) continue

        const index = (y * info.width + x) * info.channels
        const red = data[index]
        const green = data[index + 1]
        const blue = data[index + 2]
        const alpha = data[index + 3]
        const max = Math.max(red, green, blue)
        const min = Math.min(red, green, blue)

        if (alpha > 220 && max < 55 && max - min < 22) {
          data[index] = 255
          data[index + 1] = 255
          data[index + 2] = 255
          data[index + 3] = 255
        }
      }
    }

    return sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
      .flatten({ background: '#ffffff' })
      .png()
      .toBuffer()
  }

  const { data, info } = await resizedPipeline
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const leftScanWidth = Math.round(info.width * 0.15)
  const rightScanStart = Math.round(info.width * 0.8)
  const darkColumns = new Set()

  for (let x = 0; x < info.width; x += 1) {
    const inSideScan = x < leftScanWidth || x > rightScanStart
    if (!inSideScan) continue

    let darkPixelCount = 0
    let grayPixelCount = 0
    let midGrayPixelCount = 0

    for (let y = 0; y < info.height; y += 1) {
      const index = (y * info.width + x) * info.channels
      const red = data[index]
      const green = data[index + 1]
      const blue = data[index + 2]
      const alpha = data[index + 3]
      const max = Math.max(red, green, blue)
      const min = Math.min(red, green, blue)

      if (alpha > 200 && red < 25 && green < 25 && blue < 25) {
        darkPixelCount += 1
      }

      if (alpha > 200 && max - min < 14 && max < 250 && min > 150) {
        grayPixelCount += 1
      }

      if (alpha > 200 && max - min < 20 && max < 235 && min > 100) {
        midGrayPixelCount += 1
      }
    }

    const darkRatio = darkPixelCount / info.height
    const grayRatio = grayPixelCount / info.height
    const midGrayRatio = midGrayPixelCount / info.height

    if (
      darkRatio > 0.55 ||
      ((grayRatio > 0.18 || midGrayRatio > 0.28) && darkRatio < 0.12)
    ) {
      darkColumns.add(x)
    }
  }

  const expandedDarkColumns = new Set()
  for (const x of darkColumns) {
    for (let offset = -3; offset <= 3; offset += 1) {
      const nextX = x + offset
      if (nextX >= 0 && nextX < info.width) {
        expandedDarkColumns.add(nextX)
      }
    }
  }

  for (let y = 0; y < info.height; y += 1) {
    for (const x of expandedDarkColumns) {
      const index = (y * info.width + x) * info.channels
      const red = data[index]
      const green = data[index + 1]
      const blue = data[index + 2]
      const alpha = data[index + 3]

      if (alpha > 200 && red < 40 && green < 40 && blue < 40) {
        data[index] = 255
        data[index + 1] = 255
        data[index + 2] = 255
      }
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  })
    .flatten({ background: '#ffffff' })
    .png()
    .toBuffer()
}

async function createTumexLogoBuffer(colors) {
  const source = await fs.readFile(tumexLogoComponentPath, 'utf8')
  const svgMatch = source.match(/<svg[\s\S]*<\/svg>/)

  if (!svgMatch) {
    throw new Error('Tumex logo SVG could not be extracted from TumexBlue.vue')
  }

  const svg = svgMatch[0]
    .replace(/height="8rem"/, 'width="1234" height="625"')
    .replace(/fill="red"/, `fill="${colors.primary}"`)

  return sharp(Buffer.from(svg)).png().toBuffer()
}

function writeText(doc, text, x, y, width, options = {}) {
  doc.font(options.font || 'TumexRegular')
  doc.fontSize(options.fontSize || 11)
  doc.fillColor(options.color || '#28465f')
  doc.text(text, x, y, {
    width,
    lineGap: options.lineGap ?? 3,
    align: options.align || 'left'
  })

  return doc.y
}

function drawPageFrame(doc, colors, pageWidth, pageHeight) {
  doc.rect(0, 0, pageWidth, pageHeight).fill('#f8fbfd')
  doc.roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 24).lineWidth(1)
  doc.strokeColor(colors.border).stroke()
}

function drawBadge(doc, label, x, y, colors) {
  doc.save()
  doc.roundedRect(x, y, 150, 24, 12).fill(colors.soft)
  doc.font('TumexBold').fontSize(9).fillColor(colors.primary)
  doc.text(label.toUpperCase(), x + 12, y + 8, { width: 126, align: 'center' })
  doc.restore()
}

function drawHighlights(doc, highlights, x, y, width, colors) {
  let currentY = y

  highlights.forEach((highlight) => {
    doc.circle(x + 5, currentY + 8, 3.5).fill(colors.primary)
    currentY = writeText(doc, highlight, x + 18, currentY, width - 18, {
      fontSize: 10.5,
      lineGap: 3
    }) + 10
  })

  return currentY
}

function buildTechnicalDetails(content, brochure) {
  const details = [
    { label: 'Seri', value: content.title },
    { label: 'Ürün Sınıfı', value: brochure.badge },
    { label: 'Konumlandırma', value: content.text },
    { label: 'Alt Başlık', value: content.altSubtitle }
  ]

  for (const capability of brochure.capabilities || []) {
    details.push({
      label: capability.label,
      value: capability.value
    })
  }

  return details
}

function drawTechnicalTable(doc, rows, x, y, width, colors) {
  const labelWidth = 160
  const rowHeight = 32

  doc.save()
  doc.roundedRect(x, y, width, rowHeight, 12).fill(colors.primary)
  doc.font('TumexBold').fontSize(10.5).fillColor('#ffffff')
  doc.text('Teknik Detay', x + 14, y + 10, { width: labelWidth - 20 })
  doc.text('Bilgi', x + labelWidth + 12, y + 10, {
    width: width - labelWidth - 26
  })

  rows.forEach((row, index) => {
    const rowY = y + rowHeight + index * rowHeight
    const fillColor = index % 2 === 0 ? '#ffffff' : colors.soft
    doc.roundedRect(x, rowY, width, rowHeight, 0).fill(fillColor)
    doc.font('TumexBold').fontSize(10).fillColor(colors.dark)
    doc.text(row.label, x + 14, rowY + 10, { width: labelWidth - 20 })
    doc.font('TumexRegular').fontSize(10).fillColor('#26445f')
    doc.text(row.value, x + labelWidth + 12, rowY + 10, {
      width: width - labelWidth - 26
    })
  })

  doc.restore()

  return y + rowHeight * (rows.length + 1)
}

function drawOptionsSection(doc, options, x, y, width, colors) {
  doc.font('TumexBold').fontSize(14).fillColor(colors.primary)
  doc.text('Opsiyonlar', x, y)

  let currentY = y + 26

  options.forEach((option) => {
    doc.save()
    doc.roundedRect(x, currentY, width, 28, 10).fill(colors.soft)
    doc.font('TumexRegular').fontSize(10.5).fillColor('#26445f')
    doc.text(option, x + 12, currentY + 9, {
      width: width - 24
    })
    doc.restore()
    currentY += 36
  })

  return currentY
}

function drawFooter(doc, x, y, width, colors) {
  doc.save()
  doc.roundedRect(x, y, width, 118, 20).fill('#ffffff')
  doc.roundedRect(x, y, width, 118, 20).lineWidth(1).strokeColor(colors.border).stroke()
  doc.font('TumexBold').fontSize(11).fillColor(colors.primary)
  doc.text('Tumex ile iletişime geçin', x + 16, y + 14)

  doc.font('TumexRegular').fontSize(10.5).fillColor('#26445f')
  doc.text(`E-posta: ${contactDetails.email}`, x + 16, y + 38, { width: width - 32 })
  doc.text(`Telefon: ${contactDetails.phone}`, x + 16, y + 56, { width: width - 32 })
  doc.text(`Adres: ${contactDetails.addressLine1}`, x + 16, y + 74, { width: width - 32 })
  doc.text(contactDetails.addressLine2, x + 60, y + 90, { width: width - 76 })
  doc.text(`Instagram: ${contactDetails.instagram}`, x + width - 180, y + 38, {
    width: 164,
    align: 'right'
  })
  doc.restore()
}

async function createBrochure(productKey, content, brochure) {
  const colors = paletteByBadge[brochure.badge] || paletteByBadge['Lazer Kesim Serisi']
  const outputPath = path.join(outputDir, brochure.fileName)
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  })

  doc.registerFont('TumexRegular', fontRegular)
  doc.registerFont('TumexBold', fontBold)

  const buffers = []
  doc.on('data', (chunk) => buffers.push(chunk))

  const finished = new Promise((resolve) => {
    doc.on('end', resolve)
  })

  const pageWidth = doc.page.width
  const pageHeight = doc.page.height
  const margin = 42
  const innerWidth = pageWidth - margin * 2
  const innerHeight = pageHeight - margin * 2
  const productImage = await imageBufferFromFile(resolveAsset(content.picture), {
    width: innerWidth - 36,
    height: 300,
    fit: 'contain',
    cropHorizontalPadding: ['WC67K', 'PSH8'].includes(productKey) ? 0 : 0.02,
    removeDarkSideBands: !['WC67K', 'PSH8'].includes(productKey),
    removeBlackEdgeBackground: ['WC67K', 'PSH8'].includes(productKey)
  })
  const tumexLogo = await createTumexLogoBuffer(colors)
  const technicalRows = buildTechnicalDetails(content, brochure)

  drawPageFrame(doc, colors, pageWidth, pageHeight)

  doc.image(tumexLogo, margin, 28, { width: 108 })
  drawBadge(doc, brochure.badge, pageWidth - margin - 150, 40, colors)

  doc.font('TumexBold').fontSize(24).fillColor(colors.dark)
  doc.text(content.title, margin, 94, { width: innerWidth })
  doc.font('TumexRegular').fontSize(13).fillColor('#557186')
  doc.text(content.text, margin, 126, { width: innerWidth })

  const heroY = 150
  const heroHeight = 270
  doc.save()
  doc.roundedRect(margin, heroY, innerWidth, heroHeight, 22).fill('#ffffff')
  doc.roundedRect(margin, heroY, innerWidth, heroHeight, 22).clip()
  doc.image(productImage, margin + 18, heroY + 20, {
    width: innerWidth - 36,
    height: heroHeight - 40
  })
  doc.restore()
  doc.roundedRect(margin, heroY, innerWidth, heroHeight, 22).lineWidth(1)
  doc.strokeColor(colors.border).stroke()

  const bodyTop = 450
  const columnGap = 24
  const columnWidth = (innerWidth - columnGap) / 2

  doc.font('TumexBold').fontSize(15).fillColor(colors.primary)
  doc.text('Seri Özeti', margin, bodyTop)
  let summaryY = writeText(doc, content.paragraph_1, margin, bodyTop + 26, columnWidth, {
    fontSize: 10.5,
    lineGap: 3
  })
  writeText(doc, content.paragraph_2, margin, summaryY + 10, columnWidth, {
    fontSize: 10.5,
    lineGap: 3
  })

  const highlightsX = margin + columnWidth + columnGap
  doc.font('TumexBold').fontSize(15).fillColor(colors.primary)
  doc.text('Öne Çıkanlar', highlightsX, bodyTop)
  drawHighlights(doc, brochure.highlights || [], highlightsX, bodyTop + 28, columnWidth, colors)

  doc.addPage()
  drawPageFrame(doc, colors, pageWidth, pageHeight)

  doc.image(tumexLogo, margin, 28, { width: 96 })
  doc.font('TumexBold').fontSize(22).fillColor(colors.dark)
  doc.text(content.title, margin, 88, { width: innerWidth })
  doc.font('TumexRegular').fontSize(12).fillColor('#557186')
  doc.text('Teknik detaylar ve opsiyonel donanımlar', margin, 116, {
    width: innerWidth
  })

  const tableBottomY = drawTechnicalTable(doc, technicalRows, margin, 152, innerWidth, colors)
  const optionsBottomY = drawOptionsSection(
    doc,
    brochure.optionalFeatures || [],
    margin,
    tableBottomY + 20,
    innerWidth,
    colors
  )

  const footerY = Math.max(optionsBottomY + 10, pageHeight - margin - 118)
  drawFooter(doc, margin, footerY, innerWidth, colors)

  doc.end()
  await finished
  await fs.writeFile(outputPath, Buffer.concat(buffers))

  return outputPath
}

await fs.mkdir(outputDir, { recursive: true })

for (const [productKey, brochure] of Object.entries(PRODUCT_BROCHURES)) {
  const content = MODEL_DATA[productKey]

  if (!content) {
    throw new Error(`Missing MODEL_DATA entry for ${productKey}`)
  }

  const outputPath = await createBrochure(productKey, content, brochure)
  console.log(`Generated ${path.basename(outputPath)}`)
}
