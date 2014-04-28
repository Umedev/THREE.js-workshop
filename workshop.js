var camera, scene, renderer;

init();
animate();

function init() {
	var container = document.createElement( 'div' );
	document.body.appendChild( container );

	// create camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 0, 0);
	camera.target = new THREE.Vector3(0, 0, -1);

	// create scene
	scene = new THREE.Scene();

	// create cube
	geometry = new THREE.CubeGeometry(1, 1, 1);
	material = new THREE.MeshBasicMaterial({color : '#f00'});
	cube = new THREE.Mesh(geometry, material);
	cube.position.x = 0;
	cube.position.y = 0;
	cube.position.z = -5;
	scene.add(cube);

	// create light
	var ambientLight = new THREE.AmbientLight(0x202020);
	scene.add(ambientLight);

	// create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xf0f0f0);
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
