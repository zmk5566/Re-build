import { HexCubeCoord } from "./HexCubeCoord";
export class Vertex{
    subquadlist=[];
    subquadid_list=[];
    constructor(x,y,z,type) {
        this.x=x;
        this.y=y;
        this.z=z;
        this.type=type;
        this.subquadlist=[];//不确定，最好别用
        this.subquadid_list=[];
      }
}

export class MarchVertex extends Vertex{
  subquadid_list=[];
    constructor(x,y,z,type,layer,IsActive,subquadid_list){
      super(x,y,z,type);
      this.layer=layer;
      this.subquadid_list=subquadid_list;
      this.IsActive=IsActive;
    }
}

export function CreateMarchVertex(AllVertexList,AllMarchVertexList,layer){
  //根据顶点坐标创建3D
  for(let j=0;j<layer;j++){
    var AllMarchVertexLayer_j=[];
    for(let i=0;i<AllVertexList.length;i++){
        AllMarchVertexLayer_j.push(new MarchVertex(AllVertexList[i].x,
            j,//layer*height,因为设置的height=1
            AllVertexList[i].z,
            AllVertexList[i].type,
            j,
            false,
            AllVertexList[i].subquadid_list));
    }
    AllMarchVertexList.push(AllMarchVertexLayer_j);
  }
}
