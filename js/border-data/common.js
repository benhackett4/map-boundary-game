"use strict";

function getMinMax(coordinates_lists) {
    let flat_list = coordinates_lists.flat(1);
    let list_x = flat_list.map(coordinates => coordinates[0]);
    let list_y = flat_list.map(coordinates => coordinates[1]);
    let return_data = {};
    return_data["min_x"] = Math.min(...list_x);
    return_data["max_x"] = Math.max(...list_x);
    return_data["min_y"] = Math.min(...list_y);
    return_data["max_y"] = Math.max(...list_y);
    return return_data;
}

// Assume that "list" is a non-empty list of lists.
// Assume that each list element has the exact same "type", if you will.
function isListOfPairsOfNonLists(list) {
    let first_list = list[0]
    if (first_list.length != 2) {
        return false;
    }
    if (Array.isArray(first_list[0])){
        return false;
    }
    return true;
}

function findAllListsOfPairs(list) {
    if (isListOfPairsOfNonLists(list)) {
        return [list];
    }
    let list_of_lists = [];
    for (let i=0; i<list.length; i++) {
        let sublists = findAllListsOfPairs(list[i]);
        list_of_lists = list_of_lists.concat(sublists);
    }
    return list_of_lists;
}

function getMapWidth(coordinates_lists) {
    let min_max_data = getMinMax(coordinates_lists);
    let min_x = min_max_data["min_x"];
    let max_x = min_max_data["max_x"];
    let region_width = max_x - min_x;
    return region_width;
}

// Assumes offsets are smaller than (max - min) values (so that we can avoid modulo arithmetic with axes that involve negative numbers).
// Handles negative values (so that it can accomodate lat/long inputs, etc).
function applyOffset(coordinates_lists, offset_x, offset_y, min_x, max_x, min_y, max_y) {
    let new_coordinates_lists = [];
    for (const coordinates_list of coordinates_lists) {
        let new_coordinates_list = [];
        for (const coordinates of coordinates_list) {
            let new_x = coordinates[0] + offset_x;
            // Handle wrapping around.
            if (new_x > max_x) {
                let excess = new_x - max_x;
                new_x = excess + min_x;
            } else if (new_x < min_x) {
                let excess = min_x - new_x;
                new_x = max_x - excess;
            }

            let new_y = coordinates[1] + offset_y;
            // Handle wrapping around.
            if (new_y > max_y) {
                let excess = new_y - max_y;
                new_y = excess + min_y;
            } else if (new_y < min_y) {
                let excess = min_y - new_y;
                new_y = max_y - excess;
            }

            let new_coordinates = [new_x, new_y];
            new_coordinates_list.push(new_coordinates);
        }
        new_coordinates_lists.push(new_coordinates_list);
    }
    return new_coordinates_lists;
}

function scrollHorizontallyToFindMinMapWidth(coordinates_lists) {
    let optimal_coordinates_lists = coordinates_lists;
    let min_width = getMapWidth(optimal_coordinates_lists);
    for (let offset=0; offset < 360; offset += 10) {
        let transformed_lists = applyOffset(coordinates_lists, offset, 0, -180, 180, -90, 90);
        let width = getMapWidth(transformed_lists);
        if (width < min_width) {
            min_width = width;
            optimal_coordinates_lists = transformed_lists;
        }
    }
    return optimal_coordinates_lists;
}

function centre(scaled_coordinates_lists, canvas_width, canvas_height) {
    let min_max_data = getMinMax(scaled_coordinates_lists);
    let min_x = min_max_data["min_x"];
    let max_x = min_max_data["max_x"];
    let min_y = min_max_data["min_y"];
    let max_y = min_max_data["max_y"];
    let region_height = max_y - min_y;
    let region_width = max_x - min_x;
    let desired_min_y = Math.round(canvas_height/2) - Math.round(region_height/2);
    let desired_min_x = Math.round(canvas_width/2) - Math.round(region_width/2);
    let offset_y = desired_min_y - min_y;
    let offset_x = desired_min_x - min_x;
    return applyOffset(scaled_coordinates_lists, offset_x, offset_y, 0, canvas_width, 0, canvas_height);
}



