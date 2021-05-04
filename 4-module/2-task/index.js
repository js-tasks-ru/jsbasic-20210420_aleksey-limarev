function makeDiagonalRed(table) {
  for (const tr of table.rows) {
    tr.cells[tr.rowIndex].style.backgroundColor = 'red';
  }
}
