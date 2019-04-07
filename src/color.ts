export interface RGB {
    r: number;
    g: number;
    b: number;
}
export interface HSV {
    h: number;
    s: number;
    v: number;
}
export class Color {
    fromHSVValues(h: number, s: number, v: number) {
        this.h = Number(h);
        this.s = Number(s);
        this.v = Number(v);
        return this;
    }
    fromHSV(value: HSV) {
        return this.fromHSVValues(value.h, value.s, value.v);
    }
    fromColor(value: Color) {
        this.fromHSV(value.toHSV());
        return this;
    }
    fromRGBValues(r: number, g: number, b: number) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }
        this.h = h;
        this.s = s;
        this.v = v;
        return this;
    }
    fromRGB(value: RGB) {
        return this.fromRGBValues(value.r, value.g, value.b);
    }
    fromHex(hex: string) {
        var rgb: RGB = <RGB>{};
        rgb.r = parseInt("0x" + hex.substr(1, 2));
        rgb.g = parseInt("0x" + hex.substr(3, 2));
        rgb.b = parseInt("0x" + hex.substr(5, 2));
        this.fromRGB(rgb);
        return this;
    }
    toHex(): string {
        var rgb: RGB = this.toRGB();
        var hex: string = "#";
        var r: string = rgb.r.toString(16);
        if (r.length < 2) r = "0" + r;
        var g: string = rgb.g.toString(16);
        if (g.length < 2) g = "0" + g;
        var b: string = rgb.b.toString(16);
        if (b.length < 2) b = "0" + b;
        hex += r + g + b;
        return hex;
    }
    toRGB(): RGB {
        var r, g, b;
        var h = this.h, s = this.s, v = this.v;
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
        var rgb: RGB = <RGB>{};
        rgb.r = Math.round(r * 255);
        rgb.g = Math.round(g * 255);
        rgb.b = Math.round(b * 255);
        return rgb;
    }
    toHSV(): HSV {
        var hsv: HSV = <HSV>{};
        hsv.h = Number(this.h);
        hsv.s = Number(this.s);
        hsv.v = Number(this.v);
        return hsv;
    }
    private h: number = 0;
    private s: number = 1;
    private v: number = 1;
}

