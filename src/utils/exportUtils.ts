import type { Order, Product, RawMaterial, ProductionBatch } from '../types'

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

  downloadFile(csv, `${fileName}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Export orders to CSV
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

  exportToCSV(exportData, `Orders_${new Date().toISOString().split('T')[0]}`)
}

/**
 * Export order details to CSV
 */
export function exportOrderDetailToCSV(order: Order) {
  const exportData = order.items.map((item) => ({
    Заказ: order.orderNumber,
    Товар: item.productName,
    Количество: item.quantity,
    'Цена за единицу (SM)': item.unitPrice.toFixed(2),
    'Сумма (SM)': item.subtotal.toFixed(2),
  }))

  exportToCSV(exportData, `Order_${order.orderNumber}_details`)
}

/**
 * Export production batches to CSV
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

  exportToCSV(exportData, `ProductionBatches_${new Date().toISOString().split('T')[0]}`)
}

/**
 * Export raw materials to CSV
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

  exportToCSV(exportData, `RawMaterials_${new Date().toISOString().split('T')[0]}`)
}

/**
 * Export products to CSV
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

  exportToCSV(exportData, `Products_${new Date().toISOString().split('T')[0]}`)
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
        <td>ЅМ${item.unitPrice.toFixed(2)}</td>
        <td><strong>ЅМ${item.subtotal.toFixed(2)}</strong></td>
      </tr>
    `
  })

  content += `<tr class="total-row"><td colspan="3">ИТОГО</td><td>ЅМ${order.totalAmount.toFixed(2)}</td></tr>`
  content += '</table></div>'

  exportToPrintHTML(`Заказ ${order.orderNumber}`, content)
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
