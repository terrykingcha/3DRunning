define([
    '../objects/scene'
], function(
    scene
) {
    var player;
    var aircraft;

    var range = [
        50, // Y轴正方向
        -50, // Y轴负方向
        50, // X轴负方向
        -50  // X轴正方向
    ];
    var speed = [
        0, // 方向键上，Y轴正方向
        0, // 方向键下，Y轴负方向
        0, // 方向键左，X轴负方向
        0  // 方向键右，X轴正方向
    ];
    window.addEventListener('keydown', function(e) {
        var code = e.keyCode || e.code;
        switch (code) {
            case 38: // 方向键上
                speed[0] = 1;
                break;
            case 40: // 方向键下
                speed[1] = -1;
                break;
            case 37: // 方向键左
                speed[2] = -1;
                break;
            case 39: // 方向键右
                speed[3] = 1;
                break;
        }
    });

    window.addEventListener('keyup', function(e) {
        var code = e.keyCode || e.code;
        switch (code) {
            case 38: // 方向键上
                speed[0] = 0;
                break;
            case 40: // 方向键下
                speed[1] = 0;
                break;
            case 37: // 方向键左
                speed[2] = 0;
                break;
            case 39: // 方向键右
                speed[3] = 0;
                break;
        }
    });

    var x = 0;
    var y = 0;
    var step = 2;

    return function() {
        player = player || scene.getObjectByName('player');
        aircraft = aircraft || player.getObjectByName('aircraft');
        if (x >= range[3] && x <= range[2]) {
            x += speed[2] * step + speed[3] * step;
        }

        if (y >= range[1] && y <= range[0]) {
            y += speed[0] * step + speed[1] * step;
        }
        x = Math.min(range[2], Math.max(range[3], x));
        y = Math.min(range[0], Math.max(range[1], y));

        aircraft.position.x = x;
        aircraft.position.y = y;
    }
});