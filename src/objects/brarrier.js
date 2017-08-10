define([], function() {
    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.7
    });

    return function() {
        var m = material.clone();
        m.color = new THREE.Color("hsl("+Math.floor(Math.random()*360)+",50%,50%)");

        return new THREE.Mesh(geometry, m);
    }
});