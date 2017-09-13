define(function() {
    var geometry = new THREE.BoxGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
});