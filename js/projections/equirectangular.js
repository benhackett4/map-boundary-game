"use strict";

function equirectangularProjection(coordinates_lists, max_width, max_height) {
    let min_max_data = getMinMax(coordinates_lists);
    let min_longitude = min_max_data["min_x"];
    let max_longitude = min_max_data["max_x"];
    let min_latitude = min_max_data["min_y"];
    let max_latitude = min_max_data["max_y"];
    let unscaled_height = max_latitude - min_latitude;
    let unscaled_width = max_longitude - min_longitude;
    let scale_factor_x = max_width / unscaled_width;
    let scale_factor_y = max_height / unscaled_height;
    let scale_factor = Math.min(scale_factor_x, scale_factor_y);
    let new_coordinates_lists = [];
    for (const coordinates_list of coordinates_lists) {
        let new_coordinates = [];
        for (const coordinates of coordinates_list) {
            let longitude = coordinates[0];
            let latitude = coordinates[1];
            let new_x = Math.round((longitude - min_longitude) * scale_factor);
            let new_y = Math.round((latitude - min_latitude) * scale_factor);
            new_coordinates.push([new_x, new_y]);
        }
        new_coordinates_lists.push(new_coordinates);
    }
    return new_coordinates_lists;
}

