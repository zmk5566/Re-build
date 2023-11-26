import { HexCubeCoord } from "./HexCubeCoord";
export class Vertex{
    subquadlist=[];
    subquadid_list=[];
    constructor(x,y,z,type) {
        this.x=x;
        this.y=y;
        this.z=z;
        this.type=type;
        this.subquadlist=[];
        this.subquadid_list=[];
      }
}


