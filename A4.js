/**
 * UBC CPSC 314, Vjan2015
 * Assignment 4 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
//renderer.setClearColor(0x0099CC); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10,15,40);
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
var worldFrame = new THREE.AxisHelper(5) ;
scene.add(worldFrame);

// Image Loading:
var imgPrefix = 'images/background/';
var skyImg = new THREE.ImageUtils.loadTexture(imgPrefix + 'sky.png');
var groundImg = new THREE.ImageUtils.loadTexture( imgPrefix + 'ground.png');

// FLOOR WITH CHECKERBOARD 
var floorTexture = groundImg;
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
var floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(70, 50);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;


// Geometry
var pGeom = new THREE.SphereGeometry(3,32,32);
var pMPos = new THREE.Vector3(0,2.5,0); //Mesh position in world
var pPPos = new THREE.Vector3(2.5,2.5,10); //Projector position in world
var pMat = new THREE.MeshPhongMaterial({
	color: 0xffffff
});

var pMesh = new THREE.Mesh(pGeom, pMat);
pMesh.position.set(0,10,0);
pMesh.parent = worldFrame;
scene.add(pMesh);


// Light UP
var ambientLight = new THREE.AmbientLight( 0x404040 );
scene.add( ambientLight );

var sunLight = new THREE.PointLight( 0xFFFF66, 0.7, 100 );
sunLight.position.set( 1, 50, 0 );
scene.add( sunLight );

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.intensity = 0.2;
spotLight.position.set( 0, 20, 4 );
spotLight.castShadow = true;
spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;
spotLight.shadowCameraNear = 500;
spotLight.shadowCameraFar = 4000;
spotLight.shadowCameraFov = 30;
scene.add( spotLight );


// HELPER FUNCTIONS:
function lightUP() {
	
}

// SETUP UPDATE CALL-BACK
function update() {
	
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

update();
