function makeTable(cellContent = '') {
  const table = document.createElement('table')
  let html = ``
  for (let y = 0; y < 3; y++) {
    html += `<tr>`
    for (let x = 0; x < 3; x++) {
      html += `<td>${cellContent}</td>`
    }
    html += `</tr>`
  }
  table.innerHTML = html
  return table
}
makeTable()

const rootTable = makeTable()
rootTable.querySelectorAll('td').forEach(td => {
  const subTable = makeTable(`<input type="text" maxlength="1"/>`)
  subTable.querySelectorAll('input').forEach(e => {
    e.addEventListener('mouseover', () => {
      e.focus()
      if (e.value !== '') {
        e.select()
      }
    })
  })
  td.appendChild(subTable)
})

const main = document.querySelector('main') as HTMLElement
main.appendChild(rootTable)
