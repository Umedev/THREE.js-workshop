var camera, scene, renderer, analyser, audioData, audio, cubes;

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

function getFrequencyAverages() {

	analyser.getByteFrequencyData(audioData);


	var averages = [];

	for (var i = 0; i < 8; i++) {
		averages[i] = 0;
		for(var j = i*2; j < (i+1)*2; j++) {
			averages[i] += audioData[j];
		}
		averages[i] = (averages[i] / 2) / 256;
	};
	
	return averages;
}

function initRenderer() {
	var container = document.createElement( 'div' );
	document.body.appendChild( container );

	// create camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(16, 4, 10);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(8,0,0));

	// create scene
	scene = new THREE.Scene();

	//create a floor
	var planeGeometry = new THREE.PlaneGeometry(100,100)
	var cubeMaterial = new THREE.MeshPhongMaterial({color : '#f1f1f1'});
	var plane = new THREE.Mesh(planeGeometry, cubeMaterial);
	plane.position.set(0,0,0);
	plane.rotation.x = -Math.PI/2;
	plane.receiveShadow = true;
	scene.add(plane)

	// create cube
	var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
	var cubeMaterial = new THREE.MeshPhongMaterial({color : '#2980b9'});
	cubes = [];
	for (var i = 0; i < 8; i++) {
		cubes[i] = new THREE.Mesh(cubeGeometry, cubeMaterial);

		cubes[i].position.set(i*2,0,0);
		cubes[i].castShadow = true;
		cubes[i].receiveShadow = true;

		scene.add(cubes[i]);
	};
	
	// add some ambient light
	scene.add(new THREE.AmbientLight(0x444444));

	// create light looking at the middle cube
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(16, 2, 10);
	light.target.position = new THREE.Vector3(8,0,0)
	light.shadowCameraNear = 1;
	light.shadowCameraFar = 1000;
	light.shadowCameraVisible = true
	light.castShadow = true;
	light.shadowDarkness = 0.5;
	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 1024;
	light.shadowCameraLeft = -10; // or whatever value works for the scale of your scene
	light.shadowCameraRight = 10;
	light.shadowCameraTop = 10;
	light.shadowCameraBottom = -10;
	scene.add(light);

	// create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = false;

	// add canvas to dom
	container.appendChild(renderer.domElement);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	if (!audio.paused) {

		// animate cubes using audio data
		var averages = getFrequencyAverages();
		for (var i = 0; i < cubes.length; i++) {
			cubes[i].scale.y = Math.max(0.1, averages[i]);
			cubes[i].position.y = cubes[i].scale.y / 2;
		}
		
	}

	renderer.render(scene, camera);
}
