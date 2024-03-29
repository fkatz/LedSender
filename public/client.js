const throttle = (func, limit) => {
    let inThrottle
    return function () {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}
//var isTouching = new Vue({data: {touch:false}});    
var isTouching = false;
document.addEventListener("keydown", () => isTouching = true);
document.addEventListener("keyup", () => setTimeout(() => isTouching = false), 500);
document.addEventListener("mousedown", () => isTouching = true);
document.addEventListener("mouseup", () => setTimeout(() => isTouching = false), 500);
document.addEventListener("touchstart", () => isTouching = true);
document.addEventListener("touchend", () => setTimeout(() => isTouching = false), 500);
document.addEventListener("touchcancel", () => setTimeout(() => isTouching = false), 500);
document.addEventListener("change", () => {
    console.log("input");
    isTouching = true;
    setTimeout(() => isTouching = false, 500);
});
state = {
    color: {
        hsv: []
    },
    rainbow: {
    },
    pulse: {

    },
    audio: {

    }
};
var color = new Vue({
    el: '#colorController',
    data: {
        hue: 0.5,
        sat: 1,
        val: 1
    },
    watch: {
        hue() { emit() },
        sat() { emit() },
        val() { emit() },
    }
});
var rainbow = new Vue({
    el: '#rainbowController',
    data: {
        state: true,
        step: 0.01,
        ms: 10
    },
    watch: {
        state() { emit() },
        step() { emit() },
        ms() { emit() }
    }
});
var pulse = new Vue({
    el: '#pulseController',
    data: {
        state: true,
        step: 0.01,
        ms: 10,
        minValue: 0.2
    },
    watch: {
        state() { emit() },
        step() { emit() },
        ms() { emit() },
        minValue() { emit() }
    }
});
var audio = new Vue({
    el: '#audioController',
    data: {
        state: true,
        freq: 0,
        spectrum: [],
        minValue: 0.2
    },
    watch: {
        state() { emit() },
        freq() { emit() },
        minValue() { emit() },
        spectrum() { drawSpectrum(this.$refs.spectrum, this.spectrum, this.freq) }
    }
});
satElement = document.getElementById("sat");
valElement = document.getElementById("val");
function emit() {
    document.body.style.setProperty("--color", toHex(color.hue, color.sat, color.val));
    valElement.style.setProperty("--color", toHex(color.hue, color.sat, 1));
    satElement.style.setProperty("--hue", toHex(color.hue, 1, 1));
    satElement.style.setProperty("--desat", toHex(color.hue, 0, color.val));

    state.color.hsv[0] = color.hue;
    state.color.hsv[1] = color.sat;
    state.color.hsv[2] = color.val;

    state.rainbow.state = rainbow.state;
    state.rainbow.ms = rainbow.ms;
    state.rainbow.step = rainbow.step;

    state.pulse.state = pulse.state;
    state.pulse.ms = pulse.ms;
    state.pulse.step = pulse.step;
    state.pulse.minValue = pulse.minValue;

    state.audio.state = audio.state;
    state.audio.freq = audio.freq;
    state.audio.minValue = audio.minValue;


    if (isTouching) {
        console.log("Sent:")
        console.log(state);
        socket.emit("ledStrip1", JSON.stringify(state));
    }
}
socket.on('ledStrip1', function (msg) {
    let newState = JSON.parse(msg);
    //console.log("Recieved:")
    console.log(newState);

    if (newState.color != undefined) {
        color.hue = newState.color.h;
        color.sat = newState.color.s;
        color.val = newState.color.v;
    }
    if (newState.rainbow != undefined) {
        rainbow.state = newState.rainbow.state;
        rainbow.ms = newState.rainbow.ms;
        rainbow.step = newState.rainbow.step;
    }
    if (newState.pulse != undefined) {
        pulse.state = newState.pulse.state;
        pulse.ms = newState.pulse.ms;
        pulse.step = newState.pulse.step;
        pulse.minValue = newState.pulse.minValue;
    }
    if (newState.audio != undefined) {
        audio.state = newState.audio.state;
        audio.freq = newState.audio.freq;
        audio.spectrum = newState.audio.spectrum;
        audio.minValue = newState.audio.minValue;
    }

});
function toHex(h, s, v) {
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default: r = v, g = p, b = q; break;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    var hex = "#";
    var r = r.toString(16);
    if (r.length < 2) r = "0" + r;
    var g = g.toString(16);
    if (g.length < 2) g = "0" + g;
    var b = b.toString(16);
    if (b.length < 2) b = "0" + b;
    hex += r + g + b;
    return hex;
}

function drawSpectrum(canvas, spectrum, freq) {
    ctx = canvas.getContext("2d");
    width = canvas.width / spectrum.length;
    height = canvas.height;
    let color = getComputedStyle(document.body).getPropertyValue('--color');
    ctx.fillStyle = color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < spectrum.length; i++) {
        //ctx.fillRect(0,0,100,100)
        //console.log({width: Math.floor(width*i), height: height, withF:Math.floor(width*(i+1)),heightf: (Math.floor(height*spectrum[i]))})
        ctx.fillRect(width * i, height, width, -height * spectrum[i]);
    }
}