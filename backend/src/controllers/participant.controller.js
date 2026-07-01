const { createController } = require('../helpers/resourceFactory')

const initialParticipants = [
  { id: 1, name: 'Araf Rahman', email: 'araf@example.com', role: 'Speaker' },
  { id: 2, name: 'Nila Islam', email: 'nila@example.com', role: 'Attendee' },
]

const controller = createController('participant', initialParticipants)

module.exports = controller
