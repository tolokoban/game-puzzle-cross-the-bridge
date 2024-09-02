import React, { useState } from "react"
import {
    TgdCameraPerspective,
    TgdContext,
    tgdEasingFunctionInBounce,
    TgdPainterBackground,
    TgdPainterClear,
    TgdPainterDepth,
    TgdPainterNode,
    TgdPainterState,
    TgdQuat,
    TgdVec3,
} from "@tolokoban/tgd"
import { ViewPanel } from "@tolokoban/ui"

import { Assets, useLowResAssets } from "@/assets"
import { PainterObject } from "@/bridge17/painter/object/painter-object"
import { PainterRiver } from "@/bridge17/painter/river/painter-river"

import Styles from "./page.module.css"
import { Character } from "@/bridge17/painter/object/character"
import { Manager } from "@/bridge17/manager"
import CharButton from "@/bridge17/components/CharButton"

export default function PagePlay() {
    const assets = useLowResAssets()
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const manager = useInitialize(assets, canvas)
    return (
        <ViewPanel
            position="absolute"
            fullsize
            color="neutral-1"
            className={Styles.main}
        >
            <canvas ref={setCanvas}></canvas>
            <ViewPanel
                position="absolute"
                fullwidth
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                padding="S"
            >
                <CharButton
                    speed={1}
                    color="#f00"
                    onClick={() => manager.handleClick(1)}
                />
                <CharButton
                    speed={2}
                    color="#f70"
                    onClick={() => manager.handleClick(2)}
                />
                <CharButton
                    speed={5}
                    color="#ff0"
                    onClick={() => manager.handleClick(5)}
                />
                <CharButton
                    speed={10}
                    color="#0f0"
                    onClick={() => manager.handleClick(10)}
                />
            </ViewPanel>
        </ViewPanel>
    )
}

function useInitialize(
    assets: Assets | null,
    canvas: HTMLCanvasElement | null
) {
    const refManager = React.useRef(new Manager())
    React.useEffect(() => {
        if (!assets || !canvas) return

        const ctx = new TgdContext(canvas)
        const camera = new TgdCameraPerspective({
            distance: 6,
            far: 1e3,
            fovy: Math.PI * 0.35,
            near: 1e-3,
            target: new TgdVec3(0, 1, 0),
        })
        camera.orbitAroundX(-0.1)
        ctx.camera = camera
        const world = new PainterObject(ctx, {
            glbContent: assets.worldMesh,
            textureImage: assets.worldTexture,
        })
        const bridge = new PainterObject(ctx, {
            glbContent: assets.bridgeMesh,
            textureImage: assets.bridgeTexture,
        })
        const river = new PainterRiver(ctx, {
            glbContent: assets.riverMesh,
            textureImage: assets.riverTexture,
        })
        const body1 = new Character(ctx, {
            bodyMesh: assets.body1Mesh,
            bodyTexture: assets.body1Texture,
            restLeft: [-4, 2],
            restRight: [4, 2],
            speed: 1,
        })
        const body2 = new Character(ctx, {
            bodyMesh: assets.body2Mesh,
            bodyTexture: assets.body2Texture,
            restLeft: [-4, 2.5],
            restRight: [4, 2.5],
            speed: 2,
        })
        const body5 = new Character(ctx, {
            bodyMesh: assets.body5Mesh,
            bodyTexture: assets.body5Texture,
            restLeft: [-4, 1],
            restRight: [4, 1],
            speed: 5,
        })
        const body10 = new Character(ctx, {
            bodyMesh: assets.body10Mesh,
            bodyTexture: assets.body10Texture,
            restLeft: [-4, 1.5],
            restRight: [4, 1.5],
            speed: 10,
        })
        const manager = refManager.current
        manager.char1 = body1
        manager.char2 = body2
        manager.char5 = body5
        manager.char10 = body10
        manager.init()
        ctx.add(
            new TgdPainterClear(ctx, {
                depth: 1,
                color: [1, 0.7, 0, 1],
            }),
            new TgdPainterDepth(ctx, {
                enabled: true,
            }),
            bridge,
            world,
            body1,
            body2,
            body5,
            body10,
            new TgdPainterBackground(
                ctx,
                ctx.textures2D.create(
                    {
                        image: assets.background,
                    },
                    "Background"
                )
            ),
            new TgdPainterState(ctx, {
                children: [river],
                blend: "sprite",
            })
        )
        ctx.animSchedule({
            action(alpha) {
                const x = 1.5 * Math.sin(2 * Math.PI * alpha)
                ctx.camera.setShift(x, 0, 0)
            },
            duration: 18000,
            repeat: 30,
        })
        // ctx.animSchedule({
        //     action(alpha) {
        //         body1.transfo.orientation = TgdQuat.rotateAroundY(
        //             Math.PI * 0.2 * alpha
        //         )
        //     },
        //     easingFunction: tgdEasingFunctionInBounce,
        //     duration: 1800,
        //     repeat: 30,
        // })
        ctx.paint()
    }, [assets, canvas])
    return refManager.current
}
