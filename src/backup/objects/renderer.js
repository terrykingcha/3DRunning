define(function(scene) {
    var renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('canvas')
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
});