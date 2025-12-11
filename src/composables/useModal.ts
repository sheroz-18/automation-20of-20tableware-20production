import { ref, computed } from 'vue'

export type ModalType = 'view' | 'edit' | 'create' | 'delete'
export type ModalContent = 'product' | 'order' | 'inventory' | 'finance' | null

export function useModal() {
  const isOpen = ref<boolean>(false)
  const modalType = ref<ModalType>('view')
  const contentType = ref<ModalContent>(null)
  const selectedItem = ref<any>(null)

  const isViewModal = computed<boolean>(() => modalType.value === 'view')
  const isEditModal = computed<boolean>(() => modalType.value === 'edit')
  const isCreateModal = computed<boolean>(() => modalType.value === 'create')
  const isDeleteModal = computed<boolean>(() => modalType.value === 'delete')

  const openViewModal = (item: any, type: ModalContent) => {
    selectedItem.value = JSON.parse(JSON.stringify(item))
    modalType.value = 'view'
    contentType.value = type
    isOpen.value = true
  }

  const openEditModal = (item: any, type: ModalContent) => {
    selectedItem.value = JSON.parse(JSON.stringify(item))
    modalType.value = 'edit'
    contentType.value = type
    isOpen.value = true
  }

  const openCreateModal = (type: ModalContent) => {
    selectedItem.value = null
    modalType.value = 'create'
    contentType.value = type
    isOpen.value = true
  }

  const openDeleteModal = (item: any, type: ModalContent) => {
    selectedItem.value = item
    modalType.value = 'delete'
    contentType.value = type
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
    selectedItem.value = null
    contentType.value = null
  }

  return {
    isOpen,
    modalType,
    contentType,
    selectedItem,
    isViewModal,
    isEditModal,
    isCreateModal,
    isDeleteModal,
    openViewModal,
    openEditModal,
    openCreateModal,
    openDeleteModal,
    closeModal,
  }
}
