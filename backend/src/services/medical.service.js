const medicalController = require('../controllers/medical.controller')

function listMedicalRecords() {
  return medicalController.list()
}

function createMedicalRecord(payload = {}) {
  return medicalController.create(payload)
}

module.exports = { listMedicalRecords, createMedicalRecord }
