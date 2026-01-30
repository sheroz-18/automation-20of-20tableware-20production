import type { Order, Product, RawMaterial, ProductionBatch } from '../types'
import * as XLSX from 'xlsx'

/**
 * Export data to formatted XLSX (Excel)
 */
export function exportToXLSX(data: unknown[], fileName: string, sheetName: string = 'Данные') {
  if (data.length === 0) {
    alert('Нет данных для экспорта')
    return
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data as Record<string, unknown>[])

  // Style header row
  const headers = Object.keys(data[0] as Record<string, unknown>)
  const headerStyle = {
    fill: { fgColor: { rgb: 'FF2563EB' } }, // Blue background
    font: { bold: true, color: { rgb: 'FFFFFFFF' }, size: 12 }, // White text, bold
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'FF000000' } },
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
      left: { style: 'thin', color: { rgb: 'FF000000' } },
      right: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  }

  // Apply header style and set column widths
  const colWidths: XLSX.ColInfo[] = []
  headers.forEach((header, index) => {
    const cellAddress = XLSX.utils.encode_col(index) + '1'
    worksheet[cellAddress].s = headerStyle
    colWidths.push({ wch: Math.max(header.length + 2, 15) })
  })

  // Style data rows with alternating colors and borders
  const dataRowStyle = (isEven: boolean) => ({
    fill: isEven ? { fgColor: { rgb: 'FFF3F4F6' } } : { fgColor: { rgb: 'FFFFFFFF' } },
    font: { size: 11 },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { rgb: 'FFE5E7EB' } },
      left: { style: 'thin', color: { rgb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { rgb: 'FFE5E7EB' } },
    },
  })

  // Apply styles to data rows
  data.forEach((_, rowIndex) => {
    headers.forEach((header, colIndex) => {
      const cellAddress = XLSX.utils.encode_col(colIndex) + (rowIndex + 2)
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = dataRowStyle(rowIndex % 2 === 0)
      }
    })
  })

  worksheet['!cols'] = colWidths

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

/**
 * Export data to CSV format (Excel compatible)
 */
export function exportToCSV(data: unknown[], fileName: string) {
  if (data.length === 0) {
    alert('Нет данных для экспорта')
    return
  }

  const headers = Object.keys(data[0] as Record<string, unknown>)
  let csv = headers.join(',') + '\n'

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = (row as Record<string, unknown>)[header]
      if (value === null || value === undefined) return ''
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      if (typeof value === 'object') {
        return `"${JSON.stringify(value)}"`
      }
      return value
    })
    csv += values.join(',') + '\n'
  })

  // Add UTF-8 BOM to ensure Excel recognizes Cyrillic characters correctly
  const csvWithBOM = '\uFEFF' + csv
  downloadFile(csvWithBOM, `${fileName}.csv`, 'text/csv;charset=utf-8')
}

/**
 * Export orders to Excel (XLSX)
 */
export function exportOrdersToCSV(orders: Order[]) {
  const exportData = orders.map((order) => ({
    'Номер заказа': order.orderNumber,
    Клиент: order.customerName,
    'Тип клиента': order.customerType === 'wholesale' ? 'Оптовик' : 'Магазин',
    Статус: order.status,
    'Кол-во товаров': order.items.length,
    'Сумма (SM)': order.totalAmount.toFixed(2),
    Создан: order.createdDate,
    Срок: order.dueDate,
  }))

  exportToXLSX(exportData, `Orders_${new Date().toISOString().split('T')[0]}`, 'Заказы')
}

/**
 * Export order details to Excel (XLSX)
 */
export function exportOrderDetailToCSV(order: Order) {
  const exportData = order.items.map((item) => ({
    Заказ: order.orderNumber,
    Товар: item.productName,
    Количество: item.quantity,
    'Цена за единицу (SM)': item.unitPrice.toFixed(2),
    'Сумма (SM)': item.subtotal.toFixed(2),
  }))

  exportToXLSX(exportData, `Order_${order.orderNumber}_details`, `Заказ ${order.orderNumber}`)
}

/**
 * Export production batches to Excel (XLSX)
 */
export function exportBatchesToCSV(batches: ProductionBatch[]) {
  const exportData = batches.map((batch) => ({
    'Номер партии': batch.batchNumber,
    Товар: batch.productName,
    Количество: batch.quantity,
    Статус: batch.status,
    'Текущий этап': batch.currentStage,
    Начало: batch.startDate,
    Окончание: batch.endDate,
  }))

  exportToXLSX(exportData, `ProductionBatches_${new Date().toISOString().split('T')[0]}`, 'Производство')
}

/**
 * Export raw materials to Excel (XLSX)
 */
export function exportRawMaterialsToCSV(materials: RawMaterial[]) {
  const exportData = materials.map((material) => ({
    Материал: material.name,
    Тип: material.materialType,
    Единица: material.unit,
    Количество: material.quantity,
    Минимум: material.minStockLevel,
    'Стоимость за единицу (SM)': material.unitCost.toFixed(2),
    Поставщик: material.supplier,
    'Последний приход': material.lastRestocked,
  }))

  exportToXLSX(exportData, `RawMaterials_${new Date().toISOString().split('T')[0]}`, 'Материалы')
}

/**
 * Export products to Excel (XLSX)
 */
export function exportProductsToCSV(products: Product[]) {
  const exportData = products.map((product) => ({
    SKU: product.sku,
    Название: product.name,
    Категория: product.category,
    Количество: product.quantity,
    'Уровень переказа': product.reorderLevel,
    'Стоимость (SM)': product.unitCost.toFixed(2),
    Статус: product.status,
    Материал: product.material,
    Размер: product.size,
    'Вес (кг)': product.weight.toFixed(3),
  }))

  exportToXLSX(exportData, `Products_${new Date().toISOString().split('T')[0]}`, 'Товары')
}

/**
 * Generate and download HTML-based report for printing
 */
export function exportToPrintHTML(title: string, content: string, styles?: string): Window | null {
  const printWindow = window.open('', '', 'height=600,width=800')
  if (!printWindow) return null

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            color: #333;
          }
          h1 { 
            color: #1f2937; 
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left;
          }
          th { 
            background-color: #f3f4f6; 
            font-weight: bold;
          }
          tr:nth-child(even) { 
            background-color: #f9fafb;
          }
          .total-row { 
            background-color: #e0e7ff; 
            font-weight: bold;
          }
          .section { 
            margin: 20px 0; 
            padding: 15px; 
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 10px;
            color: #1f2937;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          ${styles || ''}
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="print-date">Дата печати: ${new Date().toLocaleString('ru-RU')}</div>
        ${content}
        <div class="footer">
          <p>&copy; 2024 ProduceFlow. Система управления производством посуды</p>
        </div>
        <button class="no-print" onclick="window.print();" style="padding: 10px 20px; margin: 20px 0; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
          Печать
        </button>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  return printWindow
}

/**
 * Export orders to printable HTML
 */
export function exportOrdersToPrint(orders: Order[]) {
  let content = '<div class="section">'
  content += `<div class="section-title">Список заказов (${orders.length})</div>`
  content += '<table>'
  content +=
    '<tr><th>Номер</th><th>Клиент</th><th>Тип</th><th>Статус</th><th>Сумма (ЅМ)</th><th>Создан</th><th>Срок</th></tr>'

  orders.forEach((order) => {
    content += `
      <tr>
        <td><strong>${order.orderNumber}</strong></td>
        <td>${order.customerName}</td>
        <td>${order.customerType === 'wholesale' ? 'Оптовик' : 'Магазин'}</td>
        <td>${order.status}</td>
        <td><strong>SM${order.totalAmount.toFixed(2)}</strong></td>
        <td>${order.createdDate}</td>
        <td>${order.dueDate}</td>
      </tr>
    `
  })

  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  content += `<tr class="total-row"><td colspan="4">ИТОГО</td><td>SM${totalAmount.toFixed(2)}</td><td colspan="2"></td></tr>`
  content += '</table></div>'

  exportToPrintHTML('Список заказов', content)
}

/**
 * Export order detail to printable HTML
 */
export function exportOrderDetailToPrint(order: Order) {
  let content = '<div class="section">'
  content += `<div class="section-title">Заказ ${order.orderNumber}</div>`
  content += `
    <p><strong>Клиент:</strong> ${order.customerName}</p>
    <p><strong>Тип клиента:</strong> ${order.customerType === 'wholesale' ? 'Оптовик' : 'Магазин'}</p>
    <p><strong>Статус:</strong> ${order.status}</p>
    <p><strong>Дата создания:</strong> ${order.createdDate}</p>
    <p><strong>Срок выполнения:</strong> ${order.dueDate}</p>
  `
  content += '</div>'

  content += '<div class="section"><div class="section-title">Товары</div><table>'
  content += '<tr><th>Товар</th><th>Количество</th><th>Цена (ЅМ)</th><th>Сумма (ЅМ)</th></tr>'

  order.items.forEach((item) => {
    content += `
      <tr>
        <td>${item.productName}</td>
        <td>${item.quantity}</td>
        <td>SM${item.unitPrice.toFixed(2)}</td>
        <td><strong>SM${item.subtotal.toFixed(2)}</strong></td>
      </tr>
    `
  })

  content += `<tr class="total-row"><td colspan="3">ИТОГО</td><td>SM${order.totalAmount.toFixed(2)}</td></tr>`
  content += '</table></div>'

  exportToPrintHTML(`Заказ ${order.orderNumber}`, content)
}

/**
 * Export invoice to formatted XLSX (Russian standard format)
 */
export function exportInvoiceToXLSX(order: Order) {
  const invoiceNumber = order.orderNumber.split('-')[1]
  const currentDate = new Date().toLocaleDateString('ru-RU')
  const companyName = 'ProduceFlow' // Грузоотправитель (Shipper)

  const workbook = XLSX.utils.book_new()

  // Create the invoice data structure
  const allData = [
    [`НАКЛАДНАЯ  № ${invoiceNumber}`],
    [],
    [`Грузоотправитель:`, companyName],
    [`Грузополучатель:`, order.customerName],
    [`Основание для отпуска:`, `Заказ № ${order.orderNumber}`],
    [],
    ['№ п/п', 'Наименование товарно-материальных ценностей', 'Ед. изм.', 'Количество', 'Цена, руб.', 'Сумма, руб.'],
    ...order.items.map((item, index) => [
      index + 1,
      item.productName,
      'шт',
      item.quantity,
      item.unitPrice.toFixed(2),
      item.subtotal.toFixed(2),
    ]),
    [],
    ['', '', '', 'ИТОГО:', '', order.totalAmount.toFixed(2)],
    [],
    ['Статус:', order.status],
    ['Дата создания:', order.createdDate],
    ['Срок выполнения:', order.dueDate],
    [],
    ['Подпись ответственного лица:', '_________________', 'Дата:', '_________________'],
  ]

  const dataWorksheet = XLSX.utils.aoa_to_sheet(allData)

  // Style title row (НАКЛАДНАЯ)
  const titleStyle = {
    font: { bold: true, size: 14 },
    alignment: { horizontal: 'left', vertical: 'center' },
  }

  // Style header info rows (Грузоотправитель, Грузополучатель, etc.)
  const headerLabelStyle = {
    font: { bold: true, size: 11 },
    alignment: { horizontal: 'left', vertical: 'center' },
  }

  const headerValueStyle = {
    font: { size: 11 },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  }

  // Style table header row
  const tableHeaderStyle = {
    fill: { fgColor: { rgb: 'FFF0F0F0' } },
    font: { bold: true, size: 10 },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'FF000000' } },
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
      left: { style: 'thin', color: { rgb: 'FF000000' } },
      right: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  }

  // Style data rows
  const dataRowStyle = {
    font: { size: 10 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'FF000000' } },
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
      left: { style: 'thin', color: { rgb: 'FF000000' } },
      right: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  }

  // Style total row
  const totalRowStyle = {
    font: { bold: true, size: 10 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'FF000000' } },
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
      left: { style: 'thin', color: { rgb: 'FF000000' } },
      right: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  }

  // Apply styles
  if (dataWorksheet['A1']) dataWorksheet['A1'].s = titleStyle

  // Apply header info styles (rows 3-5)
  for (let i = 3; i <= 5; i++) {
    if (dataWorksheet[`A${i}`]) dataWorksheet[`A${i}`].s = headerLabelStyle
    if (dataWorksheet[`B${i}`]) dataWorksheet[`B${i}`].s = headerValueStyle
  }

  // Apply table header style (row 7 - the header row for items table)
  const tableHeaderRowNum = 7
  for (let col = 0; col < 6; col++) {
    const cellAddress = XLSX.utils.encode_col(col) + tableHeaderRowNum
    if (dataWorksheet[cellAddress]) {
      dataWorksheet[cellAddress].s = tableHeaderStyle
    }
  }

  // Apply data row styles to items
  const itemsStartRow = 8
  for (let row = 0; row < order.items.length; row++) {
    for (let col = 0; col < 6; col++) {
      const cellAddress = XLSX.utils.encode_col(col) + (itemsStartRow + row)
      if (dataWorksheet[cellAddress]) {
        dataWorksheet[cellAddress].s = dataRowStyle
      }
    }
  }

  // Apply total row style
  const totalRowNum = itemsStartRow + order.items.length + 1
  for (let col = 0; col < 6; col++) {
    const cellAddress = XLSX.utils.encode_col(col) + totalRowNum
    if (dataWorksheet[cellAddress]) {
      dataWorksheet[cellAddress].s = totalRowStyle
    }
  }

  // Set column widths
  dataWorksheet['!cols'] = [
    { wch: 5 },  // № п/п
    { wch: 40 }, // Наименование товара
    { wch: 8 },  // Ед. изм.
    { wch: 12 }, // Количество
    { wch: 12 }, // Цена
    { wch: 12 }, // Сумма
  ]

  // Merge cells for title
  dataWorksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]

  XLSX.utils.book_append_sheet(workbook, dataWorksheet, 'Накладная')
  XLSX.writeFile(workbook, `Nakladnaya_${invoiceNumber}.xlsx`)
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, fileName: string, mimeType: string) {
  const element = document.createElement('a')
  const file = new Blob([content], { type: mimeType })
  element.href = URL.createObjectURL(file)
  element.download = fileName
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  reorderLevel: number
  unitCost: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastUpdated: string
  image: string
  material: string
  size: string
  weight: number
}
