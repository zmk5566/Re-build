import * as THREE from 'three';
import { SubQuad } from './SubQuad.js';
export class Quad{
    squadlist=[];
    constructor(va,vb,vc,vd){
        this.va=va;
        this.vb=vb;
        this.vc=vc;
        this.vd=vd;
        this.mid_cd=[(vd[0]+vc[0])/2,(vd[1]+vc[1])/2,(vd[2]+vc[2])/2];
        this.mid_bc=[(vb[0]+vc[0])/2,(vb[1]+vc[1])/2,(vb[2]+vc[2])/2];
        this.mid_ab=[(va[0]+vb[0])/2,(va[1]+vb[1])/2,(va[2]+vb[2])/2];
        this.mid_ad=[(va[0]+vd[0])/2,(va[1]+vd[1])/2,(va[2]+vd[2])/2];
        this.center=[(this.mid_ab[0]+this.mid_cd[0])/2,(this.mid_ab[1]+this.mid_cd[1])/2,(this.mid_ab[2]+this.mid_cd[2])/2];
        var squad_a=new SubQuad(this.va,this.mid_ab,this.center,this.mid_ad);
        var squad_b=new SubQuad(this.vb,this.mid_bc,this.center,this.mid_ab);
        var squad_c=new SubQuad(this.vc,this.mid_cd,this.center,this.mid_bc);
        var squad_d=new SubQuad(this.vd,this.mid_ad,this.center,this.mid_cd);
        this.squadlist.push(squad_a);
        this.squadlist.push(squad_b);
        this.squadlist.push(squad_c);
        this.squadlist.push(squad_d);
    }
}
export function DrawQuad(quad,col,scene,meshlist){
    console.log("drawquad");
    const vertices = [
        quad.vd[0],quad.vd[1],quad.vd[2],
        quad.vc[0],quad.vc[1],quad.vc[2],   // 第一个顶点的坐标
        quad.vb[0],quad.vb[1],quad.vb[2],  // 第二个顶点的坐标
        quad.va[0],quad.va[1],quad.va[2]      // 第三个顶点的坐标
      ];
    // console.log(vertices);

    const SharedEdge=new THREE.Vector3(quad.vd[0]-quad.vb[0],quad.vd[1]-quad.vb[1],quad.vd[2]-quad.vb[2]);
    // console.log(SharedEdge);
    const CheckEdge1=new THREE.Vector3(quad.vd[0]-quad.va[0],quad.vd[1]-quad.va[1],quad.vd[2]-quad.va[2]);
    const CheckNormal1=new THREE.Vector3();
    CheckNormal1.crossVectors(CheckEdge1,SharedEdge).normalize();
    const CheckEdge2=new THREE.Vector3(quad.vd[0]-quad.vc[0],quad.vd[1]-quad.vc[1],quad.vd[2]-quad.vc[2]);
    const CheckNormal2=new THREE.Vector3();
    CheckNormal2.crossVectors(CheckEdge2,SharedEdge).normalize();
    //console.log(CheckNormal2);
    const targetNormal=new THREE.Vector3(0,1,0);//期望的法线方向
    
    //console.log(CheckNormal1.dot(targetNormal),CheckNormal2.dot(targetNormal));
    var indices_pt1=[0, 3, 1];
    if(CheckNormal1.dot(targetNormal)<0){indices_pt1=[0, 1, 3];}
    var indices_pt2=[1, 2, 3];
    if(CheckNormal2.dot(targetNormal)<0){indices_pt2=[3, 2, 1];}
    const indices = indices_pt1.concat(indices_pt2);
    // 创建缓冲区几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    // 创建材质和网格
    const material = new THREE.MeshBasicMaterial({ color: col });
    const mesh = new THREE.Mesh(geometry, material);
    meshlist.push(mesh);
    // 将网格添加到场景中
    scene.add(mesh);

    
}