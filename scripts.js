import { init } from "@masabando/easy-three";
const { camera, create, animate, controls, load, helper, THREE } = init();

const CUBE_SIZE = 0.2;
const minos = ["O", "I", "L", "J", "S", "Z", "T"];
let drops = shuffle(minos);

let droping = drops.shift();


let playersBoard = Array(20).fill().map(() => Array(10).fill(0));
let opponentBoard = Array(20).fill().map(() => Array(10).fill(0));

controls.connect()
camera.position.set(0, 2, 4)
create.ambientLight(
    { intensity:2}
)
create.directionalLight()
helper.axes();
// OILJSZT
const colors = ["#ffde0a", "#00ddfa", "#0020f0", "#f07400", "#93f500", "#f52500", "#c505ff"];


const dropMinos = {
    "O":create.group({position: [-2, 0, 1],
        children:[
            create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: colors[0]}}),
            create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: colors[0]}}),
            create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[0]}}),
            create.cube({position:[CUBE_SIZE, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[0]}}),
        ],
    }),

    "I":create.group({position: [-1.5, 0, 1],
        children:[
            create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: colors[1]}}),
            create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[1]}}),
            create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[1]}}),
            create.cube({position:[0, 3*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[1]}}),
        ],
    }),

    "L":create.group({position: [-1, 0, 1],
        children:[
            create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: colors[2]}}),
            create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[2]}}),
            create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[2]}}),
            create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: colors[2]}}),
        ],
    }),

    "J":create.group({position: [0, 0, 1],
        children:[
            create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: colors[3]}}),
            create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[3]}}),
            create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[3]}}),
            create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: colors[3]}}),
        ],
    }),
        
    "S":create.group({position: [0.5, 0, 1],
        children:[
            create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[4]}}),
            create.cube({position:[CUBE_SIZE,CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[4]}}),
            create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: colors[4]}}),
            create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: colors[4]}}),
        ],
    }),

    "Z":create.group({position: [1.5, 0, 1],
        children:[
            create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[5]}}),
            create.cube({position:[-CUBE_SIZE,CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[5]}}),
            create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: colors[5]}}),
            create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: colors[5]}}),
        ],
    }),

    "T":create.group({position: [2.5, 0, 1],
        children:[
            create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: colors[6]}}),
            create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: colors[6]}}),
            create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: colors[6]}}),
            create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: colors[6]}}),
        ],
    }),
};

// player's board  
for (let j=0; j<20; j++){
    for (let i=0; i<10; i++){
        create.cube({
            position:[-3 + i*CUBE_SIZE, -1.5 + j*0.2, 0],
            size:CUBE_SIZE,
            option:{color: colors[(20*j + i) % colors.length]},
        });
    }
}

// opponent's board
for (let j=0; j<20; j++){
    for (let i=0; i<10; i++){
        create.cube({
            position:[3 - i*CUBE_SIZE, -1.5 + j*0.2, 0],
            size:CUBE_SIZE,
            option:{color: colors[(20*j + i) % colors.length]},
        });
    }
}
animate(({delta, time})=>{

})

function shuffle(array) {
    let return_array = array.slice();
    for (let i = return_array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [return_array[i], return_array[j]] = [return_array[j], return_array[i]];
    }
    return return_array;
}

//ktc.ac.jp/img/motion/
//https://www.ktc.ac.jp/3D/