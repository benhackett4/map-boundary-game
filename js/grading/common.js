"use strict";

function getNumberOfCoordinates(coordinates_lists) {
    return coordinates_lists.reduce(
        (sum, coordinates_list) => sum + coordinates_list.length,
        0
    );
}

function pixelValuesMatchRGBA(pixel_values, rgba) {
    for (let i=0; i<4; i++){
        if (pixel_values[i] != rgba[i]) {
            return false;
        }
    }
    return true;
}

function getBoolMatrix(ctx, red, green, blue, alpha) {
    // TODO - don't hardcode 600
    const ctxImageData = ctx.getImageData(0, 0, 600, 600);
    const data = ctxImageData.data;
    let rgba = [red, green, blue, alpha];
    let matrix = [];
    for (let i=0; i < 600; i++) {
        matrix.push([]);
        for (let j=0; j < 600; j++) {
            let pixel_index = 4 * ((600 * i) + j);
            let pixel_values = data.slice(pixel_index, pixel_index+4);
            if (pixelValuesMatchRGBA(pixel_values, rgba)) {
                matrix[i].push(true);
            } else {
                matrix[i].push(false);
            }
        }
    }
    return matrix;
}

function matrixElementExists(matrix, i, j) {
    return (i in matrix && j in matrix[i]);
}

function init2DMatrix(max_i, max_j, init_value) {
    let matrix = [];
    for (let i=0; i<max_i; i++) {
        matrix.push([]);
        for (let j=0; j<max_j; j++) {
            matrix[i].push(init_value);
        }
    }
    return matrix;
}

function minDistanceWithinRadius(matrix, i, j, radius) {
    let min_distance = null;
    for (let m=Math.max(i-radius, 0); m<=Math.min(i+radius, 600); m++) {
        for (let n=Math.max(j-radius, 0); n<=Math.min(j+radius, 600); n++) {
            if (matrixElementExists(matrix, m, n)) {
                if (matrix[m][n]) {
                    let distance = Math.round(Math.sqrt((m-i)**2 + (n-j)**2));
                    if (min_distance === null || distance < min_distance) {
                        min_distance = distance;
                    }
                }
            }
        }
    }
    return min_distance;
}

function searchWithinRadius(matrix, i, j, radius) {
    let min_distance = null;
    for (let m=Math.max(i-radius, 0); m<=Math.min(i+radius, 600); m++) {
        for (let n=Math.max(j-radius, 0); n<=Math.min(j+radius, 600); n++) {
            if (matrixElementExists(matrix, m, n)) {
                if (matrix[m][n]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function distanceToNearestPoint4(matrix, i, j) {
    let distance = minDistanceWithinRadius(matrix, i, j, 50);
    if (distance !== null) {
        return distance;
    }
    // Fall back to naive search
    return distanceToNearestPointNaive(matrix, i, j);
}

function distanceToNearestPoint3(matrix, i, j) {
    for (let radius = 5; radius <= 600; radius+=5) {
        if (searchWithinRadius(matrix, i, j, radius)) {
            return radius;
        }
    }
    return null;
}

function distanceToNearestPoint2(matrix, i, j) {
    let radius_list = [5, 15, 50, 150, 600];
    for (const radius of radius_list) {
        let distance = minDistanceWithinRadius(matrix, i, j, radius);
        if (distance !== null) {
            return distance;
        }
    };
    return null;
}

function distanceToNearestPointNaive(matrix, i, j) {
    let min_distance = 999999999; // TODO - fix hackiness??
    for (let m=0; m<matrix.length; m++) {
        for (let n=0; n<matrix[m].length; n++) {
            if (matrix[m][n]) {
                let distance = Math.round(Math.sqrt((m-i)**2 + (n-j)**2));
                if (distance < min_distance) {
                    min_distance = distance;
                }
            }

        }
    }
    return min_distance;
}

function boolMatrixToList(matrix) {
    let list = [];
    for (let i=0; i<matrix.length; i++) {
        for (let j=0; j<matrix[i].length; j++) {
            if (matrix[i][j]) {
                list.push([i, j]);
            }
        }
    }
    return list;
}

function distanceToNearestPointInList(list, i, j) {
    let min_distance = Infinity;
    for (const indices of list) {
        let [m, n] = indices;
        let distance = Math.round(Math.sqrt((m-i)**2 + (n-j)**2));
        if (distance < min_distance) {
            min_distance = distance;
        }
    }
    return min_distance;
}

function sumNearestDistancesUsingMatrix(matrix_from, matrix_to) {
    let sum = 0;
    for (let i=0; i<matrix_from.length; i++) {
        for (let j=0; j<matrix_from[i].length; j++) {
            if (matrix_from[i][j]) {
                let distance = distanceToNearestPoint4(matrix_to, i, j);
                if (distance !== null) {
                    sum += distance;
                }
            }
        }
    }
    return sum;
}

function sumNearestDistancesUsingList(matrix_from, matrix_to) {
    let matrix_to_list = boolMatrixToList(matrix_to);
    let sum = 0;
    for (let i=0; i<matrix_from.length; i++) {
        for (let j=0; j<matrix_from[i].length; j++) {
            if (matrix_from[i][j]) {
                let distance = distanceToNearestPointInList(matrix_to_list, i, j);
                if (distance !== null) {
                    sum += distance;
                }
            }
        }
    }
    return sum;
}

function sumNearestDistances(matrix_from, matrix_to) {
    let begin_time = performance.now();
    let sum = sumNearestDistancesUsingList(matrix_from, matrix_to);
    let end_time = performance.now();
    console.log(`sumNearestDistances took ${end_time - begin_time} ms`);
    return sum;
}

function numericScoreToLetterGrade(score) {
    if (score < 10000) {
        return "A+";
    } else if (score < 30000) {
        return "A";
    } else if (score < 50000) {
        return "A-";
    } else if (score < 60000) {
        return "B+";
    } else if (score < 80000) {
        return "B";
    } else if (score < 100000) {
        return "B-";
    } else if (score < 140000) {
        return "C+";
    } else if (score < 180000) {
        return "C";
    } else if (score < 220000) {
        return "C-";
    } else if (score < 280000) {
        return "D+";
    } else if (score < 350000) {
        return "D";
    } else if (score < 420000) {
        return "D-";
    }
    return "F";
}

