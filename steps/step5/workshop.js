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
	var cubeGeometry = new THREE.CubeGeometry(1, 1, 0.2);
	cubes = [];
	for (var i = 0; i < TIME_FRAME; i++) {
		cubes[i] = [];
		for (var j = 0; j < SEGMENT_COUNT; j++) {
			cubes[i][j] = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial({color : '#2980b9'}));
			cubes[i][j].position.set(j*1.2,0.5,-0.2*i);
			scene.add(cubes[i][j]);
		}
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
		updateFrequencyAverages();

		// animate cubes using audio data
		for (var i = 0; i < TIME_FRAME; i++) {
			for (var j = 0; j < SEGMENT_COUNT; j++) {
				var scale = Math.max(0.01, averages[i][j]*5);
				cubes[i][j].scale.y = scale;
				cubes[i][j].position.y = scale / 2;
			}
		}
	}

	renderer.render(scene, camera);
}