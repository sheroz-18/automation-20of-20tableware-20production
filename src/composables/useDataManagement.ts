import { useAppState } from './useAppState'
import { useNotification } from './useNotification'

export function useDataManagement() {
  const {
    products,
    orders,
    inventory,
    financialRecords,
    productionBatches,
    rawMaterials,
    finishedGoods,
    stockMovements,
  } = useAppState()

  const { addNotification } = useNotification()

  // Limpiar todos los pedidos
  const clearOrders = () => {
    orders.value = []
    // Notificar a otras pestañas sobre el cambio
    localStorage.setItem('_clear_orders', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Заказы удалены',
      message: 'Все заказы были успешно удалены',
    })
  }

  // Limpiar todos los productos
  const clearProducts = () => {
    products.value = []
    inventory.value = []
    productionBatches.value = []
    finishedGoods.value = []
    localStorage.setItem('_clear_products', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Товары удалены',
      message: 'Все товары и связанные данные были успешно удалены',
    })
  }

  // Limpiar inventario
  const clearInventory = () => {
    inventory.value = []
    localStorage.setItem('_clear_inventory', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Инвентаризация очищена',
      message: 'Все записи инвентаризации были успешно удалены',
    })
  }

  // Limpiar registros financieros
  const clearFinancialRecords = () => {
    financialRecords.value = []
    localStorage.setItem('_clear_financial', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Финансовые записи удалены',
      message: 'Все финансовые записи были успешно удалены',
    })
  }

  // Limpiar lotes de producción
  const clearProductionBatches = () => {
    productionBatches.value = []
    localStorage.setItem('_clear_production', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Партии удалены',
      message: 'Все производственные партии были успешно удалены',
    })
  }

  // Limpiar materias primas
  const clearRawMaterials = () => {
    rawMaterials.value = []
    localStorage.setItem('_clear_raw_materials', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Сырье удалено',
      message: 'Все материалы сырья были успешно удалены',
    })
  }

  // Limpiar movimientos de stock
  const clearStockMovements = () => {
    stockMovements.value = []
    localStorage.setItem('_clear_stock_movements', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Движения запасов удалены',
      message: 'Все движения запасов были успешно удалены',
    })
  }

  // Limpiar TODO (datos de demostración)
  const clearAllData = () => {
    products.value = []
    orders.value = []
    inventory.value = []
    financialRecords.value = []
    productionBatches.value = []
    rawMaterials.value = []
    finishedGoods.value = []
    stockMovements.value = []
    localStorage.setItem('_clear_all', Date.now().toString())
    addNotification({
      type: 'success',
      title: 'Все данные удалены',
      message: 'Система полностью очищена и готова для новых данных',
    })
  }

  return {
    clearOrders,
    clearProducts,
    clearInventory,
    clearFinancialRecords,
    clearProductionBatches,
    clearRawMaterials,
    clearStockMovements,
    clearAllData,
  }
}
