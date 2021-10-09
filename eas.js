// Create a nxn grid
function createGrid(gridsize, colormode, customColor = '') {
    const grid = document.querySelector('.grid');
    grid.style.setProperty('--grid-size', gridsize); // add style to html to set css '--grid-size' (grid dimension) var to n
    for (let i = 0; i < (gridsize*gridsize); i++) {   // create n*n div elements for each square
        const square = document.createElement('div');
        square.classList.add('square');
        grid.appendChild(square);    
    } 
    changeColorMode(colormode, customColor);
}

// Set new grid according to button selection
function resetGrid(gridsize, colormode, customColor = '') {
    const squares = document.querySelectorAll('.square');   // remove all existing .square divs
    squares.forEach((event) => event.remove());
    createGrid(gridsize, colormode, customColor);
}

// Select color mode: black or rainbow
function changeColorMode(colormode, customColor = '') {
    const squares = document.querySelectorAll('.square');

    if (colormode === 'black') {
        squares.forEach(square => square.addEventListener('mouseover', () => {
            square.removeAttribute("style"); // remove existing styles
            square.classList.remove('rainbowSquare');   // turn off rainbow mode
            square.classList.remove('customSquare'); // turn off userpick mode
            square.classList.add('blackSquare');
        }));
    }
    else if (colormode === 'rainbow') {
        squares.forEach(square => square.addEventListener('mouseover', () => {
            square.removeAttribute("style"); // remove existing styles
            square.classList.remove('blackSquare');     // turn off black mode
            square.classList.remove('customSquare'); // turn off userpick mode
            const randomColor = "#" + (Math.floor(Math.random()*16777215).toString(16));    // generate random hex code
            square.style.setProperty("--random-color", randomColor);    // change bg-color of .rainbowSquare css element
            square.classList.add('rainbowSquare');
        }));
    }
    else if (colormode === 'userpick') {
        // add custom attribute to store user selected color/hex code to grid div 
        // this allows current hex value to be retrieved from the DOM when resetGrid() is called.
        const grid = document.querySelector('.grid'); 
        grid.setAttribute('data-currentCustomColor', customColor); 

        squares.forEach(square => square.addEventListener('mouseover', () => {
            square.removeAttribute("style"); // remove existing styles
            square.classList.remove('blackSquare');     // turn off black mode
            square.classList.remove('rainbowSquare');      // turn off rainbow mode
            square.style.setProperty("--select-color", customColor);    // change bg-color of .customSquare css element
            square.classList.add('customSquare');
        }));
    }
}

// Clear grid
function clearGrid() {
    // remove ALL css classes and styles
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('blackSquare','rainbowSquare', 'customSquare');
        square.removeAttribute("style");
    });
}

// Highlight grid size & color mode buttons
function highlightActiveButtons(gridsize, colormode) {
    // delete existing 'activebutton' class on ALL setgrid buttons
    const setgrid = document.querySelectorAll('.setgrid');
    setgrid.forEach(button => button.classList.remove('activebutton'));

    // only activate grid size buttons if custom size (gridsize=0) isn't being used 
    if (gridsize != 0) {
    // turn on 'activebutton' ONLY for selected grid size
    const gridButton = document.querySelector(`button.setgrid[data-gridsize="${gridsize}"]`);
    gridButton.classList.add('activebutton');
    }

    // delete existing 'activebutton' class on ALL setcolor buttons
    const setcolor = document.querySelectorAll('.setcolor');
    setcolor.forEach(button => button.classList.remove('activebutton'));
    // turn on 'activebutton' ONLY for selected color mode
    const colorButton = document.querySelector(`button.setcolor[data-sqcolor="${colormode}"]`);
    colorButton.classList.add('activebutton');
}


// Onload grid size & color mode settings
let currentColorMode = 'black' 
let currentGrid = 16;
let currentCustomColor = '';
createGrid(currentGrid, currentColorMode);
highlightActiveButtons(currentGrid, currentColorMode);


// Click button to clear current grid
const clear = document.querySelector('.clear');
clear.addEventListener('click', clearGrid);

// Click button to select grid size
const setgrid = document.querySelectorAll('.setgrid');
setgrid.forEach(button => button.addEventListener('click', (event) =>{ // add onclick eventlistener to each setgrid button
    const gridSize = Number(event.target.dataset.gridsize); // get grid size val from div
    currentGrid = gridSize; 
    
    // if current color mode is userpick, save the current color selection and apply it when resetting grid
    if (currentColorMode === 'userpick') {
        let currentCustomColor = document.querySelector('.grid').getAttribute('data-currentCustomColor');
        resetGrid(gridSize, currentColorMode, currentCustomColor); 
    }
    else {
        resetGrid(gridSize, currentColorMode); 
    }
    
    highlightActiveButtons(gridSize, currentColorMode);
}));

// Click button to select color mode
const setcolor = document.querySelectorAll('.setcolor');
setcolor.forEach(button => button.addEventListener('click', (event) =>{ // add onclick eventlistener to each setcolor button
    const sqColor = event.target.dataset.sqcolor; // get color mode val from div

    if (sqColor === 'userpick') {
        let colorpicker = document.querySelector("button.setcolor input[name='colorpicker']");  // get 'colorpicker' input element
        colorpicker.click();    // trigger 'click' to open color picker window
        colorpicker.addEventListener('input', (e) => {      // listen for change in hex code value 
            let customColor = e.target.value;
            changeColorMode(sqColor, customColor);
        }); 
    }
    else {
        changeColorMode(sqColor);
    }

    currentColorMode = sqColor;
    highlightActiveButtons(currentGrid, sqColor);
}));

// Use slider to select custom grid size
const sizeSlider = document.querySelector("div.sliderContainer input[id='sizeSlider']");
sizeSlider.addEventListener("input", (event) => {
    currentGrid = 0; // tells highlightActiveButtons() slide is being used, so don't activate grid size buttons
    // toggle off active grid size button when using slider
    const setgrid = document.querySelectorAll('.setgrid');
    setgrid.forEach(button => button.classList.remove('activebutton'));

    // get slider value and update slider value display
    let sliderValue = event.target.valueAsNumber;   
    document.querySelector('.sliderValues').innerHTML = `${sliderValue}x${sliderValue}`; 

    // if current color mode is userpick, save the current color selection and apply it when resetting grid
    if (currentColorMode === 'userpick') {
        let currentCustomColor = document.querySelector('.grid').getAttribute('data-currentCustomColor');
        resetGrid(sliderValue, currentColorMode, currentCustomColor); 
    }
    else {
        resetGrid(sliderValue, currentColorMode); 
    }
})