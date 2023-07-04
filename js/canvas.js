"use strict";

function invertY(coordinates_lists) {
    let {min_y, max_y} = getMinMax(coordinates_lists);
    let inverted_coordinates_lists = [];
    for (const coordinates_list of coordinates_lists) {
        let inverted_coordinates_list = coordinates_list.map(coordinates => {
            return [coordinates[0], min_y + max_y - coordinates[1]];
        });
        inverted_coordinates_lists.push(inverted_coordinates_list);
    }
    return inverted_coordinates_lists;
}

function drawPath(ctx, scaled_coordinates){
    ctx.beginPath();
    let initial_coordinate = scaled_coordinates[0];
    // TODO - fix 600 hardcoding.
    ctx.moveTo(initial_coordinate[0], initial_coordinate[1]);
    for (let i=1; i < scaled_coordinates.length; i++) {
        let coordinates = scaled_coordinates[i];
        let x = coordinates[0];
        let y = coordinates[1];
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawBoundaries(ctx, scaled_coordinates_lists, strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    for (const scaled_coordinates of scaled_coordinates_lists) {
        drawPath(ctx, scaled_coordinates);
    }
}

function drawAnswer(ctx, region, projection) {
    let boundary = getBoundary(boundaries, region);
    let coordinates_lists = getCoordinates(boundary, region);

    if (region == "Russian Federation" || region == "United States of America") {
        // Must happen before projections, otherwise you risk ending up with a tiny map.
        coordinates_lists = scrollHorizontallyToFindMinMapWidth(coordinates_lists);
    }

    let strokeStyle = '';
    if (projection == "Equirectangular") {
        strokeStyle = 'rgb(255 0 0)';
        coordinates_lists = equirectangularProjection(coordinates_lists, 500, 500);
        coordinates_lists = invertY(coordinates_lists);
    } else if (projection == "Albers Equal Area Conic") {
        strokeStyle = 'rgb(0 255 0)';
        coordinates_lists = albersEqualAreaConicProjection(coordinates_lists, 500, 500);
        coordinates_lists = invertY(coordinates_lists);
    } else if (projection == "Web Mercator") {
        strokeStyle = 'rgb(0 0 255)';
        coordinates_lists = webMercatorProjection(coordinates_lists, 9);
    } else {
        console.log("Error: unexpected projection: " + projection);
        return;
    }

    coordinates_lists = centre(coordinates_lists, 600, 600);

    drawBoundaries(ctx, coordinates_lists, strokeStyle);
}

function resetCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// new position from mouse event
function setMousePosition(e) {
    mouse_pos.x = e.clientX - canvas_bounding_rect.left;
    mouse_pos.y = e.clientY - canvas_bounding_rect.top;
}

function mouseDraw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255 255 255)';

    ctx.moveTo(mouse_pos.x, mouse_pos.y); // from
    setMousePosition(e);
    ctx.lineTo(mouse_pos.x, mouse_pos.y); // to

    ctx.stroke();
}



