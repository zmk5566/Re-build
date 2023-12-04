import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ReCore} from './ReCore.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import * as dat from 'dat.gui';

const stats = new Stats();
document.body.appendChild(stats.dom);


import {init_gui} from './MarchingCubeTest.js';

const gui = new dat.GUI();



const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// create and initialized the ReCore
var scene = new THREE.Scene();
var reCore = new ReCore(3,5,scene);

reCore.init();

var raycaster = new THREE.Raycaster();
// creates light and camera
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 30, 0);//camera位置

orbit.update();


function animate(time) {
    //stats.update(); 
    renderer.render(scene, camera);
    stats.update();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


window.addEventListener('mousemove', function(e) {
    // ///改一下
    var mousePosition = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    reCore.mouse_interact_with_area(mousePosition,camera,raycaster);
  
});

window.addEventListener('mousedown', function(e) {
    if (reCore.state == "marching_cube"){
        var mousePosition = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        var idx = reCore.mouse_interact_with_area(mousePosition,camera,raycaster);

    
        console.log("select vertex id :" ,idx);
        if (idx != -1){
            //the_hitted_logic(idx);
            reCore.process_hit_placement(idx)
        }}
    });


init_gui(gui,reCore.the_scene_object,reCore.debug_object);

reCore.process_gui(gui);