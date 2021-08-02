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
  const subTable = makeTable(
    `<input type="text" maxlength="1" pattern="[1-9]"/>`,
  )
  subTable.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      if (!input.value.match(/[1-9]/)) {
        input.value = ''
        return
      }
      saveBoard()
    })
    input.addEventListener('mouseover', () => {
      input.focus()
      if (input.value !== '') {
        input.select()
      }
    })
  })
  td.appendChild(subTable)
})

const main = document.querySelector('main') as HTMLElement
main.appendChild(rootTable)

function getNumberList(): string[] {
  const numberList = JSON.parse(localStorage.getItem('values') || '[]')
  main.querySelectorAll('table input').forEach((e, i) => {
    const input = e as HTMLInputElement
    numberList[i] = input.value
  })
  return numberList
}

function saveBoard() {
  const numberList = getNumberList()
  localStorage.setItem('values', JSON.stringify(numberList))
}

function init() {
  const numberList = JSON.parse(localStorage.getItem('values') || '[]')
  main.querySelectorAll('table input').forEach((e, i) => {
    const input = e as HTMLInputElement
    input.value = numberList[i] || ''
  })
}
init()

/**
 * ## coordinate system
 * 3D: x -> y
 * 2D: grid -> i
 * 1D: index
 *
 * ## range
 * index: 0-80
 *  grid: 0-8
 *     i: 0-8
 *     x: 0-8
 *     y: 0-8
 *  */

const SCORES = {
  DUPLICATE: -10,
}

type Pos2D = {
  x: number
  y: number
}
const INDEX_MAP: Pos2D[] = []
{
  let index = 0
  for (let yOffset = 0; yOffset < 9; yOffset += 3) {
    for (let xOffset = 0; xOffset < 9; xOffset += 3) {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          INDEX_MAP[index] = { x: x + xOffset, y: y + yOffset }
          index++
        }
      }
    }
  }
}

function calcInvalidMoves(numberList: string[]): number {
  let score = 0

  // check each Grid
  let index = -1
  for (let grid = 0; grid < 9; grid++) {
    const numberSet = new Set<string>()
    for (let i = 0; i < 9; i++) {
      index++
      const value = numberList[index]
      if (!value) continue
      if (numberSet.has(value)) {
        score += SCORES.DUPLICATE
      }
      numberSet.add(value)
    }
  }

  // check each X
  for (let x = 0; x < 9; x++) {
    const numberSet = new Set<string>()
    for (let index = 0; index < 81; index++) {
      const value = numberList[index]
      if (!value) continue
      if (INDEX_MAP[index].x !== x) continue
      if (numberSet.has(value)) {
        score += SCORES.DUPLICATE
      }
      numberSet.add(value)
    }
  }

  // check each Y
  for (let y = 0; y < 9; y++) {
    const numberSet = new Set<string>()
    for (let index = 0; index < 81; index++) {
      const value = numberList[index]
      if (!value) continue
      if (INDEX_MAP[index].y !== y) continue
      if (numberSet.has(value)) {
        score += SCORES.DUPLICATE
      }
      numberSet.add(value)
    }
  }

  return score
}

function test() {
  const numberList = getNumberList()
  const score = calcInvalidMoves(numberList)
  console.debug('score:', score)
}

function solveBoard() {
  console.debug('TODO')
  test()
}

Object.assign(window, { solveBoard })
