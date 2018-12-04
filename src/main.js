(function() {
var renderer;
var camera;
var scene;
var ambientLight;
var cameraLight;
function init() {
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('canvas') // 获取画布元素，传递给渲染器
    });
    renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置画布的尺寸
    renderer.setClearColor(0x000000, 1); // 设置画布颜色和透明度

    camera = new THREE.PerspectiveCamera(30, // 相机的视角
        window.innerWidth / window.innerHeight, // 浏览器窗口的宽高比
        0.001, 10000); // 相机摄录的远近范围
    
    window.scene = scene = new THREE.Scene();
    
    ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // 默认强度为1

    cameraLight = new THREE.PointLight(0xffffff, 1, 5000); // 调整距离，找到你觉得合适的值
}

var aircraft;
function load(complete) {
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('models/');  // 设置模型文件路径
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/')   // 设置材质文件路径

    mtlLoader.load('Arc170.mtl', function(materials) { // 加载材质文件
        materials.preload();                // 预加载材质中定义的纹理文件
        objLoader.setMaterials(materials);  // 给模型设置材质

        objLoader.load('Arc170.obj', function(obj) { // 加载模型文件
            aircraft = obj;
            complete && complete();
        });
    });
}

var path;
function createPath() {
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

    path = new THREE.CurvePath();
    path.add(straight1);
    path.add(corner1);
    path.add(straight2);
    path.add(corner2);
    path.add(straight3);
    path.add(corner3);
    path.add(straight4);
    path.add(corner4);
}

var tube;
function createTube() {
    // 创建一个“圆形”隧道
    var geometry = new THREE.TubeGeometry(path, 64, 200, 64, false);
    // 给几何体的每个面赋予随机颜色
    for (var i = 0; i < geometry.faces.length; i++) { 
        var hsl = 'hsl(' + Math.floor(Math.random() * 360) + ',50%,50%)'; 
        geometry.faces[i].color = new THREE.Color(hsl); 
    }
    
    var material = new THREE.MeshLambertMaterial({ 
        side: THREE.BackSide, // 创建一个只有在背面渲染的材质
        vertexColors: THREE.FaceColors // 顶点的颜色同面的颜色
    });

    var bufferGeometry = new THREE.BufferGeometry(); 
    bufferGeometry.fromGeometry(geometry); // 提供缓冲好数据的几何体对象
    tube = new THREE.Mesh(bufferGeometry, material); // 创建隧道的网格对象
}

var pathPoints = [];
function randomPathPoints() {
    var len = 20;
    for (var i = 1; i < len; i++) {
        var t = i / len;
        var vector = path.getPoint(t);
        // 在x,y上随机偏移[-80，80]范围内的一个点。
        vector.x += (Math.random() * 160 - 80); 
        vector.y += (Math.random() * 160 - 80);
        vector.t = t; // 记录下该点在路径上所处位置
        pathPoints.push(vector);
    }
}

var brarrierGeometry = new THREE.SphereBufferGeometry(20, 64, 64);
var brarrierMaterial = new THREE.MeshPhongMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    opacity: 0.7
});

function createBrarrier() {
    var material = brarrierMaterial.clone();
    var hsl = 'hsl(' + Math.floor(Math.random() * 360) + ',100%,80%)';
    material.color = new THREE.Color(hsl);

    return new THREE.Mesh(brarrierGeometry, material);
}

var brarriers = [];
function randomBrarriers() {
    pathPoints.forEach(function(vector) { 
        // 在随机的路径点上放置障碍物
        var brarrier = createBrarrier();
        brarrier.position.copy(vector);
        brarriers.push(brarrier);
    });
}


init(); // 初始化
createPath(); // 创建隧道路径
createTube(); // 创建隧道网格
randomPathPoints(); // 随机障碍物位置
randomBrarriers(); // 随机障碍物

var updates = [];
function addUpdate(fn) { // 往队列中增加更新函数
    if (updates.indexOf(fn) < 0) {
        updates.push(fn);        
    }
}

function removeUpdate(fn) { // 从队列中删除函数
    var index = update.indexOf(fn);
    if (index > -1) {
        updates.splice(index, 1);        
    }
}

var lastTime;
var animateId;
function animate() {
    animateId = requestAnimationFrame(animate); // 尽快执行下一个动画帧
    var now = performance.now(); // 获取页面启动时的时间
    if (!lastTime) {
        lastTime = now;
    }
    var delta = now - lastTime;
    lastTime = now;

    updates.forEach(function(fn) { // 依次调用更新函数
        typeof fn === 'function' && fn(delta);
    });
}

function cancelAnimate() {
    if (animateId) {
        cancelAnimationFrame(animateId);
        animateId = undefined;
    }
}

var playElapsed = 0;
function moveAlongPath(delta) {
    playElapsed += delta;

    var t = playElapsed / (20 * 1000); // 时间单位是毫秒
    var p1 = path.getPoint(t % 1); // 当前时刻的位置
    var p2 = path.getPoint((t + 0.04) % 1); // 往前偏移一点位置
    var p3 = path.getPoint((t + 0.05) % 1); // 往前偏移一点位置

    aircraft.t = t + 0.04; // 飞船在路径上的位置
    aircraft.visible = true;
    aircraft.position.copy(p2); // 飞船的位置
    aircraft.lookAt(p3); // 飞船注视前进方向上的某一点
    camera.position.copy(p1); // 相机在当位置
    camera.lookAt(aircraft.position);    // 并注视着飞船
    cameraLight.position.copy(camera.position); // 灯光跟随相机
}

var speed = new THREE.Vector3(
    0, // X轴
    0, // Y轴
    0 // Z轴
);
var speedMax = new THREE.Vector3(3, 3, 0);
var speedMin = new THREE.Vector3(-3, -3, 0);
window.addEventListener('keydown', function(e) {
    // 按钮按下
    var code = e.keyCode || e.code;
    switch (code) {
        case 37: // 按下左，x轴速度+1
            speed.x += 1;
            break;
        case 39: // 按下右，x抽速度-1
            speed.x -= 1;
            break;
        case 38: // 按下上，y轴速度+1
            speed.y += 1;
            break;
        case 40: // 按下下，y轴速度-1
            speed.y = -1;
            break;
    }

    // 控制在范围内
    speed.clamp(speedMin, speedMax);
});

window.addEventListener('keyup', function(e) {
    // 按钮松开，对应轴上的速度归零
    var code = e.keyCode || e.code;
    switch (code) {
        case 37: // 松开左
        case 39: // 松开右
            speed.x = 0;
            break;
        case 38: // 松开上
        case 40: // 松开下
            speed.y = 0;
            break;
    }
});

var offset = new THREE.Vector3();
var offsetMax = new THREE.Vector3(50, 50, 0);
var offsetMin = new THREE.Vector3(-50, -50, 0);
function control() {
    // 偏移量是单位速度乘以一个固定值，值越大实际速度就越快
    offset.add(speed.clone().multiplyScalar(2));
    // 控制在范围内
    offset.clamp(offsetMin, offsetMax);

    var vector = offset.clone();
    vector.applyQuaternion(aircraft.quaternion); // 偏移量也需要经过旋转
    aircraft.position.add(vector); // 给飞船当前位置增加偏移量
}

var hhEl = document.querySelector('#time .hh');
var mmEl = document.querySelector('#time .mm');
var ssEl = document.querySelector('#time .ss');

function leftpad(target, len, str) {
    target += '';
    return new Array(len - target.length + 1).join(str) + target;
}

function time() {
    var timestamp = parseInt(playElapsed / 1000);
    var hh = parseInt(timestamp / 60 / 60);
    var mm = parseInt(timestamp / 60 - hh * 60) ;
    var ss = timestamp % 60;
    
    hhEl.textContent = leftpad(hh, 2, '0');
    mmEl.textContent = leftpad(mm, 2, '0');
    ssEl.textContent = leftpad(ss, 2, '0');
}

window.addEventListener('resize', function() { // 监听窗口大小变化
    // 获取窗口的长宽，并进行相应的设置
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

var pathIndex = 0;
function checkCrash() {
    var aircraftBox = new THREE.Box3();  // 创建一个初始状态的包围盒
    aircraftBox.setFromObject(aircraft); // 计算一个物体的包围盒信息
    var vector = new THREE.Vector3(
        (aircraftBox.min.x - aircraftBox.max.x) / 4, // 获得包围盒总宽的1/4
        0, 0
    );
    aircraftBox.expandByVector(vector); // 缩小包围盒的宽度为原来的1/2

    var t = aircraft.t % 1;
    // 检测离飞船最近的障碍物索引
    while (pathIndex < pathPoints.length &&
                t >= pathPoints[pathIndex].t) {
        pathIndex++;
    }
    pathIndex = pathIndex % pathPoints.length;

    var brarrierBox = brarriers[pathIndex].box;

    // 检测撞击
    if (aircraftBox.intersectsBox(brarrierBox)) {
        uiContainer.className = 'result';
        cancelAnimate();
    }
}

function render() {
    renderer.render(scene, camera);    
}

var uiContainer = document.querySelector('#ui');
var startButton = document.querySelector('#start');
load(function() {
    scene.add(camera); // 把相机加到场景中
    scene.add(ambientLight); // 把灯光加到场景中
    scene.add(cameraLight); // 把聚光灯加到场景中
    scene.add(aircraft); // 把飞船加到场景中
    scene.add(tube); // 把隧道加到场景中
    brarriers.forEach(function(brarrier) {
        // 把所有障碍物加到场景中
        scene.add(brarrier);
        // 计算障碍物的包围盒
        var box = new THREE.Box3();
        box.setFromObject(brarrier);
        brarrier.box = box;
    });

    aircraft.scale.set(0.1, 0.1, 0.1); // 缩小模型
    aircraft.rotation.set(0, Math.PI, 0); // 旋转飞船，让其背对玩家
    aircraft.traverse(function(obj) { // 遍历对象和其子元素
        if (obj.isMesh) {
            obj.geometry.center(); // 找到网格实例并把几何体调整到中心位置
        }
    });
    aircraft.visible = false; // 隐藏飞船
    
    camera.position.copy(path.getPoint(0)); // 相机位于起始点
    cameraLight.position.copy(camera.position); // 在相机的位置放置点光源

    render();   // 先渲染下场景
    addUpdate(moveAlongPath); // 让飞船沿着路径飞行的更新函数
    addUpdate(control); // 控制飞船移动的更新函数
    addUpdate(time); // 展示经过时间的更新函数
    addUpdate(checkCrash); // 检测碰撞
    addUpdate(render); // 用于渲染场景的更新函数    
    startButton.addEventListener('click', function() {
        uiContainer.className = 'running';
        animate(); // 启动动画帧
    }); 
});
})();