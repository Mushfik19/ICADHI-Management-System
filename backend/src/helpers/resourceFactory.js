function createCrudStore(initialItems = []) {
  const items = Array.isArray(initialItems) ? [...initialItems] : []
  let nextId = items.reduce((highestId, item) => {
    const numericId = Number(item.id)
    return Number.isFinite(numericId) && numericId > highestId ? numericId : highestId
  }, 0) + 1

  return {
    list() {
      return items.map((item) => ({ ...item }))
    },
    get(id) {
      const normalizedId = String(id)
      return items.find((item) => String(item.id) === normalizedId) || null
    },
    create(payload = {}) {
      const record = { id: nextId, ...payload }
      nextId += 1
      items.push(record)
      return record
    },
    update(id, payload = {}) {
      const normalizedId = String(id)
      const index = items.findIndex((item) => String(item.id) === normalizedId)
      if (index === -1) {
        return null
      }

      items[index] = { ...items[index], ...payload, id: items[index].id }
      return items[index]
    },
    remove(id) {
      const normalizedId = String(id)
      const index = items.findIndex((item) => String(item.id) === normalizedId)
      if (index === -1) {
        return false
      }

      items.splice(index, 1)
      return true
    },
  }
}

function createController(resourceName, initialItems = []) {
  const store = createCrudStore(initialItems)

  return {
    resourceName,
    list() {
      return {
        success: true,
        message: `${resourceName} retrieved successfully.`,
        data: store.list(),
      }
    },
    get(id) {
      const record = store.get(id)
      return record
        ? {
            success: true,
            message: `${resourceName} retrieved successfully.`,
            data: record,
          }
        : {
            success: false,
            message: `${resourceName} not found.`,
          }
    },
    create(payload = {}) {
      return {
        success: true,
        message: `${resourceName} created successfully.`,
        data: store.create(payload),
      }
    },
    update(id, payload = {}) {
      const record = store.update(id, payload)
      return record
        ? {
            success: true,
            message: `${resourceName} updated successfully.`,
            data: record,
          }
        : {
            success: false,
            message: `${resourceName} not found.`,
          }
    },
    remove(id) {
      return store.remove(id)
        ? {
            success: true,
            message: `${resourceName} removed successfully.`,
          }
        : {
            success: false,
            message: `${resourceName} not found.`,
          }
    },
  }
}

function createService(resourceName, initialItems = []) {
  return createController(resourceName, initialItems)
}

module.exports = {
  createCrudStore,
  createController,
  createService,
}
