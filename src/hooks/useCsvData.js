import { useEffect, useState } from 'react'

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) {
    return []
  }

  const headers = lines[0].split(',').map((item) => item.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((item) => item.trim())

    return headers.reduce((record, header, index) => {
      record[header] = values[index] ?? ''
      return record
    }, {})
  })
}

export function useCsvData(path) {
  const [status, setStatus] = useState('loading')
  const [rows, setRows] = useState([])

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        setStatus('loading')
        const response = await fetch(path)
        const csvText = await response.text()
        if (!active) {
          return
        }

        setRows(parseCsv(csvText))
        setStatus('ready')
      } catch {
        if (!active) {
          return
        }

        setRows([])
        setStatus('error')
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [path])

  return { rows, status }
}
