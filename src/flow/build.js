define([
    '../objects/scene',
    '../objects/camera',
    '../objects/lights',
    '../objects/aircraft',
    '../objects/speedway'
], function(
    scene,
    camera,
    lights,
    buildAircraft,
    buildSpeedway
) {
    return function(manager) {
        // scene.add(lights.ambient);

        var aircraft = buildAircraft(manager);
        var speadway = buildSpeedway();
        var path = speadway.path;
        scene.add(speadway);
        lights.head.position.z = -500;
        scene.add(lights.head);

        var player = new THREE.Group();
        player.name = 'player';
        scene.add(player);

        aircraft.position.z = 0;
        player.add(aircraft);

        lights.player.position.set(0, 0, 50);
        player.add(lights.player);

        camera.position.set(0, 0, 500);
        camera.lookAt(aircraft.position);
        player.add(camera);

    }
});