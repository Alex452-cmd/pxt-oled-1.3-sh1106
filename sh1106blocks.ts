//% color=#00AEEF icon="\uf26c" block="SH1106 Display"
namespace SH1106 {

    //% block="inizializza SH1106 indirizzo %address"
    export function initBlock(address: I2CAddress) {
        init(address)
    }

    //% block="pulisci schermo"
    export function clearBlock() {
        clear()
    }

    //% block="aggiorna display"
    export function refreshBlock() {
        refresh()
    }

    //% block="scrivi testo %text a x %x y %y"
    export function printBlock(x: number, y: number, text: string) {
        print(x, y, text)
    }

    //% block="disegna pixel a x %x y %y"
    export function pixelBlock(x: number, y: number) {
        drawPixel(x, y)
    }

    //% block="disegna linea da x %x0 y %y0 a x %x1 y %y1"
    export function lineBlock(x0: number, y0: number, x1: number, y1: number) {
        drawLine(x0, y0, x1, y1)
    }

    //% block="disegna rettangolo x %x y %y larghezza %w altezza %h"
    export function rectBlock(x: number, y: number, w: number, h: number) {
        drawRect(x, y, w, h)
    }

    //% block="riempi rettangolo x %x y %y larghezza %w altezza %h"
    export function fillRectBlock(x: number, y: number, w: number, h: number) {
        fillRect(x, y, w, h)
    }
}
