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
var camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10, 15, 40);
camera.lookAt(scene.position);
scene.add(camera);

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

var objPrefix = 'images/Textures/';
var dog2Img = new THREE.ImageUtils.loadTexture(objPrefix + 'coolDog2.jpg');

// Light UP
var ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

var sunLight = new THREE.PointLight(0xFFFF66, 1, 100);
sunLight.position.set(1, 50, 0);
scene.add(sunLight);

var spotLight = new THREE.SpotLight(0xffff00);
spotLight.angle = Math.PI /2;
spotLight.target.position.set(0,2,0);
spotLight.intensity = 0.7;
spotLight.position.set(-12,30,-6);
spotLight.shadowCameraNear = 0.01;
spotLight.castShadow = true;
spotLight.shadowDarkness = 0.5;
spotLight.shadowCameraVisible = true;
scene.add(spotLight);

var spotLight2 = new THREE.SpotLight(0xff0000);
spotLight2.target.position.set(0,2,0);
spotLight2.intensity = 0.7;
spotLight2.position.set(12,30,-12);
spotLight2.shadowCameraNear = 0.01;
spotLight2.castShadow = true;
spotLight2.shadowDarkness = 0.5;
spotLight2.shadowCameraVisible = true;
scene.add(spotLight2);

// FLOOR WITH CHECKERBOARD 
var floorTexture = groundImg;
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
	shading: THREE.SmoothShading,
	side: THREE.DoubleSide,
	map: floorTexture
});
var floorGeometry = new THREE.PlaneGeometry(1000,1000,10,10);
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
surrounding.push(new THREE.MeshBasicMaterial({ map: leftImg}));
surrounding.push(new THREE.MeshBasicMaterial({ map: leftImg}));
surrounding.push(new THREE.MeshBasicMaterial({ map: leftImg}));
surrounding.push(new THREE.MeshBasicMaterial({ map: right2Img}));
surrounding.push(new THREE.MeshBasicMaterial({ map: leftImg}));
surrounding.push(new THREE.MeshBasicMaterial({ map: leftImg}));
for (var i = 0; i < 6; i++) {
    surrounding[i].side = THREE.DoubleSide;
}
var surMat = new THREE.MeshFaceMaterial(surrounding);
var surGeo = new THREE.BoxGeometry (600, 600, 600, 1,1,1);
var surMesh = new THREE.Mesh( surGeo, surMat);
scene.add(surMesh);



// Objects Addition:
var ballGeom = new THREE.SphereGeometry(3, 32, 32);
var ballMPos = new THREE.Vector3(0, 2.5, 0); //Mesh position in world
var ballPPos = new THREE.Vector3(2.5, 2.5, 10); //Projector position in world
var ballMat = new THREE.MeshPhongMaterial({
 //    ambient: 0x444444,
	// shininess: 300,
	// specular: 0x33AA33,
	shading: THREE.SmoothShading,
	color: 0x404040
});

var ballMesh = new THREE.Mesh(ballGeom, ballMat);
ballMesh.castShadow = true;
ballMesh.receiveShadow = false;
ballMesh.position.set(0, 10, 0);
ballMesh.parent = worldFrame;
scene.add(ballMesh);

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

loadOBJ('images/Characters/coolDog2.obj', dog2Mat, 0.4, 0, 0, 0, 0, 0, 0);


// HELPER FUNCTIONS:
function lightUP() {
	
}



// SETUP UPDATE CALL-BACK
function update() {
	lightUP();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

update();
