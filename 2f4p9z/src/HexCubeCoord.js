//TODO:
//创建六边形cube coordinate坐标
export class HexCubeCoord{
    //一个六边形
    static worldPosition;//世界坐标
    constructor(q,r,s){
        //六边形的HexCube坐标+它的世界坐标
        this.q=q;
        this.r=r;
        this.s=s;
        this.worldPosition=this.worldPosition(q,r,s);
        this.subsquad_list=[];
    };
    worldPosition(q,r,s){
        //这个六边形的中心点
        var factor=2;
        var world_position=new Array((q*Math.sqrt(3)/2)*factor, 0, (-r-(q/2))*factor);
        //console.log("world position",world_position[0],world_position[1],world_position[2]);
        return world_position;
    }
}
var center=new HexCubeCoord(0,0,0);
//六边形移动方向
var cube_direction_vectors=[
    new HexCubeCoord(+1,0,-1),
    new HexCubeCoord(+1,-1,0),
    new HexCubeCoord(0,-1,+1),
    new HexCubeCoord(-1,0,+1),
    new HexCubeCoord(-1,+1,0),
    new HexCubeCoord(0,+1,-1)
];
//返回一个方向
function CubeDirection(direction){
    return cube_direction_vectors[direction];
}
//定义Add方法
function CubeAdd(hex,dir){
    //console.log(dir.q,dir.r,dir.s);
    return new HexCubeCoord(hex.q + dir.q, hex.r + dir.r, hex.s + dir.s);
}
//返回一个六边形HexCoord：按方向移动
function CubeNeighbor(hex,direction){
    return CubeAdd(hex,CubeDirection(direction));
}
//定义Scale方法
function CubeScale(dir,factor){
    return new HexCubeCoord(dir.q*factor,dir.r*factor,dir.s*factor);
}
//Single Ring
//返回一个六边形list：一个半径为Radius的六边形环
export function CubeRing(center,radius){
    var results=[];
    if(radius==0){
        console.log("radius is 0");
        results.push(new HexCubeCoord(0,0,0));
    }
    else{
        //console.log("genterating single ring of radius ",radius);
        // var hex=new HexCubeCoord(center.q + CubeScale(CubeDirection(4),radius).q, 
        // center.r + CubeScale(CubeDirection(4),radius).r, 
        // center.s + CubeScale(CubeDirection(4),radius).s);
        var hex=CubeAdd(center,(CubeScale(CubeDirection(4),radius)));
        for(let i=0;i<6;i++){
            for(let j=0;j<radius;j++){
                //console.log("world position",hex.worldPosition[0],hex.worldPosition[1],hex.worldPosition[2]);
                results.push(hex);
                hex=CubeNeighbor(hex,i);
            }
        }
    }
    //console.log(results.length);
    return results;
}
//返回一个六边形list：一个半径为radius的六边形饼
export function HexCoordList(radius){
    var result=[];
    for(let i=0;i<=radius;i++){
        result.push(CubeRing(center,i));
    }
    return result;
}