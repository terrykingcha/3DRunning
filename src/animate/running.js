define([
    '../objects/scene',
    '../objects/brarrier'
], function(
    scene,
    createBrarrier
) {
    var speadway;
    var player;
    var headlight;
    var aircraft;
    var elpased = 0;

    var barriers = [];

    function isIntersectionBox(a, b){
        return b.max.x < a.min.x || b.min.x > a.max.x || b.max.y < a.min.y || b.min.y > a.max.y ? false : true;
    }

    return function(delta) {
        speadway = speadway || scene.getObjectByName('speadway');
        player = player || scene.getObjectByName('player');
        headlight = headlight || scene.getObjectByName('headlight');
        aircraft = aircraft || player.getObjectByName('aircraft');

        var path = speadway.path;

        elpased += delta;

        // 当前时刻
        var t = 0 + 1 * (elpased / (10 * 1000));

        var p1 = path.getPoint(t % 1); // 玩家的位置
        var p2 = path.getPoint((t + 0.01) % 1); // 注视的位置
        var p3 = path.getPoint((t + 0.1) % 1); // 灯的位置

        var m1 = new THREE.Matrix4();
        m1.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));
        player.position.copy(p1);
        player.quaternion.setFromRotationMatrix(m1);
        headlight.position.copy(p3);

        // 移除已经在后方的障碍
        if (barriers[0] && barriers[0].t < t - 0.05) {
            scene.remove(barriers[0]);
            barriers.shift();
        }

        // 随机生成障碍（视野能最多3个）
        while (barriers.length < 3) {
            var bt = t + 0.05 + 0.1 * barriers.length;
            var bp = path.getPoint(bt % 1);

            barrier = createBrarrier();
            barrier.position.copy(bp);
            barrier.position.x += (Math.random() * 30 + 20) * Math.sign(Math.random() * 1 - 0.5);
            barrier.position.y += (Math.random() * 30 + 20) * Math.sign(Math.random() * 1 - 0.5);
            barrier.t = bt;
            scene.add(barrier);
            barriers.push(barrier);
        }

        // 计算碰撞
        var aircraftBox = new THREE.Box3();
        aircraftBox.setFromObject(aircraft);
        // console.log(aircraftBox.min, aircraftBox.max);
        aircraftBox.expandByVector(new THREE.Vector3((aircraftBox.min.x - aircraftBox.max.x) / 4, 0, 0));
        // console.log(aircraftBox.min, aircraftBox.max);

        var barrierBox = new THREE.Box3();
        barrierBox.setFromObject(barriers[0]);

        console.log(aircraftBox.intersectsBox(barrierBox));

        // console.log(isIntersectionBox(aircraftBox, barrierBox));
    }
});