var camera, scene, renderer, cube;

window.onload = function() {
	initAudio();
	initRenderer();
	animate();
};

function initRenderer() {
	var container = document.createElement('div');
	document.body.appendChild(container);

	// create camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(15, 6, 12);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(0,0,0));

	// create scene
	scene = new THREE.Scene();

	// create cube
	var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
	cube = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial({color : '#2980b9'}));
	cube.position.set(0,0.5,0);
	scene.add(cube);
	
	// add some ambient light
	scene.add(new THREE.AmbientLight(0x222222));

	// create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xe5e5e5);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// add canvas to dom
	container.appendChild(renderer.domElement);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	renderer.render(scene, camera);
}
