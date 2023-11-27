//Edge类
export class Edge{
    constructor(va,vb,AllEdges){
        this.va=va;
        this.vb=vb;
        //代替HashSet
        const newEdge = new Set();
        // 添加元素
        newEdge.add(va);
        newEdge.add(vb);
        AllEdges.push(this);
    }
}
export function IsEdgeExist(va,vb,AllEdges){
    //判断以va, vb为顶点的边是否已经存在了
    // AllEdges.forEach(element => {
    //     if(element.newEdge.has(va)&&element.newEdge.has(vb)){
    //         //说明这个边已经存在了
    //         return element;//这里的element是一个
    //     }
    // });
    return null;
}