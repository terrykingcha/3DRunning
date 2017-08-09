define([
], function() {

    function AirCraft(obj) {
        THREE.Object3D.call(this);
        this.add(obj);
    }

    AirCraft.prototype = Object.create(THREE.Object3D.prototype);

    return function(manager) {
        var result = manager.getResult('arc170')[0];
        result.scale.set(0.1, 0.1, 0.1);
        result.rotation.set(0, Math.PI, 0);

        result.traverse(function(mesh) {
            if (mesh === result) return;
            // mesh.geometry.computeBoundingBox();
            mesh.geometry.center();
        });

        var aircraft = new AirCraft(result);
        aircraft.name = 'aircraft';
        return aircraft;
    }
});