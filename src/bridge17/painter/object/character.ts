import {
    ArrayNumber2,
    TgdContextInterface,
    tgdEasingFunctionInOutQuad,
    TgdPainterNode,
} from "@tolokoban/tgd"
import { PainterObject } from "./painter-object"

export interface TgdPainterNodeOptions {
    bodyTexture: HTMLImageElement
    bodyMesh: ArrayBuffer
    restLeft: ArrayNumber2
    restRight: ArrayNumber2
    speed: number
}

const Y = -0.1

export class Character extends TgdPainterNode {
    constructor(
        private readonly context: TgdContextInterface,
        private readonly options: TgdPainterNodeOptions
    ) {
        super()
        const body = new PainterObject(context, {
            glbContent: options.bodyMesh,
            textureImage: options.bodyTexture,
        })
        this.add(body)
    }

    moveTo(x: number, y: number, z: number, duration: number = 0) {
        if (duration <= 0) {
            this.transfo.setPosition(x, y, z)
            return
        }
        const [x0, y0, z0] = this.transfo.position
        const dx = x - x0
        const dy = y - y0
        const dz = z - z0
        this.context.animSchedule({
            action: alpha => {
                this.transfo.setPosition(
                    x0 + alpha * dx,
                    y0 + alpha * dy,
                    z0 + alpha * dz
                )
            },
            duration: duration * this.options.speed,
            easingFunction: tgdEasingFunctionInOutQuad,
        })
    }

    moveToLeftBridge0(duration: number = 0) {
        this.moveTo(-2.5, Y, 1, duration)
    }

    moveToLeftBank(duration: number = 0) {
        const [x, z] = this.options.restLeft
        this.moveTo(x, Y, z, duration)
    }

    moveToRightBridge0(duration: number = 0) {
        this.moveTo(2.5, Y, 1, duration)
    }

    moveToRightBank(duration: number = 0) {
        const [x, z] = this.options.restRight
        this.moveTo(x, Y, z, duration)
    }
}
