import "./styles.css";

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {HexGrid} from './HexGrid.js';
import {HexCubeCoord,HexCoordList,CubeRing} from './HexCubeCoord.js';
import {Merge,TriangleList,DrawTriangle, Triangle} from './Triangle.js';
import { DrawQuad } from "./Quad.js";
import { SubQuad,DrawSubQuad,MapSubQuad4UI,Smooth,Map,CreateMarchCube } from "./SubQuad.js";
import { smootherstep } from "three/src/math/MathUtils.js";
import { Vertex,MarchVertex,CreateMarchVertex } from "./Vertex.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

//import the gui
import * as dat from 'dat.gui';
const gui = new dat.GUI();

//create a folder for the Display
const display_folder = gui.addFolder('Display');

//set the gui to the front

gui.domElement.style.zIndex = 10000;

//create a state machine to maintain the state of the program
const states = ["idle", "finding_neibour","smoothing","selection","marching_cube"]

var state = "idle";

var layer=3;//layer of vertex


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
export default scene;

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

//整个map上的grid//其实就是一整块
var planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false
    })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);


//TODO:创建六边形点阵地图
//Stage1：找到每个六边形的中心点，在这个位置创建一个球，并显示出来
var center=new HexCubeCoord(0,0,0);
var coordList=HexCoordList(2);
var ringSample=CubeRing(center,2);
//饼：在每一个重点创建一个cube


//Step2:Draw Triangle
var triangle_list=TriangleList(coordList);//所有的三角形
//console.log(triangle_list.length);
// create a object to hold the triangle
const triangle_object = new THREE.Object3D();
scene.add(triangle_object);
//创建三角形地图grid
var LineList=[];
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
    LineList.push(line);
    triangle_object.add( line );
}

function clearTheScene(){
    triangle_object.clear();
    FindNeighborResult.clear();
    smooth_object.clear();
}

//Step3
//const button_FindNeighbor = document.getElementById('FindNeighbor');
var tri_list=[];
var qua_list=[];
var CenterList=[];
var vertex_List=[];
var MidList=[];
var quad_list=[];
var isolated_triangle_list=[];
var AllSquadList=[];
var AllVertexList=[];
var VertexSelection=-1;

//create a object to hold the find neighbor result
const FindNeighborResult = new THREE.Object3D();
scene.add(FindNeighborResult);



function findNeighbor(){

    state = "finding_neibour";
    // 在这里编写按钮点击时要执行的 JavaScript 代码
    clearTheScene();
    //tri_list.forEach(element => {scene.remove(element);});
    //qua_list.forEach(element => {scene.remove(element);});
    var triangle_list=TriangleList(coordList);
    console.log("Number of Triangles before merge",triangle_list.length);
    Merge(triangle_list,quad_list,isolated_triangle_list);
    console.log("Number of Quads created",quad_list.length);
    console.log("Number of Triangles Left",isolated_triangle_list.length);
    //DrawTriangle(test[0],0x0000ff,scene,tri_list);//随机选取的三角形
    //console.log(triangle_list.length);
    if(isolated_triangle_list.length>0){
        //DrawSubQuad(isolated_triangle_list[0].squadlist[0],0xff0000,scene,tri_list);
        for(let j=0;j<isolated_triangle_list.length;j++){
            //DrawTriangle(isolated_triangle_list[j],0xff0000,scene,tri_list);
            DrawSubQuad(isolated_triangle_list[j].squadlist[0],0x000022,FindNeighborResult,qua_list,false);
            DrawSubQuad(isolated_triangle_list[j].squadlist[1],0xff22ff,FindNeighborResult,qua_list,false);
            DrawSubQuad(isolated_triangle_list[j].squadlist[2],0x0022ff,FindNeighborResult,qua_list,false);
            
            AllSquadList.push(isolated_triangle_list[j].squadlist[0]);
            AllSquadList.push(isolated_triangle_list[j].squadlist[1]);
            AllSquadList.push(isolated_triangle_list[j].squadlist[2]);
        }
    }
    
    //DrawQuad(quad_list[0],0x00ff00,scene,qua_list);
    if(quad_list.length>0){
        for(let j=0;j<quad_list.length;j++){
            var color=0x00ff00+j*(0x0000ff)/quad_list.length;
            //DrawQuad(quad_list[j],color,scene,qua_list);}
            DrawSubQuad(quad_list[j].squadlist[0],0xffc0cb,FindNeighborResult,qua_list,false);
            DrawSubQuad(quad_list[j].squadlist[1],0x71a5d0,FindNeighborResult,qua_list,false);
            DrawSubQuad(quad_list[j].squadlist[2],0xe4b7ff,FindNeighborResult,qua_list,false);
            DrawSubQuad(quad_list[j].squadlist[3],0xff9c70,FindNeighborResult,qua_list,false);

            //add to squadlist
            AllSquadList.push(quad_list[j].squadlist[0]);
            AllSquadList.push(quad_list[j].squadlist[1]);
            AllSquadList.push(quad_list[j].squadlist[2]);
            AllSquadList.push(quad_list[j].squadlist[3]);
        }
    }
    //按照顶点分类网格
    MapSubQuad4UI(isolated_triangle_list,quad_list,vertex_List,MidList,CenterList);
    for(let i=0;i<vertex_List[4].subquadlist.length;i++){
        var CenterOfHex = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 4, 2),
                    new THREE.MeshBasicMaterial({
                        wireframe: false,
                        color: 0xAABBFF
                    }));
                    CenterOfHex.position.set(vertex_List[4].x,vertex_List[4].y,vertex_List[4].z);
                    FindNeighborResult.add(CenterOfHex)
        console.log(vertex_List[4].subquadlist.length);
        DrawSubQuad(vertex_List[4].subquadlist[i],0xff0000,FindNeighborResult,qua_list);
    }
    //测试定点分类
    var AllVertexMesh=[];
    //drawVertexByType(CenterList,MidList,vertex_List,AllVertexMesh);
    AllVertexList=CenterList.concat(MidList).concat(vertex_List);
    Map(AllVertexList,AllSquadList);

}



// create a mouse click event listener
window.addEventListener('mousedown', function(e) {
    console.log("mouse down");

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (state == "marching_cube"){
    var idx = mouseTriggerBase();
    console.log("select vertex id :" ,idx);
    if (idx != -1){
        drawVertexbyIndex(idx,the_scene_object,0xadd8e6);
        SelectedVertex_object.add(the_scene_object);
800080
        
        var ConstructLayer=0;
        //AllMarchVertexList[0][VertexSelection].IsActive=true;
        if(AllMarchVertexList[0][VertexSelection].IsActive==false){
            //说明这地方还没建东西
            ConstructLayer=0;
        }
        else{
            for(let i=1;i<layer-1;i++){
                if(AllMarchVertexList[i][VertexSelection].IsActive==true&&
                AllMarchVertexList[i+1][VertexSelection].IsActive==false){
                    AllMarchVertexList[i][VertexSelection].IsActive=true;
                    ConstructLayer=i;
                    break;
                }

            }
        }

        var CenterVert=AllMarchVertexList[ConstructLayer][VertexSelection];
        console.log(ConstructLayer);
        for(let i=0;i<CenterVert.subquadid_list.length;i++){
            var vertid=CenterVert.subquadid_list[i];
            console.log(ConstructLayer);
            console.log(AllMarchCubeList[ConstructLayer].length);
            var CurrentCube=AllMarchCubeList[ConstructLayer][vertid];
            for(let j=0;j<4;j++){
                if(CurrentCube.MarchVertList_Bottom[j].IsActive==false){
                    CurrentCube.MarchVertList_Bottom[j].IsActive=true;
                    VisualizeMarchVertex(CurrentCube.MarchVertList_Bottom[j],1);
                }
                if(CurrentCube.MarchVertList_Top[j].IsActive==false){
                    CurrentCube.MarchVertList_Top[j].IsActive=true;
                    VisualizeMarchVertex(CurrentCube.MarchVertList_Top[j],1);
                }
            }
        }



    }
    }


} );

function drawVertexByType(CenterList,MidList,vertex_List,result){

    result.forEach(element => {scene.remove(element);});
    result.length=0;
    for(let i=0;i<CenterList.length;i++){
        var CenterOfHex = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            color: 0xAABBFF
        }));
        CenterOfHex.position.set(CenterList[i].x,CenterList[i].y,CenterList[i].z);
        result.push(CenterOfHex);
        scene.add(CenterOfHex);
    }
    for(let i=0;i<MidList.length;i++){
        var CenterOfHex = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            color: 0xAABB00
        }));
        CenterOfHex.position.set(MidList[i].x,MidList[i].y,MidList[i].z);
        result.push(CenterOfHex);
        scene.add(CenterOfHex);
    }
    for(let i=0;i<vertex_List.length;i++){
        var CenterOfHex = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            color: 0x0000FF
        }));
        CenterOfHex.position.set(vertex_List[i].x,vertex_List[i].y,vertex_List[i].z);
        result.push(CenterOfHex);
        scene.add(CenterOfHex);
    }
}


// smooth the mesh
// create a object to hold the smoothsquad visualization
const smooth_object = new THREE.Object3D();
scene.add(smooth_object);

function Smooth_it_Out(){

        state = "smoothing";

        // scene clear everything except the plane
        clearTheScene();

        Smooth(AllVertexList,AllSquadList);
        console.log(AllVertexList.length);
        for(let i=0;i<AllSquadList.length;i++){
            DrawSubQuad(AllSquadList[i],0xffc0cb,smooth_object,qua_list,true);
        }

}


// create an empty 3d object to hold the vertex and subquad in the future
const the_scene_object = new THREE.Object3D();

function drawVertexbyIndex(idx,the_scene_object,color=0xffc0cb){

    var StartIdx=idx;
    //console.log(AllVertexList.length);
    var testVert=AllVertexList[StartIdx];
    //console.log(testVert.subquadid_list);
    for(let i=0;i<testVert.subquadid_list.length;i++){
        DrawSubQuad(AllSquadList[testVert.subquadid_list[i]],color,the_scene_object,qua_list,false);
    }

    return the_scene_object;
}

// create a layer to hold the selected vertex
const SelectedVertex_object = new THREE.Object3D();
scene.add(SelectedVertex_object);





function VisualizeMarchVertex(march_vertex,height){
    var CenterOfHex = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            color: march_vertex.IsActive == true ? 0xff10f0 : 0xff0000
        }));
        CenterOfHex.position.set(march_vertex.x,march_vertex.layer*height,march_vertex.z);
        MarchVertex_object.add(CenterOfHex);
}
var AllMarchVertexList=[];
var AllMarchCubeList=[];
//const AddLayer_btn = document.getElementById('Construct3D');

// create a object to hold marching vertexes
const MarchVertex_object = new THREE.Object3D();
scene.add(MarchVertex_object);

function covert2Dto3D(){

    console.log("convert 2D to 3D");
    state = "marching_cube";
    console.log(AllVertexList.length);
    CreateMarchVertex(AllVertexList,AllMarchVertexList,layer);
    CreateMarchCube(AllSquadList,AllMarchVertexList,AllMarchCubeList,layer-1);
}


const AddLoadModel = document.getElementById('LoadModel');
AddLoadModel.addEventListener('click',function(){

    //load obj here 
    const loader = new OBJLoader();
    var input_pt1 = document.getElementById("MeshId_pt1");
    var input_pt2 = document.getElementById("MeshId_pt2");
    var path='/models/'+input_pt1.value+' '+input_pt2.value+'.obj';
    console.log(path);
    loader.load(
        // resource URL
        path,
        // called when resource is loaded
        function ( object ) {
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
            object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
            });
            scene.add( object );

        },
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );

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
    new THREE.SphereGeometry(0.2, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: false,
        color:  0x0000ff
    }));
scene.add(SelectCenter);


function mouseTriggerBase(){
    raycaster.setFromCamera(mousePosition, camera);//从相机到鼠标位置创建一条射线
    intersects = raycaster.intersectObject(planeMesh);//射线跟平面形成焦点
    if(intersects.length > 0) {//如果有焦点
        const intersect = intersects[0];

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 4, 2),
            new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0x00FF00
            })
        );
        var projected=new THREE.Vector3(0,0,0)
        projected.x=intersect.point.x;
        projected.y=0;
        projected.z=intersect.point.z;

        var result;
        if (AllVertexList.length>0){
            // clear the highlight object
            highlight_object.children.forEach(function(object) {
                highlight_object.remove(object);
            });
            VertexSelection=GetNearestVertex(projected.x,0,projected.z,AllVertexList);

            if (VertexSelection != -1){
           
            SelectCenter.position.set(AllVertexList[VertexSelection].x,AllVertexList[VertexSelection].y,AllVertexList[VertexSelection].z);
            
            // get a orange color
            drawVertexbyIndex(VertexSelection,highlight_object,0xffff00);
            }
        }

    }

    return VertexSelection;
}

window.addEventListener('mousemove', function(e) {
    // ///改一下

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseTriggerBase();

    
  
});

const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xFFEA00
    })
);//点击选择后漂浮在选中plane上方的旋转小方块

const objects = [];
let clicks = 1


//小方块旋转动画
function animate(time) {
    objects.forEach(function(object) {
        object.rotation.x = time / 1000;
        object.rotation.z = time / 1000;
        object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
    });
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
    //console.log("distance",distance);
    if (distance>0.5){
        idx = -1;
    }
    return result,idx;//这个顶点和他的id
}


// add gui buttons new folder
const button_folder = gui.addFolder('Buttons');

// add one button
const button = {
    findNeighbor: function() {
        findNeighbor();
    }
};

// add the button to the folder
button_folder.add(button, 'findNeighbor').name('Find Neighbor');

// add another button smooth

const button_smooth = {
    smooth: function() {
        Smooth_it_Out();
    }
};

button_folder.add(button_smooth, 'smooth').name('Smooth');

// add 2d to 3d button
const button_2d_to_3d = {
    convert: function() {
        covert2Dto3D();
    }
};



button_folder.add(button_2d_to_3d, 'convert').name('2D to 3D');

button_folder.open();

// add gui check boxes for the display
display_folder.add(SelectedVertex_object, 'visible').name('SelectedVertex_object');
display_folder.add(highlight_object, 'visible').name('highlight_object');
display_folder.add(MarchVertex_object, 'visible').name('MarchVertex_object');


