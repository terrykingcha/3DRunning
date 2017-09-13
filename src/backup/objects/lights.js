define([
], function() {
    var ambient = new THREE.AmbientLight(0xffffff);

    var head = new THREE.PointLight(0xffffff, 1, 1000);
    head.name = 'headlight';

    var player = new THREE.PointLight(0xffffff, 1, 500);
    player.name = 'playerlight';

    return {
        ambient: ambient,
        head: head,
        player: player
    };
})