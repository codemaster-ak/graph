const {BASE_CONNECTION_COLOR, BASE_POINT_COLOR} = require("../consts");

function toBaseColours(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (i === 0 && j > 0) matrix[i][j].colour = BASE_CONNECTION_COLOR
            if (j === 0 && i > 0) matrix[i][j].colour = BASE_POINT_COLOR
        }
    }
    return matrix
}

module.exports.toBaseColours = toBaseColours;