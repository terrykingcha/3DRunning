define([
    './objects/scene',
    './objects/camera',
    './objects/renderer',
    './objects/lights'
], function(
    scene,
    camera,
    renderer,
    lights
) { 
    var isDebug = false;
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

    var helpers = [
        new THREE.GridHelper(1000, 10)
    ];

    var lightTypes = ['Ambient', 'DirectionalLight', 'PointLight', 'SpotLight', 'RectAreaLight']
    Object.keys(lights).forEach(function(key) {
        var light = lights[key];
        lightTypes.forEach(function(type) {
            if (light['is' + type]) {
                helpers.push(new THREE[type + 'Helper'](light, 10));
            }
        });
    });

    return function() {
        function debugon() {
            controls.enabled = true;
            helpers.forEach(function(helper) {
                scene.add(helper);
            });
        }

        function debugoff() {
            controls.enabled = false;
            helpers.forEach(function(helper) {
                scene.remove(helper);
            });
        }

        Object.defineProperties(window, {
            THREE_DEBUG: {
                get: function() {
                    return isDebug;
                },
                set: function(v) {
                    isDebug = v;
                    isDebug ? debugon() : debugoff();
                }
            }
        });
    }
})