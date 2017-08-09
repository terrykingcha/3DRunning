define([
    '../objects/scene'
], function(
    scene
) {
    var speadway;
    var player;
    var headlight;
    var aircraft;
    var elpased = 0;

    return function(delta) {
        speadway = speadway || scene.getObjectByName('speadway');
        player = player || scene.getObjectByName('player');
        headlight = headlight || scene.getObjectByName('headlight');
        aircraft = aircraft || player.getObjectByName('aircraft');

        elpased += delta;
        var t = 0 + 1 * (elpased / (10 * 1000));
        var path = speadway.path;

        // if (t <= 1) {
            var p1 = path.getPoint(t % 1);
            var p2 = path.getPoint((t + 0.01) % 1);
            var p3 = path.getPoint((t + 0.1) % 1);
            var m1 = new THREE.Matrix4();
            m1.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));

            player.position.copy(p1);
            player.quaternion.setFromRotationMatrix(m1);
            console.log(Math.abs(m1.elements[0]), Math.acos(m1.elements[0]) / Math.PI * 180);

            headlight.position.copy(p3);
        // }
    }
});