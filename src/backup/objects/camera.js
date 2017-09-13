define(function() {
    var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.001, 10000);
    camera.name = 'camera';
    return camera;
});