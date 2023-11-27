import "./styles.css";

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {HexGrid} from './HexGrid.js';
import {HexCubeCoord,HexCoordList,CubeRing} from './HexCubeCoord.js';
import {Merge,TriangleList,DrawTriangle, Triangle} from './Triangle.js';
import { DrawQuad } from "./Quad.js";
import { SubQuad,DrawSubQuad,MapSubQuad4UI,Smooth,Map } from "./SubQuad.js";
import { smootherstep } from "three/src/math/MathUtils.js";
import { Vertex,MarchVertex } from "./Vertex.js";


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
export default scene;

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
const planeMesh = new THREE.Mesh(
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
var coordList=HexCoordList(4);
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
    scene.add( line );
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
button_FindNeighbor.addEventListener('click', function() {
    // 在这里编写按钮点击时要执行的 JavaScript 代码
    tri_list.forEach(element => {scene.remove(element);});
    qua_list.forEach(element => {scene.remove(element);});
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
            DrawSubQuad(isolated_triangle_list[j].squadlist[0],0x000022,scene,qua_list,false);
            DrawSubQuad(isolated_triangle_list[j].squadlist[1],0xff22ff,scene,qua_list,false);
            DrawSubQuad(isolated_triangle_list[j].squadlist[2],0x0022ff,scene,qua_list,false);
            
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
            DrawSubQuad(quad_list[j].squadlist[0],0xffc0cb,scene,qua_list,false);
            DrawSubQuad(quad_list[j].squadlist[1],0x71a5d0,scene,qua_list,false);
            DrawSubQuad(quad_list[j].squadlist[2],0xe4b7ff,scene,qua_list,false);
            DrawSubQuad(quad_list[j].squadlist[3],0xff9c70,scene,qua_list,false);

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
                    scene.add(CenterOfHex)
        console.log(vertex_List[4].subquadlist.length);
        DrawSubQuad(vertex_List[4].subquadlist[i],0xff0000,scene,qua_list);
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
    scene.clear();
    Smooth(AllVertexList,AllSquadList);
    console.log(AllVertexList.length);
    for(let i=0;i<AllSquadList.length;i++){
        DrawSubQuad(AllSquadList[i],0xffc0cb,scene,qua_list,true);
    }
});
const RandomSelect_btn = document.getElementById('RandomSelect');
RandomSelect_btn.addEventListener('click', function(){
    var StartIdx=Math.floor(Math.random() * AllVertexList.length);
    console.log(AllVertexList.length);
    var testVert=AllVertexList[StartIdx];
    console.log(testVert.subquadid_list);
    for(let i=0;i<testVert.subquadid_list.length;i++){
        DrawSubQuad(AllSquadList[testVert.subquadid_list[i]],0xffc0cb,scene,qua_list,false);
        var CenterOfHex = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            color: AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "vertex" ? 0x00ff00 : AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "middle" ? 0xff0000 : 0x0000ff
        }));
        CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].x,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].y,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].z);
        scene.add(CenterOfHex);

        CenterOfHex = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 4, 2),
            new THREE.MeshBasicMaterial({
                wireframe: false,
                color: AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "vertex" ? 0x00ff00 : AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "middle" ? 0xff0000 : 0x0000ff
            }));
        CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerBidx].x,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerBidx].y,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerBidx].z);
        scene.add(CenterOfHex);
        CenterOfHex = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 4, 2),
            new THREE.MeshBasicMaterial({
                wireframe: false,
                color: AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "middle" ? 0x00ff00 : AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerAidx].type == "vertex" ? 0xff0000 : 0x0000ff
            }));
        CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerCidx].x,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerCidx].y,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerCidx].z);
        scene.add(CenterOfHex);
        CenterOfHex = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 4, 2),
            new THREE.MeshBasicMaterial({
                wireframe: false,
                color: 0xAABBFF
            }));
        CenterOfHex.position.set(AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerDidx].x,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerDidx].y,
            AllVertexList[AllSquadList[testVert.subquadid_list[i]].VerDidx].z);
        scene.add(CenterOfHex);
    }
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
const AddLayer_btn = document.getElementById('Construct3D');
AddLayer_btn.addEventListener('click', function(){
    console.log("convert 2D to 3D");
    var layer=3;
    console.log(AllVertexList.length);
    for(let i=0;i<AllVertexList.length;i++){
        for(let j=0;j<layer;j++){
            AllMarchVertexList.push(new MarchVertex(AllVertexList[i].x,j,AllVertexList[i].z,AllVertexList[i].type,j,false));
        }
    }
    console.log(AllMarchVertexList.length);
    for(let i=0;i<AllMarchVertexList.length;i++){
        VisualizeMarchVertex(AllMarchVertexList[i],1);
    }
    // 创建物体
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
        for(let i=0;i<AllMarchVertexList.length;i++){
            var distance=Math.pow((TEST.position.x-AllMarchVertexList[i].x),2)+
            Math.pow((TEST.position.y-AllMarchVertexList[i].y),2)+
            Math.pow((TEST.position.z-AllMarchVertexList[i].z),2);
            console.log(distance)
            if(distance<2){
                AllMarchVertexList[i].IsActive=true;
                //VisualizeMarchVertex(AllMarchVertexList[i],1);
            }
        }
    });
});




//鼠标移动的时候闪烁的小方块
const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
    })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;


window.addEventListener('mousemove', function(e) {
    // ///改一下
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);//从相机到鼠标位置创建一条射线
    intersects = raycaster.intersectObject(planeMesh);//射线跟平面形成焦点
    if(intersects.length > 0) {//如果有焦点
        const intersect = intersects[0];
        //找到最近的vertex
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
        
        highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        const objectExist = objects.find(function(object) {
            return (object.position.x === highlightMesh.position.x)
            && (object.position.z === highlightMesh.position.z)
        });

        if(!objectExist)
            highlightMesh.material.color.setHex(0xFF00FF);//悬停时闪烁的光标颜色
        else
            highlightMesh.material.color.setHex(0xFF0000);
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
    const objectExist = objects.find(function(object) {
        return (object.position.x === highlightMesh.position.x)
        && (object.position.z === highlightMesh.position.z)
    });//检测这个位置是不是空的

    //创建一个新的plane
    //选中的位置占网格的小方块
    const newMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true
        })
    );
    newMesh.rotateX(-Math.PI / 2);
    newMesh.position.copy(highlightMesh.position);
    //根据点击的顺序给新生成的mesh生成不同颜色的plane
    if(clicks == 1) {
        newMesh.material.color.setHex(0x00FF00)
        clicks += 1
    } 
    else if(clicks == 2) {
        newMesh.material.color.setHex(0xFF0000)
        clicks += 1
    }
    else if(clicks == 3) {
        newMesh.material.color.setHex(0x0000FF)
        clicks += 1
    }
    scene.add(newMesh);

    let x = newMesh.position.x;
    let y = newMesh.position.y;
    let z = newMesh.position.z;
    //输出数据
    console.log('Current location: ' + x + ', ' + y + ', ' + z)

    //在选中的方格上放生成悬浮的object
    if(!objectExist) {
        if(intersects.length > 0) {
            const sphereClone = sphereMesh.clone();
            sphereClone.position.copy(highlightMesh.position);
            scene.add(sphereClone);
            objects.push(sphereClone);
            highlightMesh.material.color.setHex(0xFF0000);
            console.log("Item pushed @ " + sphereClone.position.x +", "+ sphereClone.position.y +", "+ sphereClone.position.z);
            console.log(objects)
            highlightMesh.material.color.setHex(0xFFFFFF);
        }
    } else {
        console.log("Item is here")
    }
    console.log(scene.children.length);
});
//小方块旋转动画
function animate(time) {
    highlightMesh.material.opacity = 1 + Math.sin(time / 120);
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

