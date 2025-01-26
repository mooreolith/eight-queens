//#region variables
const qs = document.querySelector.bind(document);
const rowTemplate = qs('#row');
const table = qs('table');
const output = qs('output');
const colIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // left-right
const rowIds = ['8', '7', '6', '5', '4', '3', '2', '1']; // up-down
let highscore = [];
//#endregion

//#region main
setup(table)
//#endregion

//#region initial table setup
/*
  sets up the game board.
*/
function setup(table){
  setupRows(table);
  setupCells(table);
  loadHighscore();
  displayHighscore();
}

/*
  Instantiates the row template 8 times
*/
function setupRows(table){
  for(let i = 0; i < rowIds.length; i++){
    const row = rowTemplate.content.cloneNode(true).querySelector('tr');
    row.classList.add(`r${rowIds[i]}`);
    table.append(row);
  }
}

/*
  Iterates over a table's rows, and sets its data elements' onclick handlers.
*/
function setupCells(table){
  const tds = table.querySelectorAll('td');
  tds.forEach(td=> {
    td.onclick = (e) => {
      const cell = e.target;
      if(cell.classList.contains('queen')){
        cell.classList.remove('queen');
      }else{
        cell.classList.add('queen');
      }

      let solution = [...document.querySelectorAll('.queen')].map(getCoords).join(', ');

      if(solved(table)){
        output.innerText = `${solution}  ✓`;
        addHighscore(solution);
      }else{
        output.innerText = solution;
      }
    }
  });
}
//#endregion

//#region check
/*
  Returns true if there are no conflicts among 8 placed queens
*/
function solved(table){
  const queens = table.querySelectorAll('.queen')
  return !conflicts(table) && queens.length === 8;
}

/*
  Returns true if two queens conflict (horizontally, vertically, diagonally)
*/
function conflicts(table){
  const rows = new Set([]);
  const cols = new Set([]);
  const queens = [...table.querySelectorAll('.queen')];
  
  const conflict = (queen) => {
    const coords = getCoords(queen);
    const c = coords[0];
    const r = coords[1];

    if(cols.has(c)) return true;
    if(rows.has(r)) return true;
    cols.add(c);
    rows.add(r);

    for(let diagonal of diagonals){
      let nextCoords = diagonal(coords);
      while(nextCoords){
        if(checkQueen(nextCoords)) return true;
        nextCoords = diagonal(nextCoords);
      }
    }
    
    return false;
  }

  return queens.some(conflict);
}

/*
  Returns the chess coordinates of a cell
*/
function getCoords(td){
  const col = [...td.classList].filter(c => c !== 'queen')[0][1];
  const row = td.closest('tr').classList[0][1];
  return `${col}${row}`;
}

/*
  An array for the diagonals, up-left, down-right, down-left, and up-right. 
  Each function takes a coordinate, and returns either the next coordinates 
  in this diagonal, or undefined, indicating the end of the diagonal. 
*/
const diagonals = [
  function upLeft(coords){
    const colIdx = colIds.indexOf(coords[0]);
    const rowIdx = rowIds.indexOf(coords[1]);
    if((colIdx === 0) || (rowIdx === 0)) return undefined;
    return [colIds[colIdx - 1], rowIds[rowIdx - 1]].join(''); 
  },

  function downRight(coords){
    const colIdx = colIds.indexOf(coords[0]);
    const rowIdx = rowIds.indexOf(coords[1]);
    if((colIdx === 7) || (rowIdx === 7)) return undefined;
    return [colIds[colIdx + 1], rowIds[rowIdx + 1]].join('');
  },

  function downLeft(coords){
    const colIdx = colIds.indexOf(coords[0]);
    const rowIdx = rowIds.indexOf(coords[1]);
    if((colIdx === 0) || (rowIdx === 7)) return undefined;
    return [colIds[colIdx - 1], rowIds[rowIdx + 1]].join(''); 
  },

  function upRight(coords){
    const colIdx = colIds.indexOf(coords[0]);
    const rowIdx = rowIds.indexOf(coords[1]);
    if((colIdx === 7) ||  (rowIdx === 0)) return undefined;
    return [colIds[colIdx + 1], rowIds[rowIdx - 1]].join('');
  }
];

/*
  Returns true if the cell at the supplied coordinates contains a queen piece.
*/
function checkQueen(coords){
  const sel = `tr.r${coords[1]} > td.c${coords[0]}`;
  const td = table.querySelector(sel);
  return td.classList.contains('queen');
}

//#endregion

//#region highscore

function loadHighscore(){
  const highscoreText = localStorage.getItem("highscore");
  if(!highscoreText) return false;
  highscore = JSON.parse(highscoreText);
}

function displayHighscore(){
  const highscoreEl = document.querySelector('#highscore');
  highscoreEl.innerHTML = '';
  for(let score of highscore){
    const entry = document.createElement('li');
    entry.innerHTML = `${score.solution} - ${score.date} - ${score.initials}`;
    highscoreEl.appendChild(entry);
  }
}

function addHighscore(solution){
  let date = new Date();
  date = new Intl.DateTimeFormat('en-US', {
    year: "numeric", 
    month: "numeric", 
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);

  let initials = prompt("Your initials for the highscore:")
  if(!initials){
    initials = "???";
  }

  highscore.unshift({
    solution,
    date,
    initials
  })

  displayHighscore();
  writeHighscore();
}

function writeHighscore(){
  localStorage.setItem('highscore', JSON.stringify(highscore));
}

//#endregion