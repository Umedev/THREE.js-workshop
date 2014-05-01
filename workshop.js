var camera, scene, renderer, analyser, frequencyData, audio;

window.onload = function() {
	initAudio();
	initRenderer();
	animate();
};

function initAudio() {
	var ctx;
	try {
		ctx = new AudioContext();
	} catch(e) {
		ctx = new webkitAudioContext();
	}
	
	audio = document.getElementsByTagName('audio').item(0);
	var audioSrc = ctx.createMediaElementSource(audio);
	analyser = ctx.createAnalyser();
	// we have to connect the MediaElementSource with the analyser 
	audioSrc.connect(analyser);
	// frequencyBinCount tells you how many values you'll receive from the analyser
	frequencyData = new Uint8Array(analyser.frequencyBinCount);
}

function initRenderer() {
	var container = document.createElement( 'div' );
	document.body.appendChild( container );

	// create camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(2, 0, 5);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(0,0,0));

	// create scene
	scene = new THREE.Scene();

	// create cube
	geometry = new THREE.CubeGeometry(1, 1, 1);
	material = new THREE.MeshBasicMaterial({color : '#f00'});
	cube = new THREE.Mesh(geometry, material);
	cube.position.set(0,0,0);
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
	if (!audio.paused) {
		// update data in frequencyData
		analyser.getByteFrequencyData(frequencyData);

		// TODO update cube transformations
	}

	renderer.render(scene, camera);
}
