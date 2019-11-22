var CIRCLE_RADIUS = 15
var LINE_WIDTH = 2
var CIRCLE_SPACE = 20
var SMALL_CIRCLE_RADIUS = 10

var canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var c = canvas.getContext('2d')

function clearCanvas(c) {
    c.clearRect(0, 0, canvas.width, canvas.height)
}
function drawGrid(c){

}

function animation() {
    requestAnimationFrame(animation)
    clearCanvas(c)
}
setTimeout(animation, 1000)
