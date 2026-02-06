import { init } from "@masabando/easy-three";
const { camera, create, animate, controls, load, helper, THREE, event } = init();

const CUBE_SIZE = 0.2;
const SHADOW_CUBE_SIZE = 0.1;
let dropStage = 0;
const drop_delays = [0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.1];
const minos = ["O", "I", "L", "J", "S", "Z", "T"];
let drops = shuffle(minos);
let sumDelays = 0;

let is_holded = false;

let droping = null;
let dropingMino = null;
let holding = null;
let holdingMino = null;

let playersBoard = Array(23).fill().map(() => Array(10).fill(0));
let opponentBoard = Array(23).fill().map(() => Array(10).fill(0));
let playersBoardMinoes = Array(23).fill().map(() => Array(10).fill(null));
let opponentBoardMinoes = Array(23).fill().map(() => Array(10).fill(null));
let gamePhase = "playing"; // "playing", "gameover"

let gameover_text;
// gameover_text.visible = false;

controls.connect()
camera.position.set(0, 2, 4)
create.ambientLight(
    { intensity:2}
)
create.directionalLight()
helper.axes();
// OILJSZT
const COLORS = {"O":"#ffde0a", "I":"#00ddfa", "L":"#0020f0", "J":"#f07400", "S":"#93f500", "Z":"#f52500", "T":"#c505ff"};
const MINO_OFFSET = {
    "O":[[0,0],[1,0],[0,1],[1,1]],
    "I":[[0,0],[0,1],[0,2],[0,3]],
    "L":[[0,0],[0,1],[0,2],[1,0]],
    "J":[[0,0],[0,1],[0,2],[-1,0]],
    "S":[[0,0],[1,1],[0,1],[-1,0]],
    "Z":[[0,0],[-1,1],[0,1],[1,0]],
    "T":[[0,0],[-1,0],[0,1],[1,0]],
}
const hold_y = {"O":1.7, "I":1.3, "L":1.5, "J":1.5, "S":1.7, "Z":1.7, "T":1.7};

const hold_text = create.text("hold",{
    size:2,
    position: [-3.5, 2.2, 0],
    fontSize:30,
});

// 要望：オブジェクトを削除するチュートリアルが欲しいです
function removeObject(object) {
    if (object.parent) {
        object.parent.remove(object); // シーンから削除
    }

    // ジオメトリとマテリアルを破棄
    if (object.geometry) {
        object.geometry.dispose();
    }
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
        } else {
            object.material.dispose();
        }
    }
}

// player's board  
for (let j=0; j<20; j++){
    for (let i=0; i<10; i++){
        create.cube({
            position:[-3 + i*CUBE_SIZE, -1.5 + j*CUBE_SIZE, 0],
            size:SHADOW_CUBE_SIZE,
            option:{color: (20*j + i) % 2 == 0 ? "#999999" : "#cccccc"},
        });
    }
}

// opponent's board
for (let j=0; j<20; j++){
    for (let i=0; i<10; i++){
        create.cube({
            position:[3 - i*CUBE_SIZE, -1.5 + j*0.2, 0],
            size:SHADOW_CUBE_SIZE,
            option:{color: (20*j + i) % 2 == 0 ? "#999999" : "#cccccc"},
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
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[CUBE_SIZE, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                ],
            });
            break;

        case "I":
            mino = create.group({position: [-1.5, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, 3*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                ],
            });
            break;

        case "L":
            mino = create.group({position: [-1, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                ],
            });
            break;

        case "J":
            mino = create.group({position: [0, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, 2*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                ],
            });
            break;
        
        case "S":
            mino = create.group({position: [0.5, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[CUBE_SIZE,CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                ],
            });
            break;

        case "Z":
            mino = create.group({position: [1.5, 0, 1],
                children:[
                    create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[-CUBE_SIZE,CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                    create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                ],
            });
            break;

        case "T":
            mino = create.group({position: [2.5, 0, 1],
            children:[
                create.cube({position:[0, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                create.cube({position:[-CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                create.cube({position:[0, CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
                create.cube({position:[CUBE_SIZE, 0, 0], size:CUBE_SIZE, option:{color: COLORS[type]}}),
            ],
        });
        break;

    }
    return mino;
}

function endGame(board){
    if (board[20].some(cell => cell == 1)){
        return true;
    }
    return false;
}

function placeMino(mino, minos, rotate, boardX, boardY, board, boardMinoes){
    const STANDARD_X = Math.round((3 + boardX) / CUBE_SIZE);
    const STANDARD_Y = Math.round((1.5 + boardY) / CUBE_SIZE);
    let ROTATE_NUM = Math.round(rotate / (Math.PI / 2))%4; 
    if (ROTATE_NUM < 0) {
        ROTATE_NUM += 4;
    }

    board[STANDARD_Y][STANDARD_X] = 1;
    // console.log(`Placing mino ${mino} at (${STANDARD_X}, ${STANDARD_Y}) rotated ${ROTATE_NUM} times`);
    // console.log(STANDARD_Y + MINO_OFFSET[mino][1][1], STANDARD_X + MINO_OFFSET[mino][1][0])
    // console.log(minos.children);
    switch (ROTATE_NUM){
        case 0:
            for (let i = 0; i < 4; i++){
                board[STANDARD_Y + MINO_OFFSET[mino][i][1]][STANDARD_X + MINO_OFFSET[mino][i][0]] = 1;
                boardMinoes[STANDARD_Y + MINO_OFFSET[mino][i][1]][STANDARD_X + MINO_OFFSET[mino][i][0]] = create.cube({position:[-3 + (STANDARD_X + MINO_OFFSET[mino][i][0])*CUBE_SIZE, -1.5 + (STANDARD_Y + MINO_OFFSET[mino][i][1])*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[mino]}});
            }
            break;
        case 1: // rotate to Q
            for (let i = 0; i < 4; i++){
                board[STANDARD_Y + MINO_OFFSET[mino][i][0]][STANDARD_X - MINO_OFFSET[mino][i][1]] = 1;
                boardMinoes[STANDARD_Y + MINO_OFFSET[mino][i][0]][STANDARD_X - MINO_OFFSET[mino][i][1]] = create.cube({position:[-3 + (STANDARD_X - MINO_OFFSET[mino][i][1])*CUBE_SIZE, -1.5 + (STANDARD_Y + MINO_OFFSET[mino][i][0])*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[mino]}});
            }
            break;
        case 2:
            for (let i = 0; i < 4; i++){
                board[STANDARD_Y - MINO_OFFSET[mino][i][1]][STANDARD_X - MINO_OFFSET[mino][i][0]] = 1;
                boardMinoes[STANDARD_Y - MINO_OFFSET[mino][i][1]][STANDARD_X - MINO_OFFSET[mino][i][0]] = create.cube({position:[-3 + (STANDARD_X - MINO_OFFSET[mino][i][0])*CUBE_SIZE, -1.5 + (STANDARD_Y - MINO_OFFSET[mino][i][1])*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[mino]}});
            }
            break;
        case 3:
            for (let i = 0; i < 4; i++){
                board[STANDARD_Y - MINO_OFFSET[mino][i][0]][STANDARD_X + MINO_OFFSET[mino][i][1]] = 1;
                boardMinoes[STANDARD_Y - MINO_OFFSET[mino][i][0]][STANDARD_X + MINO_OFFSET[mino][i][1]] = create.cube({position:[-3 + (STANDARD_X + MINO_OFFSET[mino][i][1])*CUBE_SIZE, -1.5 + (STANDARD_Y - MINO_OFFSET[mino][i][0])*CUBE_SIZE, 0], size:CUBE_SIZE, option:{color: COLORS[mino]}});
            }
            break;
    }
    // console.log(minos.children);
    // for (let i=0; i<4; i++){
    //     removeObject(minos.children[i]);
    // }
    removeObject(minos);
    // console.log([...board].reverse().map(row => row.join(" ")).join("\n"));

    return board, boardMinoes;
}

function canDropMino(mino, rotate, boardX, boardY, board){
    const STANDARD_X = Math.round((3 + boardX) / CUBE_SIZE);
    const STANDARD_Y = Math.round((1.5 + boardY) / CUBE_SIZE);
    let ROTATE_NUM = Math.round(rotate / (Math.PI / 2)) % 4;
    if (ROTATE_NUM < 0) {
        ROTATE_NUM += 4;
    }
    let isCanDrop = true;

    try{
        switch (ROTATE_NUM) {
            case 0:
                for (let i = 0; i < 4; i++) {
                    if (board[STANDARD_Y + MINO_OFFSET[mino][i][1]-1][STANDARD_X + MINO_OFFSET[mino][i][0]] == 1) {
                        isCanDrop = false;
                        break;
                    }
                }
                break;
            case 1:
                for (let i = 0; i < 4; i++) {
                    if (board[STANDARD_Y + MINO_OFFSET[mino][i][0]-1][STANDARD_X - MINO_OFFSET[mino][i][1]] == 1) {
                        isCanDrop = false;
                        break;
                    }
                }
                break;
            case 2:
                for (let i = 0; i < 4; i++) {
                    if (board[STANDARD_Y - MINO_OFFSET[mino][i][1]-1][STANDARD_X - MINO_OFFSET[mino][i][0]] == 1) {
                        isCanDrop = false;
                        break;
                    }
                }
                break;
            case 3:
                for (let i = 0; i < 4; i++) {
                    if (board[STANDARD_Y - MINO_OFFSET[mino][i][0]-1][STANDARD_X + MINO_OFFSET[mino][i][1]] == 1) {
                        isCanDrop = false;
                        break;
                    }
                }
                break;
        }
    }catch (e){
        isCanDrop = false;
    }
    return isCanDrop;
}

function isAliggned(board, boardMinoes){
    for (let i = 19; i >= 0; i--){
        if (board[i].every(cell => cell == 1)){
            board.splice(i, 1);
            board.push(Array(10).fill(0));

            for (let j = 0; j < 10; j++){
                boardMinoes[i][j].scale.set(0, 0, 0);
            }
            for (let j = i; j < 22; j++){
                for (let k = 0; k < 10; k++){
                    if (boardMinoes[j][k] != null){
                        boardMinoes[j][k].position.y -= CUBE_SIZE;
                        boardMinoes[j][k] = boardMinoes[j+1][k];
                    }
                    boardMinoes[j][k] = boardMinoes[j+1][k];
                }
            }
            // boardMinoes.splice(i, 1);
            // boardMinoes.push(Array(10).fill(null));
        }
    }
}

function calcStandardFromStandard(mino, rotate){
    let return_array = [0, 0];
    let ROTATE_NUM = Math.round(rotate / (Math.PI / 2)) % 4;
    if (ROTATE_NUM < 0) {
        ROTATE_NUM += 4;
    }
    switch (ROTATE_NUM) {
        case 0:
            for (let i = 1; i < 4; i++){
                return_array[0] = Math.min(return_array[0], MINO_OFFSET[mino][i][0]);
                return_array[1] = Math.max(return_array[1], MINO_OFFSET[mino][i][0]);
            }
            break;

        case 1:
            for (let i = 1; i < 4; i++){
                return_array[0] = Math.min(return_array[0], -MINO_OFFSET[mino][i][1]);
                return_array[1] = Math.max(return_array[1], -MINO_OFFSET[mino][i][1]);
            }
            break;

        case 2:
            for (let i = 1; i < 4; i++) {
                return_array[0] = Math.min(return_array[0], -MINO_OFFSET[mino][i][0]);
                return_array[1] = Math.max(return_array[1], -MINO_OFFSET[mino][i][0]);
            }
            break;

        case 3:
            for (let i = 1; i < 4; i++) {
                return_array[0] = Math.min(return_array[0], MINO_OFFSET[mino][i][1]);
                return_array[1] = Math.max(return_array[1], MINO_OFFSET[mino][i][1]);
            }
            break;
    }
    return return_array;
}

animate(({delta, time})=>{
    if (gamePhase == "playing"){
        if (dropingMino == null){
            droping = drops.shift();
            dropingMino = createDropMino(droping);
            dropingMino.position.set(-2.2, 2.3, 0);

            if (drops.length < 4){
                drops = drops.concat(shuffle(minos));
            }
            // console.log(drops);
        }
        sumDelays += delta;
        if (sumDelays > drop_delays[dropStage]) {   //時間経過の落下
            if (dropingMino.position.y > -1.5 && canDropMino(droping, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard)) {
                dropingMino.position.y -= 0.2;
            } else {
                // place the mino on the board
                // console.log(dropingMino.children);
                playersBoard, playersBoardMinoes = placeMino(droping, dropingMino, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard, playersBoardMinoes);
                is_holded = false;
                isAliggned(playersBoard, playersBoardMinoes);
                if (endGame(playersBoard)){
                    gamePhase = "gameover";
                    gameover_text = create.text("Game Over",{
                        size:[5.5, 1], // size:[5.5, 1],
                        position: [0, 0, 1],
                        fontSize:100,
                        color: "#ff0000",
                    });
                    



                }
                dropingMino = null;
            }
            sumDelays %= drop_delays[dropStage];
        }
    }else if (gamePhase == "gameover"){
        // gameover_text.rotation.x += Math.sin(delta) * 0.2;
        // gameover_text.rotation.y += Math.cos(delta) * 0.2;
        // gameover_text.rotation.z.lerp(Math.PI * 2, 0.01);
        if (gameover_text){
            gameover_text.position.lerp(new THREE.Vector3(0, Math.cos(time) + delta, 1), delta);
        }

    }
});

function shuffle(array) {
    let return_array = array.slice();
    for (let i = return_array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [return_array[i], return_array[j]] = [return_array[j], return_array[i]];
    }
    return return_array;
}

event.key.add((key, e) => {
    // console.log(`Key ${key} is pressed`);
    if (gamePhase != "playing") {
        return;
    }
    let dist = calcStandardFromStandard(droping, dropingMino.rotation.z);
    const STANDARD_X = Math.round((3 + dropingMino.position.x) / CUBE_SIZE);
    switch(key){
        case "a":   // to left
            if (STANDARD_X + dist[0] - 1 >= 0){
                dropingMino.position.x += -CUBE_SIZE;
            }
            // dropingMino.position.x = Math.max(dropingMino.position.x + dist[0] * CUBE_SIZE, -3);
            
            break;

        case "d":   // to right
            if (STANDARD_X + dist[1] + 1 < 10){
                dropingMino.position.x += CUBE_SIZE;
            }
            // dropingMino.position.x = Math.min(dropingMino.position.x - dist[1] * CUBE_SIZE, -1.2);
            break;

        case "s":   // soft drop
            sumDelays = 0;
            // if (dropingMino.position.y > -1.5 && canDropMino(droping, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard)) {
            if (canDropMino(droping, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard)) {
                dropingMino.position.y -= 0.2;
            } else if (dropingMino != null) {
                // place the mino on the board
                playersBoard, playersBoardMinoes = placeMino(droping, dropingMino, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard, playersBoardMinoes);
                is_holded = false;
                isAliggned(playersBoard, playersBoardMinoes);
                if (endGame(playersBoard)){
                    gamePhase = "gameover";
                    gameover_text = create.text("Game Over",{
                        size:[5.5, 1], // size:[5.5, 1],
                        position: [0, 0, 1],
                        fontSize:100,
                        color: "#ff0000",
                    });
                    





                }
                dropingMino = null;
            }
            sumDelays %= drop_delays[dropStage];
            break;

        case "q":   // rotate left
            dropingMino.rotation.z += Math.PI / 2;
            dist = calcStandardFromStandard(droping, dropingMino.rotation.z);
            if (STANDARD_X + dist[0] - 1 >= 0){
                // dropingMino.position.x += CUBE_SIZE;

            }
            // dropingMino.position.x = Math.max(dropingMino.position.x + dist[0] * CUBE_SIZE, -3);
            break;

        case "e":   // rotate right
            dropingMino.rotation.z += -Math.PI / 2;
            dist = calcStandardFromStandard(droping, dropingMino.rotation.z);
            if (STANDARD_X + dist[1] + 1 < 10){
            //     dropingMino.position.x += CUBE_SIZE;
            }
            // dropingMino.position.x = Math.min(dropingMino.position.x - dist[1] * CUBE_SIZE, -1.2);
            break;

        case "w":  // hard drop
            while (true){
                if (canDropMino(droping, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard)) {
                    dropingMino.position.y -= 0.2;
                } else if (dropingMino != null) {
                    // place the mino on the board
                    playersBoard, playersBoardMinoes = placeMino(droping, dropingMino, dropingMino.rotation.z, dropingMino.position.x, dropingMino.position.y, playersBoard, playersBoardMinoes);
                    is_holded = false;
                    isAliggned(playersBoard, playersBoardMinoes);
                    if (endGame(playersBoard)){
                        gamePhase = "gameover";
                        gameover_text = create.text("Game Over",{
                            size:[5.5, 1], // size:[5.5, 1],
                            position: [0, 0, 1],
                            fontSize:100,
                            color: "#ff0000",
                        });
                    }
                    dropingMino = null;
                    break;
                }
                sumDelays %= drop_delays[dropStage];
            }
            break;

        case "r":  // hold
        if (is_holded) break;
            let temp, tempMino;
            if (holdingMino == null){
                holding = droping;
                holdingMino = dropingMino;

                dropingMino = null;
            }
            else {
                temp = holding;
                tempMino = holdingMino;
                holding = droping;
                holdingMino = dropingMino;
                droping = temp;
                dropingMino = tempMino;

                dropingMino.position.set(-2.2, 2.3, 0);
            }

            holdingMino.position.set(-3.5, hold_y[holding], 0);
            holdingMino.rotation.set(0, 0, 0);
            is_holded = true;
            break;
    }
});

//https://www.ktc.ac.jp/img/motion/
//https://www.ktc.ac.jp/3D/