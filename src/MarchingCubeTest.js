import * as THREE from 'three';
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

var CubeMeSH=[];

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

console.log("cube vertices",vertDataset)




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



function get_construction_by_bits(bitList){
    let ConstructPairList = JSON.parse(JSON.stringify(VertexFacePair))

    console.log(bitList);
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

    return ConstructPairList;

}



export function ConstructUnit(bitList,scene,CubeMeSH){
    //DrawFaceCube(scene,CubeMeSH);
    var ConstructPairList= get_construction_by_bits(bitList);

    console.log("ConstructPairList",ConstructPairList);

    return get_the_overall_mesh(ConstructPairList);
}

export function bit_to_mesh(bitList){

    var ConstructPairList= get_construction_by_bits(bitList);

    return get_the_overall_mesh(ConstructPairList);
}


function get_the_overall_mesh(ConstructPairList){
    // create an empty meshobject
    var overall_mesh = new THREE.Mesh();

    for(let i=0;i<8;i++){
        //if(bitList[i]==true){DrawVertex(i,scene,CubeMeSH);}
        if(ConstructPairList[i].length>0){
            for(let j=0;j<ConstructPairList[i].length;j++){
                var temp_mesh = DrawFace(ConstructPairList[i][j],cubeVertices[i]);
                overall_mesh.add(temp_mesh);
            }
        }
    }

    return overall_mesh;
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
export function DrawFace(FaceID,vertex){
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
    var material = new THREE.MeshBasicMaterial({ color: 0xaed8e6,side:THREE.DoubleSide });
    
    // 创建网格对象
    var mesh = new THREE.Mesh(geometry, material);

    console.log("real mesh",mesh);
    
    
    // 将网格对象添加到场景中
    //scene.add(mesh);
    //CubeMeSH.push(mesh);

    return mesh;
}

export function DrawFaceCube(scene,debug_scene){
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
            CubeMeSH.push(debug_scene);
        }
        }
    }

    

}


export function init_gui(input_gui,input_scene){

    var march_folder = input_gui.addFolder('TEST: Marching Cube');
    
    var digit0 = {toggle: false};
    var digit1 = {toggle: false};
    var digit2 = {toggle: false};
    var digit3 = {toggle: false};
    var digit4 = {toggle: false};
    var digit5 = {toggle: false};
    var digit6 = {toggle: false};
    var digit7 = {toggle: false};
    var bitlist=[digit0.toggle,digit1.toggle,digit2.toggle,digit3.toggle,digit4.toggle,digit5.toggle,digit6.toggle,digit7.toggle];


    march_folder.add(digit0, 'toggle').name('digit0').onFinishChange(redraw);
    march_folder.add(digit1, 'toggle').name('digit1').onFinishChange(redraw);
    march_folder.add(digit2, 'toggle').name('digit2').onFinishChange(redraw);
    march_folder.add(digit3, 'toggle').name('digit3').onFinishChange(redraw);
    march_folder.add(digit4, 'toggle').name('digit4').onFinishChange(redraw);
    march_folder.add(digit5, 'toggle').name('digit5').onFinishChange(redraw);
    march_folder.add(digit6, 'toggle').name('digit6').onFinishChange(redraw);
    march_folder.add(digit7, 'toggle').name('digit7').onFinishChange(redraw);

    var display_toggle = {toggle: false};
    march_folder.add(display_toggle, 'toggle').name('display Test Box').onFinishChange(redraw);

    function redraw(){
        bitlist=[digit0.toggle,digit1.toggle,digit2.toggle,digit3.toggle,digit4.toggle,digit5.toggle,digit6.toggle,digit7.toggle];
        display_toggle .toggle = true;
        console.log(bitlist);
        if (display_toggle.toggle){
            marchCube(input_scene,bitlist);
        }
    }
    redraw();

}


function marchCube(input_scene,input_bitlist){
    //scene.clear();
    CubeMeSH.forEach(element => {input_scene.remove(element);});
    ConstructUnit(input_bitlist,input_scene,CubeMeSH);
    console.log("Cube mesh info",CubeMeSH);
}