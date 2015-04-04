/**
 * UBC CPSC 314, Vjan2015
 * Assignment 4 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x404040, 1); // white background colour
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(120, 1, 0.1, 1000); // view angle, aspect ratio, near, far
// camera.position.set(30, 75, 60);
camera.position.set(0, 150, 200);
camera.lookAt(scene.position);
scene.add(camera);

var cHelper = new THREE.CameraHelper(camera);
cHelper.update();

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5);
scene.add(worldFrame);

// Image Loading:
var imgPrefix = 'images/background/';
var leftImg = new THREE.ImageUtils.loadTexture(imgPrefix + 'left.png');
var middleImg = new THREE.ImageUtils.loadTexture(imgPrefix + 'middle.png');
var right1Img = new THREE.ImageUtils.loadTexture(imgPrefix + 'right1.png');
var right2Img = new THREE.ImageUtils.loadTexture(imgPrefix + 'right2.png');
var groundImg = new THREE.ImageUtils.loadTexture(imgPrefix + 'ground.png');
var skyImg = new THREE.ImageUtils.loadTexture(imgPrefix + 'sky.png');
var grassImg = new THREE.ImageUtils.loadTexture(imgPrefix + 'grass.jpg');
var cube1 = new THREE.ImageUtils.loadTexture(imgPrefix + 'cube1.png');
var cube2 = new THREE.ImageUtils.loadTexture(imgPrefix + 'cube2.png');
var cube3 = new THREE.ImageUtils.loadTexture(imgPrefix + 'cube3.png');
var cube4 = new THREE.ImageUtils.loadTexture(imgPrefix + 'cube4.png');
var cube5 = new THREE.ImageUtils.loadTexture(imgPrefix + 'cube5.png');
var cube6 = new THREE.ImageUtils.loadTexture(imgPrefix + 'cube6.png');

var objPrefix = 'images/Textures/';
var dog2Img = new THREE.ImageUtils.loadTexture(objPrefix + 'coolDog2.jpg');

// Objects Addition:
var mirBall = new THREE.CubeCamera(0.1, 5000, 30);

scene.add(mirBall);
var ballGeom = new THREE.SphereGeometry(20, 32, 32);
var ballMat = new THREE.MeshBasicMaterial({
    envMap: mirBall.renderTarget
});
var ballMesh = new THREE.Mesh(ballGeom, ballMat);
ballMesh.position.set(0, 0, 0);
ballMesh.position.y += 100;
mirBall.position = ballMesh.position;
mirBall.parent = ballMesh;
scene.add(ballMesh);



// Light UP
var ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

var sunLight = new THREE.PointLight(0x000066, 1, 100);
sunLight.position.set(1, 500, 0);
scene.add(sunLight);

var spotLight = new THREE.SpotLight(0xffff00);
spotLight.angle = Math.PI /2;
spotLight.target.position.set(0,2,0);
spotLight.intensity = 1;
spotLight.position.set(-15,200,-7.5);
spotLight.shadowCameraNear = 0.01;
spotLight.castShadow = true;
spotLight.shadowDarkness = 0.5;
//spotLight.shadowCameraVisible = true;
scene.add(spotLight);
spotLight.parent = worldFrame;

var spotLight2 = new THREE.SpotLight(0xff0000);
spotLight2.target.position.set(0,2,0);
spotLight2.intensity = 1;
spotLight2.position.set(15,200,-15);
spotLight2.shadowCameraNear = 0.01;
spotLight2.castShadow = true;
spotLight2.shadowDarkness = 0.5;
//spotLight2.shadowCameraVisible = true;
// Edit shadow
spotLight2.shadowMapWidth = 1024;
spotLight2.shadowMapHeight = 1024;
spotLight2.shadowCameraNear = 500;
spotLight2.shadowCameraFar = 4000;
spotLight2.shadowCameraFov = 30;

scene.add(spotLight2);
spotLight.parent = worldFrame;

// FLOOR WITH CHECKERBOARD 
var floorTexture = grassImg;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.wrapS = THREE.RepeatWrapping;

// floorTexture.repeat.set(2, 2);
var floorMaterial = new THREE.MeshPhongMaterial({
	shading: THREE.SmoothShading,
	side: THREE.DoubleSide,
	map: floorTexture,
    color: 0x000000
});
var floorGeometry = new THREE.PlaneGeometry(300,300,10,10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.castShadow = false;
floor.receiveShadow = true;
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

// Surrounding:
var envPrefix = 'images/background/';
var surrounding = [];
surrounding.push(new THREE.MeshBasicMaterial({ map: cube1}));
surrounding.push(new THREE.MeshBasicMaterial({ map: cube2}));
surrounding.push(new THREE.MeshBasicMaterial({ map: cube3}));
surrounding.push(new THREE.MeshBasicMaterial({ map: cube4}));
surrounding.push(new THREE.MeshBasicMaterial({ map: cube5}));
surrounding.push(new THREE.MeshBasicMaterial({ map: cube6}));
for (var i = 0; i < 6; i++) {
    surrounding[i].side = THREE.BackSide;
}
var surMat = new THREE.MeshFaceMaterial(surrounding);
var surGeo = new THREE.BoxGeometry (600, 600, 600);
var surMesh = new THREE.Mesh( surGeo, surMat);
surMesh.parent = worldFrame;
surMesh.castShadow = false;
surMesh.receiveShadow = true;
//surMesh.position.y = -0.1;
// surMesh.rotation.x = Math.PI / 2;
scene.add(surMesh);



// Loading Custom Object:
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
    var onProgress = function(query) {
        if (query.lengthComputable) {
            var percentComplete = query.loaded / query.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    
    var onError = function() {
        console.log('Failed to load ' + file);
    };

    var loader = new THREE.OBJLoader()
    loader.load(file, function(object) {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = false;
            }
        });
        object.position.set(xOff, yOff, zOff);
        object.rotation.x = xRot;
        object.rotation.y = yRot;
        object.rotation.z = zRot;
        object.scale.set(scale, scale, scale);
        object.parent = worldFrame;
        scene.add(object);

    }, onProgress, onError);
}

var dogMat = new THREE.MeshPhongMaterial({
	// ambient: 0x444444,
	shininess: 400,
	map: dog2Img,
	shading: THREE.SmoothShading,
	color: 0x404040
});

var dog2Mat = new THREE.MeshPhongMaterial({
    shininess: 400,
    specular: 0x33AA33,
    shading: THREE.SmoothShading,
    map: dog2Img
});

loadOBJ('images/Characters/myDog.obj', dog2Mat, 2, 0, 0, 0, 0, 0, 0);


// HELPER FUNCTIONS:
function lightUP() {
	
}

function renderBall() {
    ballMesh.visible = false;
    mirBall.updateCubeMap(renderer, scene);
    ballMesh.visible = true;
}

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
    if (keyboard.pressed("W")) {
        ballMesh.position.x += 0.7;
  } else if (keyboard.pressed("S")) {
    ballMesh.position.x -= 0.7;
  } else if (keyboard.pressed("A")) {
    ballMesh.position.z += 0.7;
  } else if (keyboard.pressed("D")) {
    ballMesh.position.z -= 0.7;
  }

  ballMat.needsUpdate = true;
  spotLight2.needsUpdate = true;
}


// SETUP UPDATE CALL-BACK
function update() {
	lightUP();
    checkKeyboard();
    renderBall();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

update();
