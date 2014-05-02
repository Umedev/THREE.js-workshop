var camera, scene, renderer, cubes;

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
	camera.lookAt(new THREE.Vector3(9,3,-5));

	// create scene
	scene = new THREE.Scene();

	// create cubes
	var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
	cubes = [];
	for (var i = 0; i < 8; i++) {
		cubes[i] = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial({color : '#2980b9'}));
		cubes[i].position.set(i*1.2,0.5,0);
		scene.add(cubes[i]);
	}
	
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
	if (!audio.paused) {
		var averages = getFrequencyAverages();

		// animate cubes using audio data
		for (var i = 0; i < 8; i++) {
			var scale = Math.max(0.01, averages[i]*5);
			cubes[i].scale.y = scale;
			cubes[i].position.y = scale / 2;
		}
	}

	renderer.render(scene, camera);
}
