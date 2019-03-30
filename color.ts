interface Hex{
    fromHex:(string)=>any;
    toHex:(any)=>string;
}
export class RGBColor implements Hex{
    fromRGB(r:number,g:number,b:number){
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }
    fromRGBColor(value:RGBColor){
        this.r = value.r;
        this.g = value.g;
        this.b = value.b;
        return this;
    }
    fromHSVColor(value:HSVColor){
            var r, g, b;
          
            var i = Math.floor(value.h * 6);
            var f = value.h * 6 - i;
            var p = value.v * (1 - value.s);
            var q = value.v * (1 - f * value.s);
            var t = value.v * (1 - (1 - f) * value.s);
          
            switch (i % 6) {
              case 0: r = value.v, g = t, b = p; break;
              case 1: r = q, g = value.v, b = p; break;
              case 2: r = p, g = value.v, b = t; break;
              case 3: r = p, g = q, b = value.v; break;
              case 4: r = t, g = p, b = value.v; break;
              case 5: r = value.v, g = p, b = q; break;
            }
            this.r = Math.round(r*255);
            this.g = Math.round(g*255);
            this.b = Math.round(b*255);
            return this;
    }
    fromHex(hex:string){
        this.r = parseInt("0x"+hex.substr(1,2));
        this.g = parseInt("0x"+hex.substr(3,2));
        this.b = parseInt("0x"+hex.substr(5,2));
        return this;
    }
    toHex():string{
        var hex:string ="#";
        var r:string = this.r.toString(16);
        if(r.length<2) r = "0"+r;
        var g:string = this.g.toString(16);
        if(g.length<2) g = "0"+g;
        var b:string = this.b.toString(16);
        if(b.length<2) b = "0"+b;
        hex+=r+g+b;
        return hex;
    }
    r:number = 255;
    g:number = 255;
    b:number = 255;
}
export class HSVColor implements Hex{
    fromHSV(h:number,s:number,v:number){
        this.h = h;
        this.s = s;
        this.v = v;
        return this;
    }
    fromHSVColor(value:HSVColor){
        this.h = value.h;
        this.s = value.s;
        this.v = value.v;
        return this;
    }
    fromRGBColor(value:RGBColor){
            value = (new RGBColor).fromRGBColor(value);
            value.r /= 255, value.g /= 255, value.b /= 255;
          
            var max = Math.max(value.r, value.g, value.b), min = Math.min(value.r, value.g, value.b);
            var h, s, v = max;
          
            var d = max - min;
            s = max == 0 ? 0 : d / max;
          
            if (max == min) {
              h = 0; // achromatic
            } else {
              switch (max) {
                case value.r: h = (value.g - value.b) / d + (value.g < value.b ? 6 : 0); break;
                case value.g: h = (value.b - value.r) / d + 2; break;
                case value.b: h = (value.r - value.g) / d + 4; break;
              }
          
              h /= 6;
            }
            this.h = h;
            this.s = s;
            this.v = v;
            return this;
    }
    fromHex(hex:string){
        var rgb = (new RGBColor).fromHex(hex);
        return this.fromRGBColor(rgb);
    }
    toHex():string{
        var rgb= (new RGBColor).fromHSVColor(this);
        return rgb.toHex();
    }
    h:number = 0;
    s:number = 1;
    v:number = 1;
}
export class ColorState {
    color:RGBColor = new RGBColor();
    dim:number = 1;
}