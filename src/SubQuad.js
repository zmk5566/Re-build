import * as THREE from 'three';
import { Vertex } from './Vertex';
import { Triangle } from './Triangle';
import { Quad } from './Quad';
import {get_model,boolArrayToInt} from "./ModelHolder.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
const loader = new OBJLoader();

export class SubQuad{
    constructor(va,vb,vc,vd){
        this.va=va;
        this.vb=vb;
        this.vc=vc;
        this.vd=vd;

        this.VerAidx=-1;
        this.VerBidx=-1;
        this.VerCidx=-1;
        this.VerDidx=-1;
    }
}
export class MarchCube extends SubQuad{
    
    //有八个顶点的
    MarchVertList_Top=[];
    MarchVertList_Bottom=[];

    is_loaded_mesh=false;


    constructor(va,vb,vc,vd,layer,the_scene,debug_scene){
        super(va,vb,vc,vd);
        this.layer=layer;
        this.botVerAidx;
        this.botVerBidx;
        this.botVerCidx;
        this.botVerDidx;
        this.MarchVertList_Top;
        this.MarchVertList_Bottom;
        this.center_post;
        this.model_int=0;
        this.scene_object = new THREE.Object3D();
        the_scene.add(this.scene_object);
        this.debug_object = new THREE.Object3D();
        debug_scene.add(this.debug_object);

    }

    VisualizeMarchVertex(march_vertex,height){
        var CenterOfHex = new THREE.Mesh(
            new THREE.BoxGeometry(0.1,0.1,0.1),
            new THREE.MeshBasicMaterial({
                wireframe: false,
                color: march_vertex.IsActive == true ? 0xff10f0 : 0xff0000
            }));
            CenterOfHex.position.set(march_vertex.x,march_vertex.layer*height,march_vertex.z);
            this.debug_object.add(CenterOfHex);
    }


    on_triggered(){

        // change itself to be active
        for(let j=0;j<4;j++){//遍历所有受影响的vertex
            if(this.MarchVertList_Bottom[j].IsActive==false){
                this.MarchVertList_Bottom[j].IsActive=true;
                //this.MarchVertList_Bottom[j].on_triggered(steps-1);
                this.VisualizeMarchVertex(this.MarchVertList_Bottom[j],1);
            }
            if(this.MarchVertList_Top[j].IsActive==false){
                this.MarchVertList_Top[j].IsActive=true;
                //this.MarchVertList_Top[j].on_triggered(steps-1);
                this.VisualizeMarchVertex(this.MarchVertList_Top[j],1);
            }
        }
        this.update_name();

    }


    
        load_model(){
            this.update_name();
            // 
            this.update_pos();
            
            this.scene_object.clear();

            if (this.model_int != 0) {
            

            this.mesh_model = deepCopyThreeObject(get_model(this.model_int));
            console.log("processed",this.mesh_model);

            // create a basic material
            //var material = new THREE.MeshBasicMaterial({ color: 0xa9d4ff ,wireframe:false,transparent:true,opacity:0.8,side:THREE.DoubleSide});

            this.mesh_model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    //child.material = material;
                    child.material.side = THREE.DoubleSide;
                    child.geometry = child.geometry.scale(-1, 1, 1);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
                    
                    // vertices=child.vertices;
                    const vertices = child.geometry.attributes.position.array;
                     console.log("vertices count",vertices.length);
                    // 输出每个顶点的坐标
                    for (let i = 0; i < vertices.length; i += 3) {
                        double_lerp(vertices,this.position,i,0);
                    }
                }
                });

            console.log("model_int",this.model_int,this.mesh_model);

            this.scene_object.add(this.mesh_model);


            }

        }

        update_pos(){

        var CenterPosition=new THREE.Vector3(
            (this.MarchVertList_Bottom[0].x+
            this.MarchVertList_Bottom[1].x+
            this.MarchVertList_Bottom[2].x+
            this.MarchVertList_Bottom[3].x)/4,
            0.5+this.MarchVertList_Bottom[0].y,
            (this.MarchVertList_Bottom[0].z+
                this.MarchVertList_Bottom[1].z+
                this.MarchVertList_Bottom[2].z+
                this.MarchVertList_Bottom[3].z)/4);
            this.position = []
            var VertexA=new THREE.Vector3(this.MarchVertList_Bottom[0].x,this.MarchVertList_Bottom[0].y,this.MarchVertList_Bottom[0].z);
            var VertexB=new THREE.Vector3(this.MarchVertList_Bottom[1].x,this.MarchVertList_Bottom[1].y,this.MarchVertList_Bottom[1].z);
            var VertexC=new THREE.Vector3(this.MarchVertList_Bottom[2].x,this.MarchVertList_Bottom[2].y,this.MarchVertList_Bottom[2].z);
            var VertexD=new THREE.Vector3(this.MarchVertList_Bottom[3].x,this.MarchVertList_Bottom[3].y,this.MarchVertList_Bottom[3].z);
            this.position=[VertexA,VertexB,VertexC,VertexD,CenterPosition];
        }


    // load_model(){


    //     this.update_name();
    //     this.update_pos();
        
    //     this.scene_object.clear();


    //     this.mesh_model  =deepCopyThreeObject(get_model(this.model_int));
        
    //     console.log(this.mesh_model);
    //     //this.mesh_model = this.cube_hub.get_preloaded_model(this.bits_list);

    //     // need to be changed very soon
    //     var material = new THREE.MeshPhongMaterial({ color: 0xa9d4ff ,wireframe:false,transparent:true,opacity:0.3,side:THREE.DoubleSide});

    //     this.mesh_model.traverse((child) =>  {
    //         if (child instanceof THREE.Mesh) {
    //             child.material = material;
    //             //child.geometry.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
    //             // vertices=child.vertices;
    //             const vertices = child.geometry.attributes.position.array;
    //             // console.log("vertices count",vertices.length);
    //             // 输出每个顶点的坐标
    //             for (let i = 0; i < vertices.length; i += 3) {
    //                 double_lerp(vertices,this.position,i,0);
    //             }
    //         }
    //         });

    //     this.scene_object.add(this.mesh_model);
    // }

    

    update_name(){
        var bit1=this.MarchVertList_Top[0].IsActive;
        var bit2=this.MarchVertList_Top[1].IsActive;
        var bit3=this.MarchVertList_Top[2].IsActive;
        var bit4=this.MarchVertList_Top[3].IsActive;

        var bit5=this.MarchVertList_Bottom[0].IsActive;
        var bit6=this.MarchVertList_Bottom[1].IsActive;
        var bit7=this.MarchVertList_Bottom[2].IsActive;
        var bit8=this.MarchVertList_Bottom[3].IsActive;

        var temp_bits_list=[bit1,bit2,bit3,bit4,bit5,bit6,bit7,bit8];
        this.model_int=boolArrayToInt(temp_bits_list);
        
    }
}
export function CreateMarchCube(AllSquadList,AllMarchVertexList,AllMarchCubeList,layer,the_scene,debug_scene){
    for(let j=0;j<layer;j++){
        var AllMarchCubeLayer_j=[];
        for(let i=0;i<AllSquadList.length;i++){
            //var new_va=[AllSquadList[i].va[0],i]
            var NewCube=new MarchCube(AllSquadList[i].va,
                AllSquadList[i].vb,//layer*height,因为设置的height=1
                AllSquadList[i].vc,
                AllSquadList[i].vd,
                j,the_scene,debug_scene);
                NewCube.botVerAidx=AllSquadList[i].VerAidx;
                NewCube.botVerBidx=AllSquadList[i].VerBidx;
                NewCube.botVerCidx=AllSquadList[i].VerCidx;
                NewCube.botVerDidx=AllSquadList[i].VerDidx;
                NewCube.MarchVertList_Bottom.push(AllMarchVertexList[j][NewCube.botVerAidx],
                    AllMarchVertexList[j][NewCube.botVerBidx],
                    AllMarchVertexList[j][NewCube.botVerCidx],
                    AllMarchVertexList[j][NewCube.botVerDidx]);
                NewCube.MarchVertList_Top.push(AllMarchVertexList[j+1][NewCube.botVerAidx],
                    AllMarchVertexList[j+1][NewCube.botVerBidx],
                    AllMarchVertexList[j+1][NewCube.botVerCidx],
                    AllMarchVertexList[j+1][NewCube.botVerDidx]);
            AllMarchCubeLayer_j.push(NewCube);
        }
        AllMarchCubeList.push(AllMarchCubeLayer_j);
    }
}

export function MapSubQuad4UI(TriangleList,QuadList,VertexList,MidList,CenterList){
    //HexCenterPosList作为所有可选顶点的索引
    //输入得到的所有的三角形，因为他们都互补相邻，所以直接获取他们的顶点就可以
    //输入所有得到的四边形，遍历他们的顶点，如果已经存在了就直接加进去
    TriangleList.forEach(element => {
        //创建顶点+检验是否重合
        if(VertexList.length>0){
            var TriVetList=[element.va,element.vb,element.vc];
            for(let i=0;i<TriVetList.length;i++){
                let IsExist=false;
                for(let j=0;j<VertexList.length;j++){
                    if(TriVetList[i][0]==VertexList[j].x&&TriVetList[i][1]==VertexList[j].y&&TriVetList[i][2]==VertexList[j].z){
                        //vertex already exist
                        VertexList[j].subquadlist.push(element.squadlist[i]);
                        IsExist=true;
                        break;
                    }
                }
                if(IsExist){continue;}
                var NewVet=new Vertex(TriVetList[i][0],TriVetList[i][1],TriVetList[i][2],"vertex");
                NewVet.subquadlist.push(element.squadlist[i]);
                VertexList.push(NewVet);
            }
        }
        else{
        var VetA=new Vertex(element.va[0],element.va[1],element.va[2],"vertex");
        VetA.subquadlist.push(element.squadlist[0]);
        var VetB=new Vertex(element.vb[0],element.vb[1],element.vb[2],"vertex");
        VetB.subquadlist.push(element.squadlist[1]);
        var VetC=new Vertex(element.vc[0],element.vc[1],element.vc[2],"vertex");
        VetC.subquadlist.push(element.squadlist[2]);
        VertexList.push(VetA);
        VertexList.push(VetB);
        VertexList.push(VetC);}

        //创建中点
        var MidAB=new Vertex(element.mid_ab[0],element.mid_ab[1],element.mid_ab[2],"middle");
        MidAB.subquadlist.push(element.squadlist[0]);
        MidAB.subquadlist.push(element.squadlist[1]);
        var MidBC=new Vertex(element.mid_bc[0],element.mid_bc[1],element.mid_bc[2],"middle");
        MidBC.subquadlist.push(element.squadlist[1]);
        MidBC.subquadlist.push(element.squadlist[2]);
        var MidAC=new Vertex(element.mid_ac[0],element.mid_ac[1],element.mid_ac[2],"middle");
        MidAC.subquadlist.push(element.squadlist[0]);
        MidAC.subquadlist.push(element.squadlist[2]);
        MidList.push(MidAB);
        MidList.push(MidBC);
        MidList.push(MidAC);

        //创建Center
        var Center=new Vertex(element.center[0],element.center[1],element.center[2],"center");
        Center.subquadlist.push(element.squadlist[0]);
        Center.subquadlist.push(element.squadlist[1]);
        Center.subquadlist.push(element.squadlist[2]);
        CenterList.push(Center);
    });
    //onsole.log(CenterList[0].x);
    QuadList.forEach(element => {
        //创建顶点+判断
        var QuadVetList=[element.va,element.vb,element.vc,element.vd];
        var QuadMidList=[element.mid_ab,element.mid_bc,element.mid_cd,element.mid_ad];
        for(let i=0;i<QuadVetList.length;i++){
            let IsExist=false;
            for(let j=0;j<VertexList.length;j++){
                if(QuadVetList[i][0]==VertexList[j].x&&QuadVetList[i][1]==VertexList[j].y&&QuadVetList[i][2]==VertexList[j].z){
                    //vertex already exist
                    VertexList[j].subquadlist.push(element.squadlist[i]);
                    IsExist=true;
                    break;
                }
            }
            if(IsExist){continue;}
            var NewVet=new Vertex(QuadVetList[i][0],QuadVetList[i][1],QuadVetList[i][2],"vertex");
            NewVet.subquadlist.push(element.squadlist[i]);
            VertexList.push(NewVet);
        }
        for(let i=0;i<QuadMidList.length;i++){
            let IsExist=false;
            for(let j=0;j<MidList.length;j++){
                if(QuadMidList[i][0]==MidList[j].x&&QuadMidList[i][1]==MidList[j].y&&QuadMidList[i][2]==MidList[j].z){
                    //vertex already exist
                    MidList[j].subquadlist.push(element.squadlist[i]);
                    MidList[j].subquadlist.push(element.squadlist[(i+1)%QuadMidList.length]);
                    IsExist=true;
                    break;
                }
            }
            if(IsExist){continue;}
            var NewVet=new Vertex(QuadMidList[i][0],QuadMidList[i][1],QuadMidList[i][2],"middle");
            NewVet.subquadlist.push(element.squadlist[i]);
            NewVet.subquadlist.push(element.squadlist[(i+1)%QuadMidList.length]);
            MidList.push(NewVet);
        }
        //创建Center
        var Center=new Vertex(element.center[0],element.center[1],element.center[2],"center");
        Center.subquadlist.push(element.squadlist[0]);
        Center.subquadlist.push(element.squadlist[1]);
        Center.subquadlist.push(element.squadlist[2]);
        Center.subquadlist.push(element.squadlist[3]);
        CenterList.push(Center);
    });
}
export function DrawSubQuad(quad,col,scene,meshlist,IsLine=false){
    //console.log("drawsquad");
    const vertices = [
        quad.vd[0],quad.vd[1],quad.vd[2],
        quad.vc[0],quad.vc[1],quad.vc[2],   // 第一个顶点的坐标
        quad.vb[0],quad.vb[1],quad.vb[2],  // 第二个顶点的坐标
        quad.va[0],quad.va[1],quad.va[2]      // 第三个顶点的坐标
      ];
    //console.log(vertices);

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
    const material = new THREE.MeshBasicMaterial({ color: col});
    var mesh = new THREE.Mesh(geometry, material);
    if(IsLine){mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), material);}
    meshlist.push(mesh);
    // 将网格添加到场景中
    scene.add(mesh);   
}


export function Smooth(VertexList,SQuadList){
    //Map(VertexList,SQuadList);
    SQuadList.forEach((element,index) => {
        for(let i=0;i<15;i++)
        {SmoothSquad(index,VertexList,SQuadList);}
        //更新对应的顶点坐标
    });
}
export function Map(VertexList,SQuadList){
    //Map
    SQuadList.forEach((element,index) => {
        for(let i=0;i<VertexList.length;i++){
            if(element.va[0]==VertexList[i].x
                &&element.va[1]==VertexList[i].y
                &&element.va[2]==VertexList[i].z){element.VerAidx=i;if((VertexList[i].subquadid_list).includes(index)==false){VertexList[i].subquadid_list.push(index);}}
            if(element.vb[0]==VertexList[i].x
                &&element.vb[1]==VertexList[i].y
                &&element.vb[2]==VertexList[i].z){element.VerBidx=i;if((VertexList[i].subquadid_list).includes(index)==false){VertexList[i].subquadid_list.push(index);}}
            if(element.vc[0]==VertexList[i].x
                &&element.vc[1]==VertexList[i].y
                &&element.vc[2]==VertexList[i].z){element.VerCidx=i;if((VertexList[i].subquadid_list).includes(index)==false){VertexList[i].subquadid_list.push(index);}}
            if(element.vd[0]==VertexList[i].x
                &&element.vd[1]==VertexList[i].y
                &&element.vd[2]==VertexList[i].z){if((VertexList[i].subquadid_list).includes(index)==false){element.VerDidx=i;VertexList[i].subquadid_list.push(index);}}
        }
    });
}

function SmoothSquad(index,VertexList,SQuadList){
    var Squad=SQuadList[index];
    //需要重新编号，找到那个分类为顶点的点

    var squad_center=[(Squad.va[0]+Squad.vb[0]+Squad.vc[0]+Squad.vd[0])/4,
        (Squad.va[1]+Squad.vb[1]+Squad.vc[1]+Squad.vd[1])/4,
        (Squad.va[2]+Squad.vb[2]+Squad.vc[2]+Squad.vd[2])/4];//这个不需要判断

    var vecA=new THREE.Vector3(Squad.va[0]-squad_center[0],Squad.va[1]-squad_center[1],Squad.va[2]-squad_center[2]);
    var vecB=new THREE.Vector3(Squad.vb[0]-squad_center[0],Squad.vb[1]-squad_center[1],Squad.vb[2]-squad_center[2]);
    var vecC=new THREE.Vector3(Squad.vc[0]-squad_center[0],Squad.vc[1]-squad_center[1],Squad.vc[2]-squad_center[2]);
    var vecD=new THREE.Vector3(Squad.vd[0]-squad_center[0],Squad.vd[1]-squad_center[1],Squad.vd[2]-squad_center[2]);

    var rotationQuaternionMid1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 90 * (Math.PI / 180));
    var rotationQuaternionCenter = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 180 * (Math.PI / 180));
    var rotationQuaternionMid2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 270 * (Math.PI / 180));

    var mVertexList=[Squad.va,Squad.vb,Squad.vc,Squad.vd];
    var VectorList=[vecA,vecB,vecC,vecD];
    var WhereIsVertex=-1;
    var idxs=[Squad.VerAidx,Squad.VerBidx,Squad.VerCidx,Squad.VerDidx];
    var ReOrderList=[];
    for(let i=0;i<4;i++){
        var id=idxs[i];
        if(VertexList[id].type=="vertex"){
            WhereIsVertex=i;
            ReOrderList.push(i,(1+i)%4,(2+i)%4,(3+i)%4);//[2,3,0,1][vertex,mid1,center,mid2]
            //console.log(ReOrderList);
        }//WhereIsVertex=0:A是顶点，WhereIsVertex=1：B是顶点
        //
    }

    var rotatedVector1 = VectorList[ReOrderList[1]].applyQuaternion(rotationQuaternionMid1).add(new THREE.Vector3(squad_center[0],squad_center[1],squad_center[2]));
    var rotatedVector2 = VectorList[ReOrderList[2]].applyQuaternion(rotationQuaternionCenter).add(new THREE.Vector3(squad_center[0],squad_center[1],squad_center[2]));
    var rotatedVector3 = VectorList[ReOrderList[3]].applyQuaternion(rotationQuaternionMid2).add(new THREE.Vector3(squad_center[0],squad_center[1],squad_center[2]));

    
    var UpdateVertex=new THREE.Vector3((mVertexList[WhereIsVertex][0]+rotatedVector1.x+rotatedVector2.x+rotatedVector3.x)/4,
                                (mVertexList[WhereIsVertex][1]+rotatedVector1.y+rotatedVector2.y+rotatedVector3.y)/4,
                                (mVertexList[WhereIsVertex][2]+rotatedVector1.z+rotatedVector2.z+rotatedVector3.z)/4);

    var NewVertexVector=new THREE.Vector3(UpdateVertex.x-squad_center[0],UpdateVertex.y-squad_center[1],UpdateVertex.z-squad_center[2]);
    var UpdateMid1=NewVertexVector.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -90 * (Math.PI / 180))).add(new THREE.Vector3(squad_center[0],squad_center[1],squad_center[2]));
    var UpdateCenter=NewVertexVector.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -180 * (Math.PI / 180))).add(new THREE.Vector3(squad_center[0],squad_center[1],squad_center[2]));
    var UpdateMid2=NewVertexVector.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 1), -270 * (Math.PI / 180))).add(new THREE.Vector3(squad_center[0],squad_center[1],squad_center[2]));

    // //update this squad
    //判断
    const factor=0.02;
    var UpdateList=[UpdateVertex,UpdateMid1,UpdateCenter,UpdateMid2];
    SQuadList[index].va=[factor*(UpdateList[ReOrderList.indexOf(0)].x-Squad.va[0])+Squad.va[0],factor*(UpdateList[ReOrderList.indexOf(0)].y-Squad.va[1])+Squad.va[1],factor*(UpdateList[ReOrderList.indexOf(0)].z-Squad.va[2])+Squad.va[2]];
    SQuadList[index].vb=[factor*(UpdateList[ReOrderList.indexOf(1)].x-Squad.vb[0])+Squad.vb[0],factor*(UpdateList[ReOrderList.indexOf(1)].y-Squad.vb[1])+Squad.vb[1],factor*(UpdateList[ReOrderList.indexOf(1)].z-Squad.vb[2])+Squad.vb[2]];
    SQuadList[index].vc=[factor*(UpdateList[ReOrderList.indexOf(2)].x-Squad.vc[0])+Squad.vc[0],factor*(UpdateList[ReOrderList.indexOf(2)].y-Squad.vc[1])+Squad.vc[1],factor*(UpdateList[ReOrderList.indexOf(2)].z-Squad.vc[2])+Squad.vc[2]];
    SQuadList[index].vd=[factor*(UpdateList[ReOrderList.indexOf(3)].x-Squad.vd[0])+Squad.vd[0],factor*(UpdateList[ReOrderList.indexOf(3)].y-Squad.vd[1])+Squad.vd[1],factor*(UpdateList[ReOrderList.indexOf(3)].z-Squad.vd[2])+Squad.vd[2]];

    //update vertex+update influenced squad
    VertexList[SQuadList[index].VerAidx].x=SQuadList[index].va[0];
    VertexList[SQuadList[index].VerAidx].y=SQuadList[index].va[1];
    VertexList[SQuadList[index].VerAidx].z=SQuadList[index].va[2];

    VertexList[SQuadList[index].VerBidx].x=SQuadList[index].vb[0];
    VertexList[SQuadList[index].VerBidx].y=SQuadList[index].vb[1];
    VertexList[SQuadList[index].VerBidx].z=SQuadList[index].vb[2];

    VertexList[SQuadList[index].VerCidx].x=SQuadList[index].vc[0];
    VertexList[SQuadList[index].VerCidx].y=SQuadList[index].vc[1];
    VertexList[SQuadList[index].VerCidx].z=SQuadList[index].vc[2];

    VertexList[SQuadList[index].VerDidx].x=SQuadList[index].vd[0];
    VertexList[SQuadList[index].VerDidx].y=SQuadList[index].vd[1];
    VertexList[SQuadList[index].VerDidx].z=SQuadList[index].vd[2];


    for(let i=0;i<VertexList[Squad.VerAidx].subquadid_list.length;i++){//遍历这个顶点影响到的所有的subsquad
        var squadIdx=VertexList[Squad.VerAidx].subquadid_list[i];
        var influencedSquad=SQuadList[squadIdx];
        SQuadList[squadIdx].va=[VertexList[influencedSquad.VerAidx].x,VertexList[influencedSquad.VerAidx].y,VertexList[influencedSquad.VerAidx].z];
        SQuadList[squadIdx].vb=[VertexList[influencedSquad.VerBidx].x,VertexList[influencedSquad.VerBidx].y,VertexList[influencedSquad.VerBidx].z];
        SQuadList[squadIdx].vc=[VertexList[influencedSquad.VerCidx].x,VertexList[influencedSquad.VerCidx].y,VertexList[influencedSquad.VerCidx].z];
        SQuadList[squadIdx].vd=[VertexList[influencedSquad.VerDidx].x,VertexList[influencedSquad.VerDidx].y,VertexList[influencedSquad.VerDidx].z];
    }

    for(let i=0;i<VertexList[Squad.VerBidx].subquadid_list.length;i++){//遍历这个顶点影响到的所有的subsquad
        var squadIdx=VertexList[Squad.VerBidx].subquadid_list[i];
        var influencedSquad=SQuadList[squadIdx];
        SQuadList[squadIdx].va=[VertexList[influencedSquad.VerAidx].x,VertexList[influencedSquad.VerAidx].y,VertexList[influencedSquad.VerAidx].z];
        SQuadList[squadIdx].vb=[VertexList[influencedSquad.VerBidx].x,VertexList[influencedSquad.VerBidx].y,VertexList[influencedSquad.VerBidx].z];
        SQuadList[squadIdx].vc=[VertexList[influencedSquad.VerCidx].x,VertexList[influencedSquad.VerCidx].y,VertexList[influencedSquad.VerCidx].z];
        SQuadList[squadIdx].vd=[VertexList[influencedSquad.VerDidx].x,VertexList[influencedSquad.VerDidx].y,VertexList[influencedSquad.VerDidx].z];
    }
    for(let i=0;i<VertexList[Squad.VerCidx].subquadid_list.length;i++){//遍历这个顶点影响到的所有的subsquad
        var squadIdx=VertexList[Squad.VerCidx].subquadid_list[i];
        var influencedSquad=SQuadList[squadIdx];
        SQuadList[squadIdx].va=[VertexList[influencedSquad.VerAidx].x,VertexList[influencedSquad.VerAidx].y,VertexList[influencedSquad.VerAidx].z];
        SQuadList[squadIdx].vb=[VertexList[influencedSquad.VerBidx].x,VertexList[influencedSquad.VerBidx].y,VertexList[influencedSquad.VerBidx].z];
        SQuadList[squadIdx].vc=[VertexList[influencedSquad.VerCidx].x,VertexList[influencedSquad.VerCidx].y,VertexList[influencedSquad.VerCidx].z];
        SQuadList[squadIdx].vd=[VertexList[influencedSquad.VerDidx].x,VertexList[influencedSquad.VerDidx].y,VertexList[influencedSquad.VerDidx].z];
    }
    for(let i=0;i<VertexList[Squad.VerDidx].subquadid_list.length;i++){//遍历这个顶点影响到的所有的subsquad
        var squadIdx=VertexList[Squad.VerDidx].subquadid_list[i];
        var influencedSquad=SQuadList[squadIdx];
        SQuadList[squadIdx].va=[VertexList[influencedSquad.VerAidx].x,VertexList[influencedSquad.VerAidx].y,VertexList[influencedSquad.VerAidx].z];
        SQuadList[squadIdx].vb=[VertexList[influencedSquad.VerBidx].x,VertexList[influencedSquad.VerBidx].y,VertexList[influencedSquad.VerBidx].z];
        SQuadList[squadIdx].vc=[VertexList[influencedSquad.VerCidx].x,VertexList[influencedSquad.VerCidx].y,VertexList[influencedSquad.VerCidx].z];
        SQuadList[squadIdx].vd=[VertexList[influencedSquad.VerDidx].x,VertexList[influencedSquad.VerDidx].y,VertexList[influencedSquad.VerDidx].z];
    }
}

function double_lerp(vertex_list,position,idx,ConstructLayer){
    const x = vertex_list[idx];
    const y = vertex_list[idx + 1];
    const z = vertex_list[idx + 2];

    var interpolatedAB = new THREE.Vector3();
    var interpolatedCD = new THREE.Vector3();
    // console.log(`Vertex ${i / 3}: x=${x}, y=${y}, z=${z}`);

    interpolatedAB.lerpVectors(position[0], position[3], (x+0.5));

    interpolatedCD.lerpVectors(position[1], position[2], (x+0.5));

    const finalLerp=new THREE.Vector3();
    finalLerp.lerpVectors(interpolatedAB,interpolatedCD,(z+0.5));

            
    vertex_list[idx]=finalLerp.x;
    vertex_list[idx+1]=(y+finalLerp.y+0.5+ConstructLayer);
    vertex_list[idx+2]=finalLerp.z;
}

function deepCopyThreeObject(originalObject) {
    console.log("og object",originalObject);
    // Clone the object to create a new instance with copied properties
    let copiedObject = originalObject.clone();


    if (originalObject.type == "Mesh") {
    // copy the geometry
    var temp_clone =originalObject.geometry.clone();
    copiedObject.geometry = temp_clone;
    console.log("comparison",temp_clone,originalObject.geometry);
    } else{
        console.log("not mesh");

        // loop through all children using index
        for (let i = 0; i < originalObject.children.length; i++) {
            // Clone the child to create a new instance with copied properties
            let copiedChild = deepCopyThreeObject(originalObject.children[i]);
    
            // Add the copied child to the copiedObject
            copiedObject.children[i] = copiedChild;
        }
        return copiedObject;
    }


    if (originalObject.children.length == 0) {
        return copiedObject;
    }else{
        for (let child of originalObject.children) {
            // Clone the child to create a new instance with copied properties
            let copiedChild = deepCopyThreeObject(child);
    
            // Add the copied child to the copiedObject
            copiedObject.add(copiedChild);
        }
        return copiedObject;

    }
    return copiedObject;

}