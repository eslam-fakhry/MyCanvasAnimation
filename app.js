var CIRCLE_RADIUS = 10
var LINE_WIDTH = 2
var CIRCLE_SPACING = 80
var SMALL_CIRCLE_RADIUS = 10
var BACKGROUND_COLOR = "#000117"
var GRID_COLOR = "#0B184F"

var canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var c = canvas.getContext('2d')

function clearCanvas(c) {
    c.clearRect(0, 0, canvas.width, canvas.height)
}

function drawCircle(c, x, y) {
    c.beginPath()
    c.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI, false)
    c.fillStyle = GRID_COLOR
    /*c.shadowBlur = 10
    c.shadowColor = "#fff"*/
    c.fill()
    // c.shadowBlur = 0
}

function drawLine(c, x1, y1, x2, y2) {
    c.beginPath()
    c.moveTo(x1, y1)
    c.lineTo(x2, y2)
    c.strokeStyle = GRID_COLOR
    c.lineWidth = LINE_WIDTH
    c.stroke()
}

function drawGrid(c) {
    var startingPointHorizontally = (canvas.width % CIRCLE_SPACING) / 2
    var startingPointVertically = (canvas.height % CIRCLE_SPACING) / 2
    console.log(startingPointHorizontally, startingPointVertically);
    var cols = Math.floor(canvas.width / CIRCLE_SPACING) + 1
    var rows = Math.floor(canvas.height / CIRCLE_SPACING) + 1

    for (var row = 0; row < rows; row++) {
        drawLine(
            c,
            startingPointHorizontally,
            startingPointVertically + row * CIRCLE_SPACING,
            startingPointHorizontally + (cols - 1) * CIRCLE_SPACING,
            startingPointVertically + row * CIRCLE_SPACING
        )
        for (var col = 0; col < cols; col++) {
            var x = startingPointHorizontally + col * CIRCLE_SPACING
            var y = startingPointVertically + row * CIRCLE_SPACING

            drawCircle(c, x, y)

            if (row === 0) {
                drawLine(
                    c,
                    x,
                    startingPointVertically,
                    x,
                    startingPointVertically + (rows - 1) * CIRCLE_SPACING
                )
            }

            if (col % 2 !== 0 && row % 2 !== 0) {
                // Always draw a line up to left
                drawLine(c, x, y, x - CIRCLE_SPACING, y - CIRCLE_SPACING)

                if (!isLastCol(col)) {
                    // draw line up to right
                    drawLine(c, x, y, x + CIRCLE_SPACING, y - CIRCLE_SPACING)
                }
                if (!isLastRow(row)) {
                    // draw line down to left
                    drawLine(c, x, y, x - CIRCLE_SPACING, y + CIRCLE_SPACING)
                }
                if (!isLastCol(col) && !isLastRow(row)) {
                    // draw line down to right
                    drawLine(c, x, y, x + CIRCLE_SPACING, y + CIRCLE_SPACING)
                }
            }
        }
    }

    function isLastCol(col) {
        return col === (cols - 1)
    }

    function isLastRow(row) {
        return row === (rows - 1)
    }
}

function animation() {
    requestAnimationFrame(animation)
    clearCanvas(c)
    drawGrid(c)
}

setTimeout(animation, 1000)
