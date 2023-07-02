"use strict";

function getCoordinates(boundary, region) {
    let coordinates = boundary["geo_shape"]["geometry"]["coordinates"];
    return findAllListsOfPairs(coordinates);
}

function getBoundary(boundaries, region) {
    for (const boundary of boundaries) {
        if (boundary["name"] == region) {
            return boundary;
        }
    }
    return null;
}


