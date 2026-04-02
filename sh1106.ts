namespace SH1106 {

    export enum I2CAddress {
        Addr_3C = 0x3C,
        Addr_3D = 0x3D
    }

    let buffer = pins.createBuffer(1025)
    let addr = 0x3C
    let initialized = false

    function cmd(c: number) {
        pins.i2cWriteNumber(addr, (0x00 << 8) | c, NumberFormat.UInt16BE)
    }

    export function init(address: I2CAddress) {
        addr = address
        initialized = true

        buffer[0] = 0x40

        cmd(0xAE)
        cmd(0xD5); cmd(0x80)
        cmd(0xA8); cmd(0x3F)
        cmd(0xD3); cmd(0x00)
        cmd(0x40)
        cmd(0xA1)
        cmd(0xC8)
        cmd(0xDA); cmd(0x12)
        cmd(0x81); cmd(0x7F)
        cmd(0xD9); cmd(0x22)
        cmd(0xDB); cmd(0x20)
        cmd(0xA4)
        cmd(0xA6)
        cmd(0xAF)

        clear()
        refresh()
    }

    export function clear() {
        for (let i = 1; i < 1025; i++) buffer[i] = 0
    }

    export function refresh() {
        for (let page = 0; page < 8; page++) {
            cmd(0xB0 + page)
            cmd(0x02)
            cmd(0x10)
            pins.i2cWriteBuffer(addr, buffer.slice(1 + page * 128, 1 + (page + 1) * 128))
        }
    }

    export function drawPixel(x: number, y: number) {
        if (x < 0 || x > 127 || y < 0 || y > 63) return
        let page = y >> 3
        let index = 1 + x + page * 128
        buffer[index] |= (1 << (y & 7))
    }

    export function drawLine(x0: number, y0: number, x1: number, y1: number) {
        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1
        let err = dx + dy

        while (true) {
            drawPixel(x0, y0)
            if (x0 == x1 && y0 == y1) break
            let e2 = 2 * err
            if (e2 >= dy) { err += dy; x0 += sx }
            if (e2 <= dx) { err += dx; y0 += sy }
        }
    }

    export function drawRect(x: number, y: number, w: number, h: number) {
        drawLine(x, y, x + w, y)
        drawLine(x, y, x, y + h)
        drawLine(x + w, y, x + w, y + h)
        drawLine(x, y + h, x + w, y + h)
    }

    export function fillRect(x: number, y: number, w: number, h: number) {
        for (let i = 0; i < h; i++) {
            drawLine(x, y + i, x + w, y + i)
        }
    }

    export function print(x: number, y: number, text: string) {
        for (let i = 0; i < text.length; i++) {
            drawChar(x + i * 6, y, text.charCodeAt(i))
        }
    }

    function drawChar(x: number, y: number, c: number) {
        if (c < 32 || c > 127) return
        let f = font[c - 32]
        for (let col = 0; col < 5; col++) {
            let line = f[col]
            for (let row = 0; row < 7; row++) {
                if (line & (1 << row)) drawPixel(x + col, y + row)
            }
        }
    }

    const font: number[][] = [
        [0,0,0,0,0],[0,0,95,0,0],[0,7,0,7,0],[20,127,20,127,20],
        [36,42,127,42,18],[35,19,8,100,98],[54,73,85,34,80],[0,5,3,0,0],
        [0,28,34,65,0],[0,65,34,28,0],[20,8,62,8,20],[8,8,62,8,8],
        [0,80,48,0,0],[8,8,8,8,8],[0,96,96,0,0],[32,16,8,4,2],
        [62,81,73,69,62],[0,66,127,64,0],[66,97,81,73,70],[33,65,69,75,49],
        [24,20,18,127,16],[39,69,69,69,57],[60,74,73,73,48],[1,113,9,5,3],
        [54,73,73,73,54],[6,73,73,41,30],[0,54,54,0,0],[0,86,54,0,0],
        [8,20,34,65,0],[20,20,20,20,20],[0,65,34,20,8],[2,1,81,9,6],
        [50,73,121,65,62]
    ]
}
