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
for(let i=0;i<coordList.length;i++){
    for(let j=0;j<coordList[i].length;j++)
    {
    }
}
// //single ring
// for(let i=0;i<ringSample.length;i++){
//     var CenterOfHex = new THREE.Mesh(
//     new THREE.SphereGeometry(0.4, 4, 2),
//     new THREE.MeshBasicMaterial({
//         wireframe: false,
//         color: 0xFF0A22
//     }));
//     var pos=Array(ringSample[i].worldPosition);
//     //console.log(pos[0][0],0,pos[2]);
//     CenterOfHex.position.set(pos[0][0],pos[0][1],pos[0][2]);
//     scene.add(CenterOfHex);
// }

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
}

//Step3
const button_FindNeighbor = document.getElementById('FindNeighbor');
var tri_list=[];
var qua_list=[];
var CenterList=[];
var vertex_List=[];
var MidList=[];
var quad_list=[];
var isolated_triangle_list=[];
var AllSquadList=[];
var AllVertexList=[];

//create a object to hold the find neighbor result
const FindNeighborResult = new THREE.Object3D();
scene.add(FindNeighborResult);

button_FindNeighbor.addEventListener('click', function() {
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
    
});
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

const Smooth_btn = document.getElementById('Smooth');
Smooth_btn.addEventListener('click', function(){
    // scene clear everything except the plane
    clearTheScene();

    Smooth(AllVertexList,AllSquadList);
    console.log(AllVertexList.length);
    for(let i=0;i<AllSquadList.length;i++){
        DrawSubQuad(AllSquadList[i],0xffc0cb,scene,qua_list,true);
    }
});


// create an empty 3d object to hold the vertex and subquad in the future
const the_scene_object = new THREE.Object3D();

function drawVertexbyIndex(idx,the_scene_object,color=0xffc0cb){

    var StartIdx=idx;
    //console.log(AllVertexList.length);
    var testVert=AllVertexList[StartIdx];
    //console.log(testVert.subquadid_list);
    for(let i=0;i<testVert.subquadid_list.length;i++){
        DrawSubQuad(AllSquadList[testVert.subquadid_list[i]],color,the_scene_object,qua_list,false);
        // var CenterOfHex = new THREE.Mesh(
        // new THREE.SphereGeometry(0.2, 4, 2),
        // new THREE.MeshBasicMaterial({
        //     wireframe: false,
        //     color: AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "vertex" ? 0x00ff00 : AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "middle" ? 0xff0000 : 0x0000ff
        // }));
        // CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].x,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].y,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].z);
        // the_scene_object.add(CenterOfHex);

        // CenterOfHex = new THREE.Mesh(
        //     new THREE.SphereGeometry(0.2, 4, 2),
        //     new THREE.MeshBasicMaterial({
        //         wireframe: false,
        //         color: AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "vertex" ? 0x00ff00 : AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "middle" ? 0xff0000 : 0x0000ff
        //     }));
        // CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerBidx].x,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerBidx].y,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerBidx].z);
        // the_scene_object.add(CenterOfHex);
        // CenterOfHex = new THREE.Mesh(
        //     new THREE.SphereGeometry(0.2, 4, 2),
        //     new THREE.MeshBasicMaterial({
        //         wireframe: false,
        //         color: AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "middle" ? 0x00ff00 : AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "vertex" ? 0xff0000 : 0x0000ff
        //     }));
        // CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerCidx].x,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerCidx].y,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerCidx].z);
        // the_scene_object.add(CenterOfHex);
        // CenterOfHex = new THREE.Mesh(
        //     new THREE.SphereGeometry(0.2, 4, 2),
        //     new THREE.MeshBasicMaterial({
        //         wireframe: false,
        //         color: 0xAABBFF
        //     }));
        // CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerDidx].x,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerDidx].y,
        //     AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerDidx].z);
        //     the_scene_object.add(CenterOfHex);
    }

    return the_scene_object;



}

const RandomSelect_btn = document.getElementById('RandomSelect');
RandomSelect_btn.addEventListener('click', function(){
    var StartIdx=Math.floor(Math.random()*AllVertexList.length);
    drawVertexbyIndex(StartIdx,the_scene_object);
    scene.add(the_scene_object);

}
);


function VisualizeMarchVertex(march_vertex,height){
    var CenterOfHex = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            color: march_vertex.IsActive == true ? 0x00ff00 : 0xff0000
        }));
        CenterOfHex.position.set(march_vertex.x,march_vertex.layer*height,march_vertex.z);
        scene.add(CenterOfHex);
}
var AllMarchVertexList=[];
var AllMarchCubeList=[];
const AddLayer_btn = document.getElementById('Construct3D');
AddLayer_btn.addEventListener('click', function(){
    console.log("convert 2D to 3D");
    var layer=3;//layer of vertex
    console.log(AllVertexList.length);
    CreateMarchVertex(AllVertexList,AllMarchVertexList,layer);
    CreateMarchCube(AllSquadList,AllMarchVertexList,AllMarchCubeList,layer-1);

    console.log(AllVertexList.length,AllMarchVertexList.length,AllMarchVertexList[0].length);
    console.log(AllSquadList.length,AllMarchCubeList.length,AllMarchCubeList[0].length);
    
    for(let i=0;i<AllMarchVertexList.length;i++){
        for(let j=0;j<AllMarchVertexList[i].length;j++){ 
            VisualizeMarchVertex(AllMarchVertexList[i][j],1);
        }
    }


    // 创建物体//GUI
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const TEST = new THREE.Mesh(geometry, material);
    scene.add(TEST);
    window.addEventListener('keydown', function(e) {
        const keyCode = e.keyCode;
        // 根据按键代码移动物体
        switch (keyCode) {
            case 65: // 左箭头
            TEST.position.x -= 0.3;
            break;
            case 69: // 上箭头
            TEST.position.y += 0.3;
            break;
            case 68: // 右箭头
            TEST.position.x += 0.3;
            break;
            case 81: // 下箭头
            TEST.position.y -= 0.3;
            break;
            case 87: // Page Up
            TEST.position.z -= 0.3;
            break;
            case 83: // Page Down
            TEST.position.z += 0.3;
            break;
            default:
            break;
        }
    });
    window.addEventListener('mousedown', function(e) {
        //TODO:点击鼠标选择一整个marchingcube，并激活对应的顶点
    });
});

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
const cursor_point= new THREE.Object3D();
scene.add(highlight_object);
scene.add(cursor_point);

var SelectCenter = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: false,
        color:  0x0000ff
    }));
scene.add(SelectCenter);
window.addEventListener('mousemove', function(e) {
    // ///改一下
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);//从相机到鼠标位置创建一条射线
    intersects = raycaster.intersectObject(planeMesh);//射线跟平面形成焦点
    if(intersects.length > 0) {//如果有焦点
        const intersect = intersects[0];
        //找到最近的vertex
        // clear the cursor point
        cursor_point.children.forEach(function(object) {
            cursor_point.remove(object);
        });

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
        sphere.position.copy(projected);
        cursor_point.add(sphere);

        if (AllVertexList.length>0){
            // clear the highlight object
            highlight_object.children.forEach(function(object) {
                highlight_object.remove(object);
            });
            var result=GetNearestVertex(projected.x,0,projected.z,AllVertexList);
           
            SelectCenter.position.set(AllVertexList[result].x,AllVertexList[result].y,AllVertexList[result].z);
            // get a orange color
            drawVertexbyIndex(result,highlight_object,0xffff00);

            //console.log(SelectCenter.position,projected);
        }

    }
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


//监听鼠标点击
window.addEventListener('mousedown', function() {
    // mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    // mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    // // raycaster.setFromCamera(mousePosition, camera);//从相机到鼠标位置创建一条射线
    // // intersects = raycaster.intersectObject(planeMesh);//射线跟平面形成焦点


    // // const objectExist = objects.find(function(object) {
    // //     return (object.position.x === highlightMesh.position.x)
    // //     && (object.position.z === highlightMesh.position.z)
    // // });//检测这个位置是不是空的

    // //创建一个新的plane
    // //选中的位置占网格的小方块
    // const newMesh = new THREE.Mesh(
    //     new THREE.PlaneGeometry(1, 1),
    //     new THREE.MeshBasicMaterial({
    //         side: THREE.DoubleSide,
    //         transparent: true
    //     })
    // );
    // newMesh.rotateX(-Math.PI / 2);
    // newMesh.position.copy(highlightMesh.position);
    // //根据点击的顺序给新生成的mesh生成不同颜色的plane
    // if(clicks == 1) {
    //     newMesh.material.color.setHex(0x00FF00)
    //     clicks += 1
    // } 
    // else if(clicks == 2) {
    //     newMesh.material.color.setHex(0xFF0000)
    //     clicks += 1
    // }
    // else if(clicks == 3) {
    //     newMesh.material.color.setHex(0x0000FF)
    //     clicks += 1
    // }
    // scene.add(newMesh);

    // let x = newMesh.position.x;
    // let y = newMesh.position.y;
    // let z = newMesh.position.z;
    // //输出数据
    // console.log('Current location: ' + x + ', ' + y + ', ' + z)

    // //在选中的方格上放生成悬浮的object
    // if(!objectExist) {
    //     if(intersects.length > 0) {
    //         const sphereClone = sphereMesh.clone();
    //         sphereClone.position.copy(highlightMesh.position);
    //         scene.add(sphereClone);
    //         objects.push(sphereClone);
    //         highlightMesh.material.color.setHex(0xFF0000);
    //         console.log("Item pushed @ " + sphereClone.position.x +", "+ sphereClone.position.y +", "+ sphereClone.position.z);
    //         console.log(objects)
    //         highlightMesh.material.color.setHex(0xFFFFFF);
    //     }
    // } else {
    //     console.log("Item is here")
    // }
    // console.log(scene.children.length);
});
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
    return result,idx;//这个顶点和他的id
}
