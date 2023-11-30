import * as THREE from 'three';
import scene from '.';
var cubeVertices=[
    [-0.5,0.5,0.5],
    [-0.5,0.5,-0.5],
    [0.5,0.5,-0.5],
    [0.5,0.5,0.5],

    [-0.5,-0.5,0.5],
    [-0.5,-0.5,-0.5],
    [0.5,-0.5,-0.5],
    [0.5,-0.5,0.5]
];
var EdgeMid=[
    [-0.5,0.5,0],
    [0,0.5,-0.5],
    [0.5,0.5,0],
    [0,0.5,0.5],

    [-0.5,0,0.5],
    [-0.5,0,-0.5],
    [0.5,0,-0.5],
    [0.5,0,0.5],

    [-0.5,-0.5,0],
    [0,-0.5,-0.5],
    [0.5,-0.5,0],
    [0,-0.5,0.5]
]
var FaceCenter=[
    [0,0.5,0],
    [-0.5,0,0],
    [0,0,-0.5],
    [0.5,0,0],
    [0,0,0.5],
    [0,-0.5,0]
];
var Center=[[0,0,0]];

export var vertDataset=cubeVertices.concat(EdgeMid).concat(FaceCenter).concat(Center);

export var FaceDataset=[
        [11,20,26,24],
        [20,9,22,26],
        [24,26,25,19],
        [26,22,17,25],

        [8,20,26,21],
        [20,10,23,26],
        [21,26,25,16],
        [26,23,18,25],

        [13,22,26,21],
        [22,14,23,26],
        [21,26,24,12],
        [26,23,15,24]
];

const VertexFacePair=[
    [0,4,10],
    [4,1,8],
    [1,5,9],
    [0,5,11],
    [6,2,10],
    [6,8,3],
    [3,9,7],
    [2,7,11]
];
export function ConstructUnit(bitList,scene,CubeMeSH){
    DrawFaceCube(scene,CubeMeSH);
    var ConstructPairList=[
        [0,4,10],
        [4,1,8],
        [1,5,9],
        [0,5,11],
        [6,2,10],
        [6,8,3],
        [3,9,7],
        [2,7,11]
    ];
    console.log(bitList);
    console.log(VertexFacePair);
    //12条边
    if(bitList[0]==true){
        if(bitList[1]==true){
            ConstructPairList[0].splice(ConstructPairList[0].indexOf(4),1);
            ConstructPairList[1].splice(ConstructPairList[1].indexOf(4),1);
        }
        if(bitList[3]==true){
            ConstructPairList[0].splice(ConstructPairList[0].indexOf(0),1);
            ConstructPairList[3].splice(ConstructPairList[3].indexOf(0),1);
        }
        if(bitList[4]==true){
            ConstructPairList[0].splice(ConstructPairList[0].indexOf(10),1);
            ConstructPairList[4].splice(ConstructPairList[4].indexOf(10),1);
        }
    }
    else{ConstructPairList[0]=[];}
    if(bitList[1]==true){
        if(bitList[2]==true){
            ConstructPairList[1].splice(ConstructPairList[1].indexOf(1),1);
            ConstructPairList[2].splice(ConstructPairList[2].indexOf(1),1);
        }
        if(bitList[5]==true){
            ConstructPairList[1].splice(ConstructPairList[1].indexOf(8),1);
            ConstructPairList[5].splice(ConstructPairList[5].indexOf(8),1);
        }
    }
    else{ConstructPairList[1]=[];}
    if(bitList[2]==true){
        if(bitList[3]==true){
            ConstructPairList[2].splice(ConstructPairList[2].indexOf(5),1);
            ConstructPairList[3].splice(ConstructPairList[3].indexOf(5),1);
        }
        if(bitList[6]==true){
            ConstructPairList[2].splice(ConstructPairList[2].indexOf(9),1);
            ConstructPairList[6].splice(ConstructPairList[6].indexOf(9),1);
        }
    }
    else{ConstructPairList[2]=[];}
    if(bitList[3]==true){
        if(bitList[7]==true){
            ConstructPairList[3].splice(ConstructPairList[3].indexOf(11),1);
            ConstructPairList[7].splice(ConstructPairList[7].indexOf(11),1);
        }
    }
    else{ConstructPairList[3]=[];}
    if(bitList[4]==true){
        if(bitList[5]==true){
            ConstructPairList[4].splice(ConstructPairList[4].indexOf(6),1);
            ConstructPairList[5].splice(ConstructPairList[7].indexOf(6),1);
        }
        if(bitList[7]==true){
            ConstructPairList[4].splice(ConstructPairList[4].indexOf(2),1);
            ConstructPairList[7].splice(ConstructPairList[7].indexOf(2),1);
        }
    }
    else{ConstructPairList[4]=[];}
    if(bitList[5]==true){
        if(bitList[6]==true){
            ConstructPairList[5].splice(ConstructPairList[5].indexOf(3),1);
            ConstructPairList[6].splice(ConstructPairList[6].indexOf(3),1);
        }
    }
    else{ConstructPairList[5]=[];}
    if(bitList[6]==true){
        if(bitList[7]==true){
            ConstructPairList[6].splice(ConstructPairList[6].indexOf(7),1);
            ConstructPairList[7].splice(ConstructPairList[7].indexOf(7),1);
        }
    }
    else{ConstructPairList[6]=[];}
    if(bitList[7]==false){ConstructPairList[7]=[];}
    console.log(ConstructPairList);
    for(let i=0;i<8;i++){
        if(bitList[i]==true){DrawVertex(i,scene,CubeMeSH);}
        if(ConstructPairList[i].length>0){
            for(let j=0;j<ConstructPairList[i].length;j++){
                DrawFace(ConstructPairList[i][j],cubeVertices[i],scene,CubeMeSH);
            }
        }
    }
}

// export function ConstructCube(bit,scene){
    
//     DrawFaceCube(scene,CubeMeSH);
//     //DrawFace(7,scene);
//     DrawVertex(bit,scene);
//     for(let i=0;i<3;i++){
//         DrawFace(VertexFacePair[bit][i],cubeVertices[bit],scene);
//     }
// }
function DrawVertex(i,scene,CubeMeSH){
    var CenterOfHex = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 4, 2),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            color: 0xff0000
        }));
        CenterOfHex.position.set(cubeVertices[i][0],cubeVertices[i][1],cubeVertices[i][2]);
        scene.add(CenterOfHex);
        CubeMeSH.push(CenterOfHex);
}
export function DrawFace(FaceID,vertex,scene,CubeMeSH){
   // 创建顶点坐标数组
    var vertices = [//一个面的四个顶点坐标
        vertDataset[FaceDataset[FaceID][0]][0],vertDataset[FaceDataset[FaceID][0]][1],vertDataset[FaceDataset[FaceID][0]][2],
        vertDataset[FaceDataset[FaceID][1]][0],vertDataset[FaceDataset[FaceID][1]][1],vertDataset[FaceDataset[FaceID][1]][2],
        vertDataset[FaceDataset[FaceID][2]][0],vertDataset[FaceDataset[FaceID][2]][1],vertDataset[FaceDataset[FaceID][2]][2],
        vertDataset[FaceDataset[FaceID][3]][0],vertDataset[FaceDataset[FaceID][3]][1],vertDataset[FaceDataset[FaceID][3]][2]
    ];
    //vertices=[0, 0.5, 0.5, 0, 0.5, 0, 0, 0, 0, 0, 0, 0.5];
    //console.log(vertices);
    //检测法线，根据vertex坐标判断要不要反向
    var vertex0 = new THREE.Vector3(vertDataset[FaceDataset[FaceID][0]][0],vertDataset[FaceDataset[FaceID][0]][1],vertDataset[FaceDataset[FaceID][0]][2]);
    var vertex1 = new THREE.Vector3(vertDataset[FaceDataset[FaceID][1]][0],vertDataset[FaceDataset[FaceID][1]][1],vertDataset[FaceDataset[FaceID][1]][2]);
    var vertex2 = new THREE.Vector3(vertDataset[FaceDataset[FaceID][2]][0],vertDataset[FaceDataset[FaceID][2]][1],vertDataset[FaceDataset[FaceID][2]][2]);
    var vertex3 = new THREE.Vector3(vertDataset[FaceDataset[FaceID][3]][0],vertDataset[FaceDataset[FaceID][3]][1],vertDataset[FaceDataset[FaceID][3]][2]);

    // 计算三角形的法线//012
    var tri1=[0,1,2];
    var tri2=[0,2,3];
    var edge1 = new THREE.Vector3().subVectors(vertex1, vertex0);
    var edge2 = new THREE.Vector3().subVectors(vertex2, vertex0);
    var normal1 = new THREE.Vector3().crossVectors(edge1, edge2).normalize();
    var center2vertex=new THREE.Vector3(vertex[0],vertex[1],vertex[2]);
    if(normal1.dot(center2vertex)>0){
        //说明这个法向是对的
        tri1=[0,1,2];
    }
    else{tri1=[0,2,1];}
    var edge3 = new THREE.Vector3().subVectors(vertex3, vertex0);
    var normal2 = new THREE.Vector3().crossVectors(edge1, edge3).normalize();
    if(normal2.dot(center2vertex)>0){
        //说明这个法向是对的
        tri2=[0,2,3];
    }
    else{tri2=[0,3,2];}

    // 创建顶点索引数组
    var indices = [
        tri1[0], tri1[1], tri1[2],    // 第一个三角形面
        tri2[0], tri2[1], tri2[2]     // 第二个三角形面
    ];

    //e.log(indices);
    // 创建 BufferGeometry 对象
    var geometry = new THREE.BufferGeometry();
    
    // 设置顶点坐标属性
    var positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
    geometry.setAttribute('position', positionAttribute);
    
    // 设置顶点索引属性
    geometry.setIndex(indices);
    
    // 创建材质对象
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00,side:THREE.DoubleSide });
    
    // 创建网格对象
    var mesh = new THREE.Mesh(geometry, material);
    
    // 将网格对象添加到场景中
    scene.add(mesh);
    CubeMeSH.push(mesh);
}

export function DrawFaceCube(scene,CubeMeSH){
    // 创建立方体的大小
    var size = 0.5;

    // 创建几何体对象
    var geometry = new THREE.BoxGeometry(size, size, size);

    // 创建线框几何体对象
    var wireframeGeometry = new THREE.WireframeGeometry(geometry);

    // 创建线框材质对象
    var material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    // 创建线框网格对象
    var wireframe = new THREE.LineSegments(wireframeGeometry, material);
    // 创建堆叠的网格对象
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
        for (var k = 0; k < 2; k++) {
            var wireframeClone =  wireframe.clone();
            wireframeClone.position.set(i * size - size / 2, j * size - size / 2, k * size - size / 2);
            scene.add(wireframeClone);
            CubeMeSH.push(wireframeClone);
        }
        }
    }
}