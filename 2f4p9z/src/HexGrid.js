import {Vertex_hex,Hex} from './Vertex.js';
export class HexGrid{
    hexes=[];
    constructor(radius,CellSize){
        this.radius=radius;
        this.CellSize=CellSize;
        var vetex_hex=new Vertex_hex();
        Hex(this.hexes);
    }
}