define([
    '../objects/scene',
    '../objects/camera',
    '../objects/renderer'
], function(
    scene,
    camera,
    renderer
) {

    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    return function() {
        renderer.render(scene, camera);
    }
});