define([
], function() {
    function createRoute(path) {
        var geometry = new THREE.TubeGeometry(path, 64, 200, 64, false);
        for (var i = 0; i < geometry.faces.length; i++) {
            geometry.faces[i].color = new THREE.Color("hsl("+Math.floor(Math.random()*360)+",50%,50%)")
        }

        var material = new THREE.MeshLambertMaterial({
            side: THREE.BackSide,
            vertexColors: THREE.FaceColors,
            wireframe: false
        });

        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    return function() {
        var straight1 = new THREE.LineCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -2000)
        );

        var corner1 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, -2000),
            new THREE.Vector3(0, 0, -2500),
            new THREE.Vector3(500, 0, -2500)
        );

        var straight2 = new THREE.LineCurve3(
            new THREE.Vector3(500, 0, -2500),
            new THREE.Vector3(2500, 0, -2500)
        );

        var corner2 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(2500, 0, -2500),
            new THREE.Vector3(3000, 0, -2500),
            new THREE.Vector3(3000, 0, -2000)
        );

        var straight3 = new THREE.LineCurve3(
            new THREE.Vector3(3000, 0, -2000),
            new THREE.Vector3(3000, 0, 0)
        );

        var corner3 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(3000, 0, 0),
            new THREE.Vector3(3000, 0, 500),
            new THREE.Vector3(2500, 0, 500)
        );

        var straight4 = new THREE.LineCurve3(
            new THREE.Vector3(2500, 0, 500),
            new THREE.Vector3(500, 0, 500)
        );

        var corner4 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(500, 0, 500),
            new THREE.Vector3(0, 0, 500),
            new THREE.Vector3(0, 0, 0)
        );

        var path = new THREE.CurvePath();
        path.add(straight1);
        path.add(corner1);
        path.add(straight2);
        path.add(corner2);
        path.add(straight3);
        path.add(corner3);
        path.add(straight4);
        path.add(corner4);

        var speadway = createRoute(path);
        speadway.name = 'speadway';
        speadway.path = path;

        return speadway;
    }
});