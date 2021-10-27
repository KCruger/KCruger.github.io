
 main();

 function mouseEnter()
 {
     console.log("enter %d, %d", event.clientX, event.clientY);
 }
 function mouseLeave()
 {
     console.log("Leave %d, %d", event.clientX, event.clientY);
 }

 function mouseBegan()
 {
    console.log("began %d, %d", event.clientX, event.clientY);
    mousing = true;
 }
var mousing = false;
 function mouseMoved()
 {
    if(mousing == true)
        console.log("Move %d, %d", event.clientX, event.clientY);
 }

 function mouseEnded()
 {
    if(mousing == true)
    {
        mousing = false;
        console.log("Ended %d, %d", event.clientX, event.clientY);
    }
 
 }

function keyboradDown()
{
    console.log("keyDown %d", event.keyCode);
}
function keyboradUp()
{
    console.log("keyUp %s", event.code);
}

function keyboradPress()
{
    console.log("keyPress %s", event.code);
}

var canvas;


 function main()
 {
    //loading
    canvas = document.getElementById("glCanvas");
    canvas.onmouseenter = mouseEnter;
    canvas.onmouseleave = mouseLeave;
    canvas.onmousedown = mouseBegan;
    canvas.onmousemove = mouseMoved;
    canvas.onmouseup = mouseEnded;

    window.onkeydown = keyboradDown;
    window.onkeyup = keyboradUp;
    window.onkeypress = keyboradPress;
    const gl = canvas.getContext("webgl");
    console.log(gl);


    //삼각형 정점/ 색 -> 버퍼
    //gldrawVertexArray gldrawElement
    const programID = createProgramID(gl);
    console.log("aaaaaaaaaaaaaaaaaa");
    const vbo = createVBO(gl);
    console.log("22222222222222222");
    const vbe = createVBE(gl);
    console.log("33333333333333333");

    drawGame(gl, programID, vbo, vbe);
 }

 function createProgramID(gl)
 {

    //const  strVert = 

    const strVert =  `
    #if GL_ES
    precision highp float;
    #endif

    attribute vec4 position;
    attribute vec4 color;

    varying vec4 vColor;
     
    void main()
    {
        vColor = color;
        gl_Position = position;
    }
    `;
    

     
    const strFrag = `
    #if GL_ES
    precision highp float;
    #endif

    uniform vec4 colorSet;
    varying vec4 vColor;

    void main()
    {
        gl_FragColor = vec4(colorSet.rgb, 1.0);
        //gl_FragColor = vColor;
    }
    `;

    const vertID = createShader( strVert, gl.VERTEX_SHADER, gl);
    const fragID = createShader(strFrag, gl.FRAGMENT_SHADER, gl);
    const id = gl.createProgram();
    gl.attachShader(id, vertID);
    gl.attachShader(id, fragID);
    gl.linkProgram(id);
    gl.detachShader(id, vertID);
    gl.detachShader(id, fragID);
    
    gl.deleteShader(vertID);
    gl.deleteShader(fragID);

    
    var msg = gl.getProgramInfoLog(id);
    if(msg.length > 0)
    {
        alert(msg);
        gl.deleteProgram(id);
    }

    return id;

 }

function createShader(str, flag, gl)
{
    const id = gl.createShader(flag);

    gl.shaderSource(id, str);
    gl.compileShader(id);

    var message = gl.getShaderInfoLog(id);
    if(message.length > 0)
    {
       alert(message);
       gl.deleteShader(id);
    }

    return id;
}

function createVBO(gl)
{
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    var p = [
        -0.5, 0.5, 1,0,0,1,  0.5,0.5,  0,1,0,1,
        -0.5, -0.5, 0,0,1,1, 0.5,-0.5, 1,1,1,1,
     ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
}

function createVBE(gl)
{
    const vbe = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbe);
    var indices = [ 0, 1, 2, 1, 2, 3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int8Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    return vbe;
}

function reShape(gl)
{
    var w = window.innerWidth;
    var h = window.innerHeight;
if(canvas.width != w || canvas.height != h)
{
    canvas.width = w;
    canvas.height = h;

    gl.viewport(0,0,w,h);
}
}

var prevTime = 0;

 function drawGame(gl, programID, vbo, vbe)
 {
    reShape(gl);
   
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
     //to do
    gl.useProgram(programID);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbe);
    const positionAttr = gl.getAttribLocation(programID, "position");
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);


    const colorAttr = gl.getAttribLocation(programID, "color");
    gl.enableVertexAttribArray(colorAttr);
     gl.vertexAttribPointer(colorAttr, 4, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    const uColor = gl.getUniformLocation(programID, "colorSet");
    gl.uniform4fv(uColor, [0.5, 0.5, 0.3, 1.0]);

    gl.drawElements(gl.TRIANGLES, 6,gl.UNSIGNED_BYTE, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(positionAttr);
    gl.disableVertexAttribArray(colorAttr);

    window.requestAnimationFrame(function (currtime) {

        //걸린 시간
        var delta = (currtime - prevTime)/1000.0
        prevTime = currtime;
//        console.log("걸린시간 = %f", delta);

        drawGame(gl, programID, vbo, vbe)
    });
 }
