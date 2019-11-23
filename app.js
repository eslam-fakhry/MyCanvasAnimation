(function () {
    var CIRCLE_RADIUS = 10
    var LINE_WIDTH = 2
    var CIRCLE_SPACING = 80
    // var BACKGROUND_COLOR = "#071237"
    var GRID_COLOR = "#0B184F"
    var ANIMATION_DURATION = 40
    var DEFAULT_TRAVEL_DISTANCE = 4
    var ANIMATED_LINE_WIDTH = 1
    var ANIMATED_CIRCLE_RADIUS = 5
    var ANIMATED_CIRCLE_COLOR = "#ecba3d"
    var ANIMATED_CIRCLE_SHADOW_COLOR = "#fff"
    var ANIMATED_LINE_COLOR = "#ecba3d88"

    var canvas = document.getElementById('canvas')
    var c = canvas.getContext('2d')

    var parentWidth
    var parentHeight
    var startingPointHorizontally
    var startingPointVertically
    var cols
    var rows
    var travelDistance
    var delta

    window.addEventListener('resize', initializeCanvas)
    initializeCanvas()

    function initializeCanvas() {
        parentWidth = canvas.parentElement.clientWidth
        parentHeight = canvas.parentElement.clientHeight
        canvas.width = parentWidth
        canvas.height = parentHeight
        startingPointHorizontally = (canvas.width % CIRCLE_SPACING) / 2
        startingPointVertically = (canvas.height % CIRCLE_SPACING) / 2
        cols = Math.floor(canvas.width / CIRCLE_SPACING) + 1
        rows = Math.floor(canvas.height / CIRCLE_SPACING) + 1
        travelDistance = Math.min(rows, cols) > DEFAULT_TRAVEL_DISTANCE ? DEFAULT_TRAVEL_DISTANCE : Math.min(rows, cols) - 1
        delta = travelDistance * CIRCLE_SPACING / ANIMATION_DURATION
    }

    function clearCanvas(c) {
        c.clearRect(0, 0, canvas.width, canvas.height)
    }

    function drawCircle(c, x, y, isAnimated = false) {
        c.beginPath()
        c.arc(startingPointHorizontally + x,
            startingPointVertically + y,
            isAnimated ? ANIMATED_CIRCLE_RADIUS : CIRCLE_RADIUS,
            0,
            2 * Math.PI,
            false
        )
        c.fillStyle = isAnimated ? ANIMATED_CIRCLE_COLOR : GRID_COLOR
        if (isAnimated) {
            c.shadowBlur = 10
            c.shadowColor = ANIMATED_CIRCLE_SHADOW_COLOR
        }
        c.fill()
        c.shadowBlur = 0
    }

    function drawLine(c, x1, y1, x2, y2, isAnimated = false) {
        c.beginPath()
        c.moveTo(
            startingPointHorizontally + x1,
            startingPointVertically + y1
        )
        c.lineTo(
            startingPointHorizontally + x2,
            startingPointVertically + y2
        )
        c.strokeStyle = isAnimated ? ANIMATED_LINE_COLOR : GRID_COLOR
        c.lineWidth = isAnimated ? ANIMATED_LINE_WIDTH : LINE_WIDTH
        c.stroke()
    }

    function drawGrid(c) {
        for (var row = 0; row < rows; row++) {
            drawLine(c, 0, row * CIRCLE_SPACING, (cols - 1) * CIRCLE_SPACING, row * CIRCLE_SPACING)
            for (var col = 0; col < cols; col++) {
                var x = col * CIRCLE_SPACING
                var y = row * CIRCLE_SPACING

                drawCircle(c, x, y)

                if (row === 0) {
                    drawLine(c, x, 0, x, (rows - 1) * CIRCLE_SPACING)
                }

                if (canMoveDiagonally(row, col)) {
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

    function randIntBetween(int1, int2) {
        return int1 + Math.floor(Math.random() * (int2 - int1))
    }

    var iteration = 0
    var randomRow
    var randomCol
    var initialPositionX
    var initialPositionY
    var xCoefficient
    var yCoefficient

    function canMoveDiagonally(row, col) {
        return !(col % 2 === 0 || row % 2 === 0);
    }

    function canMoveToRight(col) {
        return (col + travelDistance) <= (cols - 1);
    }

    function canMoveToLeft(col) {
        return (col - travelDistance) >= 0;
    }

    function canMoveUp(row) {
        return (row - travelDistance) >= 0;
    }

    function canMoveDown(row) {
        return (row + travelDistance) <= (rows - 1);
    }

    function drawAnimatedCircle(c) {
        if (iteration === 0) {
            randomRow = randIntBetween(0, rows)
            randomCol = randIntBetween(0, cols)

            initialPositionX = randomCol * CIRCLE_SPACING
            initialPositionY = randomRow * CIRCLE_SPACING

            var options = ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right', 'up-left', 'up-right', 'down-left', 'down-right']

            if (!canMoveDiagonally(randomRow, randomCol)) {
                options = options.filter(function (i) {
                    return !i.includes("-")
                })
            }
            if (!canMoveToRight(randomCol)) {
                options = options.filter(function (i) {
                    return !i.includes("right")
                })
            }
            if (!canMoveToLeft(randomCol)) {
                options = options.filter(function (i) {
                    return !i.includes("left")
                })
            }
            if (!canMoveUp(randomRow)) {
                options = options.filter(function (i) {
                    return !i.includes("up")
                })
            }
            if (!canMoveDown(randomRow)) {
                options = options.filter(function (i) {
                    return !i.includes("down")
                })
            }
            var direction = options[randIntBetween(0, options.length)]
            if (!direction) return;
            if (direction.includes('up')) {
                yCoefficient = -1
            } else if (direction.includes('down')) {
                yCoefficient = 1
            } else {
                yCoefficient = 0
            }

            if (direction.includes('left')) {
                xCoefficient = -1
            } else if (direction.includes('right')) {
                xCoefficient = 1
            } else {
                xCoefficient = 0
            }
        }

        var positionX = initialPositionX + xCoefficient * iteration * delta
        var positionY = initialPositionY + yCoefficient * iteration * delta

        drawCircle(c, positionX, positionY, true)
        drawTail();

        function drawTail() {
            var maximumTailLength = (travelDistance / 2) * CIRCLE_SPACING
            // starts at 0 ,maximum at center, and ends at 0
            var tailLength = maximumTailLength * (0.5 * ANIMATION_DURATION - Math.abs(iteration - (ANIMATION_DURATION / 2))) / (ANIMATION_DURATION / 2)

            drawLine(c,
                positionX,
                positionY,
                positionX - xCoefficient * tailLength,
                positionY - yCoefficient * tailLength,

                true)
        }

        iteration = iteration === ANIMATION_DURATION ? 0 : iteration + 1
    }

    function animation() {
        requestAnimationFrame(animation)
        clearCanvas(c)
        drawGrid(c)
        drawAnimatedCircle(c)
    }

    setTimeout(animation, 1000)
})()
