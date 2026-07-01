const { createController } = require('../helpers/resourceFactory')

const initialRecords = [
  { id: 1, patient: 'Araf Rahman', status: 'Stable' },
  { id: 2, patient: 'Nila Islam', status: 'Monitoring' },
]

const controller = createController('medical', initialRecords)

module.exports = controller
