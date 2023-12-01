import "./styles.css";

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {HexGrid} from './HexGrid.js';
import {Merge,TriangleList,DrawTriangle, Triangle} from './Triangle.js';
import { SubQuad,DrawSubQuad,MapSubQuad4UI,Smooth,Map,CreateMarchCube } from "./SubQuad.js";
import { Vertex,MarchVertex,CreateMarchVertex } from "./Vertex.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// import library ready for ajax call, axio

//create a state machine to maintain the state of the program
const states = ["idle", "finding_neibour","smoothing","selection","marching_cube"]

var state = "idle";

var layer=7;//layer of vertex


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//TODO:创建六边形点阵地图
var number_of_extension = 2;

const scene = new THREE.Scene();
//export default scene;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 30, 0);//camera位置

orbit.update();


//Stage1：找到每个六边形的中心点，在这个位置创建一个球，并显示出来
var center=new HexCubeCoord(0,0,0);
var coordList=HexCoordList(number_of_extension);
var ringSample=CubeRing(center,number_of_extension);
//饼：在每一个重点创建一个cube


//Step2:Draw Triangle
var triangle_list=TriangleList(coordList);//所有的三角形
//console.log(triangle_list.length);
// create a object to hold the triangle
const triangle_object = new THREE.Object3D();
scene.add(triangle_object);
//创建三角形地图grid
for(let i=0;i<triangle_list.length;i++){
    const points=[];
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    //console.log(triangle_list[i].vb[2]);
    points.push(new THREE.Vector3(triangle_list[i].va[0],triangle_list[i].va[1],triangle_list[i].va[2]));
    points.push(new THREE.Vector3(triangle_list[i].vb[0],triangle_list[i].vb[1],triangle_list[i].vb[2]));
    points.push(new THREE.Vector3(triangle_list[i].vc[0],triangle_list[i].vc[1],triangle_list[i].vc[2]));
    points.push(new THREE.Vector3(triangle_list[i].va[0],triangle_list[i].va[1],triangle_list[i].va[2]));
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, material );
    triangle_object.add( line );
}

function clearTheScene(){
    triangle_object.clear();
    FindNeighborResult.clear();
    smooth_object.clear();
}

//Step3
//const button_FindNeighbor = document.getElementById('FindNeighbor');

var qua_list=[];
var AllSquadList=[];
var AllVertexList=[];
var VertexSelection=-1;

//create a object to hold the find neighbor result
const FindNeighborResult = new THREE.Object3D();
scene.add(FindNeighborResult);

//create a 3d  object to hold
const mesh_hold_object = new THREE.Object3D();
scene.add(mesh_hold_object);

// smooth the mesh
// create a object to hold the smoothsquad visualization
const smooth_object = new THREE.Object3D();
scene.add(smooth_object);

var model_list=[];
const loader=new OBJLoader();
// create a mouse click event listener
window.addEventListener('mousedown', function(e) {
    console.log("mouse down");

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (state == "marching_cube"){
    var idx = mouseTriggerBase();

    console.log("select vertex id :" ,idx);
    if (idx != -1){
        //the_hitted_logic(idx);
        process_the_hitted_logic(idx)
    }
    }

} );



function process_the_hitted_logic(idx) {




    var CenterVert=AllMarchVertexList[ConstructLayer][VertexSelection];
    console.log(ConstructLayer);
    for(let i=0;i<CenterVert.subquadid_list.length;i++){
        var vertid=CenterVert.subquadid_list[i];
        console.log("construction layer",ConstructLayer);
        console.log("marching cube length",AllMarchCubeList[ConstructLayer].length);
        var CurrentCube=AllMarchCubeList[ConstructLayer][vertid];
        var bit1="";
        var bit2="";

    }

}





// create a layer to hold the selected vertex
const SelectedVertex_object = new THREE.Object3D();
scene.add(SelectedVertex_object);










const AddLoadModel = document.getElementById('talk_to_gpt');
AddLoadModel.addEventListener('click',function(){

    //load obj here 
    const loader = new OBJLoader();
    var input_pt1 = document.getElementById("MeshId_pt1");

    get_new_city(input_pt1.value);

    document.getElementById("status").innerHTML="Loading";

    document.getElementById("answer").innerHTML=input_pt1.value;


});


//鼠标移动的时候闪烁的小方块

// highlightMesh.rotateX(-Math.PI / 2);
// highlightMesh.position.set(0.5, 0, 0.5);
// scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
let intersects;

// create a 3d object for highlight
const highlight_object = new THREE.Object3D();
scene.add(highlight_object);

var SelectCenter = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.1),
    new THREE.MeshBasicMaterial({
        wireframe: false,
        color:  0x0000ff
    }));
scene.add(SelectCenter);


function mouseTriggerBase(mousePosition){

    var selected_area=-1;

    raycaster.setFromCamera(mousePosition, camera);//从相机到鼠标位置创建一条射线
    intersects = raycaster.intersectObject(planeMesh);//射线跟平面形成焦点
    if(intersects.length > 0) {//如果有焦点
        const intersect = intersects[0];

        var projected=new THREE.Vector3(0,0,0)
        projected.x=intersect.point.x;
        projected.y=0;
        projected.z=intersect.point.z;

        if (AllVertexList.length>0){
            // clear the highlight object
            highlight_object.clear();
            selected_area=GetNearestVertex(projected.x,0,projected.z,AllVertexList);

            if (selected_area != -1){
           
            SelectCenter.position.set(AllVertexList[selected_area].x,AllVertexList[selected_area].y,AllVertexList[VertexSelection].z);
            
            // get a orange color
            drawVertexbyIndex(VertexSelection,highlight_object,0xffff00);
            }
        }

    }

    return VertexSelection;
}

window.addEventListener('mousemove', function(e) {
    // ///改一下
    var mousePosition = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    mouseTriggerBase(mousePosition);
});

const objects = [];
let clicks = 1


//小方块旋转动画
function animate(time) {
    objects.forEach(function(object) {
        object.rotation.x = time / 1000;
        object.rotation.z = time / 1000;
        object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
    });
    //stats.update(); 
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// input 3d x,y,z return the nearest vertex from AllVertexList
function GetNearestVertex(x,y,z,currentVertList){
    var distance=10000;
    var result;
    var idx;
    for(let i=0;i<currentVertList.length;i++){
        var temp=Math.pow((x-currentVertList[i].x),2)+Math.pow((y-currentVertList[i].y),2)+Math.pow((z-currentVertList[i].z),2);
        if(temp<distance){
            distance=temp;
            result=currentVertList[i];
            idx=i;
        }
    }
    // console.log("distance",distance);
    if (distance>0.8){
        idx = -1;
    }
    return result,idx;//这个顶点和他的id
}



function scene_intialization(){
    findNeighbor();
    smooth_hex_vertexes_positions();
    covert2Dto3D();
}

scene_intialization();