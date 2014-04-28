var container, stats;

var camera, scene, renderer, objects;
var pointLight;

var sphere;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var moveForward = false;
var moveBackwards = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

var targetMoveLeft = false;
var targetMoveRight = false;

var debugContext;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 150, 400 );
	camera.target = new THREE.Vector3( 0, 150, 0 );

	scene = new THREE.Scene();

	// Spheres

	objects = [];

	geometry = new THREE.IcosahedronGeometry( 100, 1 );

	material = new THREE.MeshBasicMaterial({color : '#f00'});

	sphere = new THREE.Mesh( geometry, material );

	sphere.position.x = Math.random() * 1000 - 500;
	sphere.position.y = Math.random() * 1000 - 500;
	sphere.position.z = Math.random() * 1000 - 500;

	sphere.rotation.x = Math.random() * 200 - 100;
	sphere.rotation.y = Math.random() * 200 - 100;
	sphere.rotation.z = Math.random() * 200 - 100;

	sphere.scale.x = sphere.scale.y = sphere.scale.z = Math.random() + 0.5;

	objects.push( sphere );

	scene.add( sphere );

	// Lights

	var ambientLight = new THREE.AmbientLight( Math.random() * 0x202020 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	pointLight = new THREE.PointLight( 0xff0000, 1 );
	scene.add( pointLight );

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild(stats.domElement);

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentKeyDown( event ) {

	switch ( event.keyCode ) {

		case 38: moveForward = true; break; // up
		case 40: moveBackwards = true; break; // down
		case 37: moveLeft = true; break; // left
		case 39: moveRight = true; break; // right
		case 87: moveUp = true; break; // w
		case 83: moveDown = true; break; // s
		case 65: targetMoveLeft = true; break; // a
		case 68: targetMoveRight = true; break; // d

	}

}

function onDocumentKeyUp( event ) {

	switch ( event.keyCode ) {

		case 38: moveForward = false; break; // up
		case 40: moveBackwards = false; break; // down
		case 37: moveLeft = false; break; // left
		case 39: moveRight = false; break; // right
		case 87: moveUp = false; break; // w
		case 83: moveDown = false; break; // s
		case 65: targetMoveLeft = false; break; // a
		case 68: targetMoveRight = false; break; // d

	}

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	if ( moveForward ) camera.position.z -= 10;
	if ( moveBackwards ) camera.position.z += 10;

	if ( moveLeft ) camera.position.x -= 10;
	if ( moveRight ) camera.position.x += 10;

	if ( moveUp ) camera.position.y += 10;
	if ( moveDown ) camera.position.y -= 10;

	if ( targetMoveLeft ) camera.target.x -= 10;
	if ( targetMoveRight ) camera.target.x += 10;

	camera.lookAt( camera.target );
	for ( var i = 0, l = objects.length; i < l; i++ ) {

		var object = objects[ i ];

		object.rotation.x += 0.01;
		object.rotation.y += 0.005;
		object.position.y = Math.sin( object.rotation.x ) * 200;

	}

	renderer.render( scene, camera );

}