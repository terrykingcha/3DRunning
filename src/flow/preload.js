define([
    '../loadManager'
], function(
    manager
) {
    return function(cb) {
        manager.on('complete', function() {
            cb(manager);
        });

        var arc170Loader = manager.add('arc170', THREE.OBJLoader);
        arc170Loader.setPath('models/arc_170/');

        var arc170mLoader = manager.add('arc170m', THREE.MTLLoader);
        arc170mLoader.setPath('models/arc_170/');

        manager.load('arc170m', 'Arc170.mtl', function(materials) {
            materials.preload();
            arc170Loader.setMaterials(materials);
            manager.load('arc170', 'Arc170.obj');
        });
    }
});