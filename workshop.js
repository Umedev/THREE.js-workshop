var camera, scene, renderer, analyser, audioData, audio;

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

	analyser = ctx.createAnalyser();
	audio = document.getElementsByTagName('audio').item(0);
	var audioSrc = ctx.createMediaElementSource(audio);
	// we have to connect the MediaElementSource with the analyser 
	audioSrc.connect(analyser);
	analyser.connect(ctx.destination);

	// we only need one value at this point, the minimum size allowed for fftSize is 32
	analyser.fftSize = 32;
	analyser.smoothingTimeConstant = 0.1;

	// the amplitude of the audio will be saved into this variable each frame
	audioData = new Uint8Array(analyser.frequencyBinCount);
}

function getAverageFrequency() {

	
	analyser.getByteFrequencyData(audioData);

	//get average level
	var sum = 0;
	for(var j = 0; j < audioData.length; ++j) {
		sum += audioData[j];
	}

	return (sum / audioData.length) / 256;
}

function initRenderer() {
	var container = document.createElement( 'div' );
	document.body.appendChild( container );

	// create camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(10, 2, 5);
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

		// animate cube using audio data
		cube.scale.y = getAverageFrequency();
		cube.position.y = cube.scale.y / 2;
	}

	renderer.render(scene, camera);
}
