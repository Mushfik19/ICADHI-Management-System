const participantController = require('../controllers/participant.controller')

function listParticipants() {
  return participantController.list()
}

function createParticipant(payload = {}) {
  return participantController.create(payload)
}

module.exports = { listParticipants, createParticipant }
