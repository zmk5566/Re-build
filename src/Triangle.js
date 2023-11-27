import {HexCubeCoord,HexCoordList,CubeRing} from './HexCubeCoord.js';
import {Edge,IsEdgeExist} from './Edge.js';
import { SubQuad } from './SubQuad.js';
//import scene from './index.js';
import * as THREE from 'three';
import { Quad } from './Quad.js';
export class Triangle{
    squadlist=[];
    constructor(va,vb,vc){
        this.va=va;
        this.vb=vb;
        this.vc=vc;
        this.mid_ac=[(va[0]+vc[0])/2,(va[1]+vc[1])/2,(va[2]+vc[2])/2];
        this.mid_ab=[(va[0]+vb[0])/2,(va[1]+vb[1])/2,(va[2]+vb[2])/2];
        this.mid_bc=[(vb[0]+vc[0])/2,(vb[1]+vc[1])/2,(vb[2]+vc[2])/2];
        this.center=[(va[0]+vb[0]+vc[0])/3,(va[1]+vb[1]+vc[1])/3,(va[2]+vb[2]+vc[2])/3];
        var squad_a=new SubQuad(this.va,this.mid_ab,this.center,this.mid_ac);
        var squad_b=new SubQuad(this.vb,this.mid_bc,this.center,this.mid_ab);
        var squad_c=new SubQuad(this.vc,this.mid_ac,this.center,this.mid_bc);
        this.squadlist.push(squad_a);
        this.squadlist.push(squad_b);
        this.squadlist.push(squad_c);
    }
}
export function TriangleList(hexPan){
    //输入：所有的顶点
    //triangle1：一个内圈两个外圈
    //triangle2：两个内圈一个外圈
    var triangleList=[];
    for(let i=0;i<hexPan.length-1;i++){
        if(i==0){
            //只画triangle1
            for(let j=0;j<hexPan[i+1].length;j++){
                var center=new HexCubeCoord(0,0,0);
                var drawtri=new Triangle(
                    center.worldPosition,
                    hexPan[i+1][j].worldPosition,
                    hexPan[i+1][(j+1)%hexPan[i+1].length].worldPosition);
                triangleList.push(drawtri);
            }
        }
        else if(i>0){
            //内圈 hexPan[i]
            for(let j=0;j<hexPan[i+1].length;j++){
                var edge = Math.floor(j/(i+1));//判断这个点在哪一条边
                // console.log(i,j);
                //console.log(i,edge*i+j%(i+1));
                //triangle1
                var drawtri1=new Triangle(
                    hexPan[i][(edge*i+j%(i+1))%hexPan[i].length].worldPosition,
                    hexPan[i+1][j].worldPosition,
                    hexPan[i+1][(j+1)%hexPan[i+1].length].worldPosition);
                triangleList.push(drawtri1);
            }
            for(let k=0;k<hexPan[i].length;k++){
                //triangle2
                var edge = Math.floor(k/i);//判断这个点在哪一条边
                var drawtri2=new Triangle(
                    hexPan[i][k].worldPosition,
                    hexPan[i+1][k+edge+1].worldPosition,
                    hexPan[i][(k+1)%hexPan[i].length].worldPosition);
                triangleList.push(drawtri2);
            }
        }
    }
    return triangleList;
}

export function PanTriangleList(hexPan){

}
//find neighbor
//输入所有的三角形，随机选择一个三角形开始，遍历所有的三角形，找到和他只有两个共同点的三角形
//输出最开始选择的三角形以及所有的邻居
export function FindNeighbor(SelectTriangle,AllTriangles){
    //random 选一个作为开始
    //var StartIdx=3;
    var Neighbors=[];
    var NeighborsIdx=[];
    var mTriangle=SelectTriangle;//随机选择的三角形
    for(let i=0;i<AllTriangles.length;i++){
        //他其实是要储存这个neighbor的id的
        const set1=[JSON.stringify(mTriangle.va),JSON.stringify(mTriangle.vb),JSON.stringify(mTriangle.vc)];
        const set2=[JSON.stringify(AllTriangles[i].va),JSON.stringify(AllTriangles[i].vb),JSON.stringify(AllTriangles[i].vc)];
        var count=0;
        for(let j=0;j<set1.length;j++){
            if(set2.includes(set1[j])){
                count=count+1;
            }
        }
        if(count==2){
            //console.log(count);
            Neighbors.push(AllTriangles[i]);
            NeighborsIdx.push(i);
        }
    }
    return NeighborsIdx;
}

var test_set=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
export function Merge(AllTriangles,QuadList,leftTriangle){
    //console.log("MergeQuad");
    //console.log("",AllTriangles.length);
    var NeighborsIds=[];
    var StartIdx=Math.floor(Math.random() * AllTriangles.length);
    var SelectTriangle=AllTriangles[StartIdx];
    NeighborsIds=FindNeighbor(SelectTriangle,AllTriangles);
    //console.log("MergeQuad",NeighborsIds.length);
    while(NeighborsIds.length==0&&AllTriangles.length>0){
        //return null;
        //console.log("change to next");
        //如果现在选的这个没有邻居了,但是其他的可能还有邻居，遍历其他的
        leftTriangle.push(AllTriangles[StartIdx]);
        AllTriangles.splice(StartIdx,1);
        StartIdx=Math.floor(Math.random() * AllTriangles.length);
        SelectTriangle=AllTriangles[StartIdx];
        NeighborsIds=FindNeighbor(SelectTriangle,AllTriangles);
    }
    if(AllTriangles.length>1){
        var SelectNeigborId=Math.floor(Math.random() * NeighborsIds.length);
        //console.log("selection",StartIdx,"options",NeighborsIds,"neighbor",NeighborsIds[SelectNeigborId]);
        //console.log("options",SelectNeigborId,NeighborsIds[SelectNeigborId]);
        var SelectNeighborTriangle=AllTriangles[NeighborsIds[SelectNeigborId]];
        var MergedQuad=CreateQuad(SelectTriangle,SelectNeighborTriangle);
        QuadList.push(MergedQuad);
        //先删除大的，再删除小的
        if(StartIdx>NeighborsIds[SelectNeigborId]-1){
            AllTriangles.splice(StartIdx,1);
            AllTriangles.splice(NeighborsIds[SelectNeigborId],1);
            test_set.splice(StartIdx,1);
            test_set.splice(NeighborsIds[SelectNeigborId],1);
        }
        else{
            AllTriangles.splice(NeighborsIds[SelectNeigborId],1);
            AllTriangles.splice(StartIdx,1);
            test_set.splice(NeighborsIds[SelectNeigborId],1);
            test_set.splice(StartIdx,1);
        }
        //console.log(test_set);
        if(AllTriangles.length>0){Merge(AllTriangles,QuadList,leftTriangle);}}
}

function CreateQuad(tri1,tri2){
    // console.log("CreateQuad");
    var shared=[];
    var isolated=[];
    const vert1=[tri1.va,tri1.vb,tri1.vc];
    const vert2=[tri2.va,tri2.vb,tri2.vc];
    const set1=[JSON.stringify(tri1.va),JSON.stringify(tri1.vb),JSON.stringify(tri1.vc)];
    const set2=[JSON.stringify(tri2.va),JSON.stringify(tri2.vb),JSON.stringify(tri2.vc)];
    //console.log(set1,set2);

    while(set1.length>0){
        if(set2.includes(set1[0])){
            var idx2=set2.indexOf(set1[0]);
            shared.push(vert1[0]);
            vert1.splice(0,1);
            set1.splice(0,1);
            vert2.splice(idx2,1);
            set2.splice(idx2,1);
        }
        else{//如果没在另一个三角形里
            isolated.push(vert1[0]);
            vert1.splice(0,1);
            set1.splice(0,1);
        }
    }
    isolated.push(vert2[0]);
    //console.log(isolated[0],shared[0],isolated[1],shared[1]);
    var MergedQuad=new Quad(isolated[0],shared[0],isolated[1],shared[1]);
    return MergedQuad;
}

export function DrawTriangle(tri,col,scene,meshlist){
    console.log("DrawTriangle");
    const vertices = [
        tri.vc[0],tri.vc[1],tri.vc[2],   // 第一个顶点的坐标
        tri.vb[0],tri.vb[1],tri.vb[2],    // 第二个顶点的坐标
        tri.va[0],tri.va[1],tri.va[2]      // 第三个顶点的坐标
      ];
    // 创建缓冲区几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    // 创建材质和网格
    const material = new THREE.MeshBasicMaterial({ color: col });
    const mesh = new THREE.Mesh(geometry, material);
    meshlist.push(mesh);
    // 将网格添加到场景中
    scene.add(mesh);
}
