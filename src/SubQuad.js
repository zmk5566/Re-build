import * as THREE from 'three';
import { Vertex } from './Vertex';
import { Triangle } from './Triangle';
import { Quad } from './Quad';
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
export class SubQuadCube extends SubQuad{
    constructor(va,vb,vc,vd,VerAidx,VerBidx,VerCidx,VerDidx,layer){
        super(va,vb,vc,vd);
        this.layer=layer;

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