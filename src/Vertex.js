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
    constructor(x,y,z,type,layer,IsActive){
      super(x,y,z,type);
      this.layer=layer;
      this.IsActive=IsActive;
    }
}
