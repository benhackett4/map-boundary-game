"use strict";

function onLoad() {
    const canvas = document.getElementById("borders-canvas");
    const ctx = canvas.getContext("2d");
    // If lineWidth is 1, no data points are the exact color of the strokeStyle :/.
    // So lineWidth must be AT LEAST 2.
    ctx.lineWidth = 2;
    globalThis.ctx = ctx;
    globalThis.canvas_bounding_rect = canvas.getBoundingClientRect();
    const region_selector = document.getElementById("region-selector");
    const projection_selector = document.getElementById("projection-selector");
    const grade_div = document.getElementById("grade");
    let region_names = boundaries.map(boundary => boundary["name"]);
    region_names.sort();
    for (const region_name of region_names) {
        let option = document.createElement("option");
        option.text = region_name;
        option.value = region_name;
        region_selector.appendChild(option);
    }
    let human_answer = null;
    let actual_answer = null;
    const answer_button = document.getElementById("answer-button");
    function showAnswer() {
        let region_name = region_selector.value;
        human_answer = getBoolMatrix(ctx, 255, 255, 255, 255);
        let projection = projection_selector.value;
        drawAnswer(ctx, region_name, projection);
        actual_answer = getBoolMatrix(ctx, 255, 0, 0, 255);
    }
    answer_button.addEventListener("click", (event) => {
        showAnswer();
    });
    const grade_button = document.getElementById("grade-button");
    grade_button.addEventListener("click", (event) => {
        showAnswer();
        let distance_sum = sumNearestDistances(human_answer, actual_answer);
        distance_sum += sumNearestDistances(actual_answer, human_answer);
        let letter_grade = numericScoreToLetterGrade(distance_sum);
        grade_div.innerText = "Your grade: " + letter_grade;
    });

    const clear_button = document.getElementById("clear-button");
    clear_button.addEventListener("click", (event) => {
        resetCanvas();
        grade_div.innerText = "";
    });

    // last known position
    globalThis.mouse_pos = { x: 0, y: 0 };

    document.addEventListener('mousemove', mouseDraw);
    document.addEventListener('mousedown', setMousePosition);
    document.addEventListener('mouseenter', setMousePosition);

    resetCanvas();
}


