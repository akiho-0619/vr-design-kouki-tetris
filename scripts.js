import { init } from "@masabando/easy-three";
const { camera, create, animate, controls, load, helper, THREE, event } = init();

const CUBE_SIZE = 0.2;
const SHADOW_CUBE_SIZE = 0.1;
let dropStage = 0;
const drop_delays = [0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.1];
const minos = ["O", "I", "L", "J", "S", "Z", "T"];
let drops = shuffle(minos);
let sumDelays = 0;

let dropingMino = null;//drops.shift();
let droping = null;


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
const COLORS = ["#ffde0a", "#00ddfa", "#0020f0", "#f07400", "#93f500", "#f52500", "#c505ff"];
const MINO_OFFSET = {
    "O":[[0,0],[1,0],[0,1],[1,1]],
    "I":[[0,0],[0,1],[0,2],[0,3]],
    "L":[[0,0],[0,1],[0,2],[1,0]],
    "J":[[0,0],[0,1],[0,2],[-1,0]],
    "S":[[0,0],[1,1],[0,1],[-1,0]],
    "Z":[[0,0],[-1,1],[0,1],[1,0]],
    "T":[[0,0],[-1,0],[0,1],[1,0]],
}

// player's board  
for (let j=0; j<20; j++){
    for (let i=0; i<10; i++){
        create.cube({
            position:[-3 + i*CUBE_SIZE, -1.5 + j*CUBE_SIZE, 0],
            size:SHADOW_CUBE_SIZE,
            option:{color: COLORS[(20*j + i) % COLORS.length]},
        });
    }
}

// opponent's board
for (let j=0; j<20; j++){
    for (let i=0; i<10; i++){
        create.cube({
            position:[3 - i*CUBE_SIZE, -1.5 + j*0.2, 0],
            size:SHADOW_CUBE_SIZE,
            option:{color: COLORS[(20*j + i) % COLORS.length]},
            // rotation
        });
    }
}

function createDropMino(type){
    let mino;
    switch(type){
        case "O":
            mino = create.group({position: [-2, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[0]}}),
                    create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[0]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[0]}}),
                    create.cube({position:[CUBE_SIZE, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[0]}}),
                ],
            });
            break;

        case "I":
            mino = create.group({position: [-1.5, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[1]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[1]}}),
                    create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[1]}}),
                    create.cube({position:[0, 3*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[1]}}),
                ],
            });
            break;

        case "L":
            mino = create.group({position: [-1, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[2]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[2]}}),
                    create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[2]}}),
                    create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[2]}}),
                ],
            });
            break;

        case "J":
            mino = create.group({position: [0, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[3]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[3]}}),
                    create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[3]}}),
                    create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[3]}}),
                ],
            });
            break;
        
        case "S":
            mino = create.group({position: [0.5, 0, 1],
                children:[
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[4]}}),
                    create.cube({position:[CUBE_SIZE,CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[4]}}),
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[4]}}),
                    create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[4]}}),
                ],
            });
            break;

        case "Z":
            mino = create.group({position: [1.5, 0, 1],
                children:[
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[5]}}),
                    create.cube({position:[-CUBE_SIZE,CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[5]}}),
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[5]}}),
                    create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[5]}}),
                ],
            });
            break;

        case "T":
            mino = create.group({position: [2.5, 0, 1],
            children:[
                create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[6]}}),
                create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[6]}}),
                create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[6]}}),
                create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[6]}}),
            ],
        });
        break;

    }
    return mino;
}

function placeMino(mino, rotate, boardX, boardY, board){
    const STANDARD_X = Math.round((3 + boardX) / CUBE_SIZE);
    const STANDARD_Y = Math.round((1.5 + boardY) / CUBE_SIZE);
    const ROTATE_NUM = Math.round(rotate / (Math.PI / 2))%4; 
    board[STANDARD_Y][STANDARD_X] = 1;
    console.log(`Placing mino ${mino} at (${STANDARD_X}, ${STANDARD_Y}) rotated ${ROTATE_NUM} times`);
    console.log(STANDARD_Y + MINO_OFFSET[mino][1][1], STANDARD_X + MINO_OFFSET[mino][1][0])
    switch (ROTATE_NUM){
        case 0:
            for (let i = 1; i < 4; i++){
                board[STANDARD_Y + MINO_OFFSET[mino][i][1]][STANDARD_X + MINO_OFFSET[mino][i][0]] = 1;
            }
            break;
        case 1:
            for (let i = 1; i < 4; i++){
                board[STANDARD_Y + MINO_OFFSET[mino][i][0]][STANDARD_X - MINO_OFFSET[mino][i][1]] = 1;
            }
            break;
        case 2:
            for (let i = 1; i < 4; i++){
                board[STANDARD_Y - MINO_OFFSET[mino][i][1]][STANDARD_X - MINO_OFFSET[mino][i][0]] = 1;
            }
            break;
        case 3:
            for (let i = 1; i < 4; i++){
                board[STANDARD_Y - MINO_OFFSET[mino][i][0]][STANDARD_X + MINO_OFFSET[mino][i][1]] = 1;
            }
            break;
    }

    console.log([...board].reverse().map(row => row.join(" ")).join("\n"));
    /*

    ## # #   #  ## ##   #
    O# # #   # #O   O# #O#
       # O# #O
       O

    S
    -1, 0  0, +1  +1, +1
    +1, 0  0, +1  +1, -1
    +1, 0  0, -1  -1, -1
    -1, 0  0, -1  -1, +1
    */
    return board;
}

animate(({delta, time})=>{
    if (dropingMino == null){
        droping = drops.shift();
        dropingMino = createDropMino(droping);
        dropingMino.position.set(-2.2, 2.3, 0);

        if (drops.length == 0){
            drops = shuffle(minos);
        }
    }
    sumDelays += delta;
    if (sumDelays > drop_delays[dropStage]) {   //時間経過の落下
        if (dropingMino.position.y > -1.5) {
           dropingMino.position.y -= 0.2;
        } else {
            // place the mino on the board
            playersBoard = placeMino(droping, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard);
            dropingMino = null;
        }
        sumDelays %= drop_delays[dropStage];
    }
})

function shuffle(array) {
    let return_array = array.slice();
    for (let i = return_array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [return_array[i], return_array[j]] = [return_array[j], return_array[i]];
    }
    return return_array;
}

event.key.add((key, e) => {
    switch(key){
        case "a":   // to left
            dropingMino.position.x += -CUBE_SIZE;
            dropingMino.position.x = Math.max(dropingMino.position.x, -3);
            break;

        case "d":   // to right
            dropingMino.position.x += CUBE_SIZE;
            dropingMino.position.x = Math.min(dropingMino.position.x, -3 + 9*CUBE_SIZE);
            break;

        case "s":   // soft drop
            if (dropingMino.position.y > -1.5) {
                dropingMino.position.y -= 0.2;
            } else if (dropingMino != null) {
                // place the mino on the board
                playersBoard = placeMino(droping, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard);
                dropingMino = null;
            }
            sumDelays %= drop_delays[dropStage];
            break;

        case "q":   // rotate left
            dropingMino.rotation.z += Math.PI / 2;
            break;

        case "e":   // rotate right
            dropingMino.rotation.z += -Math.PI / 2;
            break;

        case "w":  // hard drop
            a+1;
    }
});

//https://www.ktc.ac.jp/img/motion/
//https://www.ktc.ac.jp/3D/