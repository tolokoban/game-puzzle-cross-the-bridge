import React, { useState } from "react"
import {
    TgdCameraPerspective,
    TgdContext,
    TgdPainterBackground,
    TgdPainterClear,
    TgdPainterDepth,
    TgdPainterState,
    TgdVec3,
} from "@tolokoban/tgd"
import { ViewPanel } from "@tolokoban/ui"

import { Assets, useLowResAssets } from "@/assets"
import { PainterObject } from "@/painter/object/painter-object"
import { PainterRiver } from "@/painter/river/painter-river"

import Styles from "./page.module.css"

export default function PagePlay() {
    const assets = useLowResAssets()
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    useInitialize(assets, canvas)
    return (
        <ViewPanel
            position="absolute"
            fullsize
            color="neutral-1"
            className={Styles.main}
        >
            <canvas ref={setCanvas}></canvas>
        </ViewPanel>
    )
}

function useInitialize(
    assets: Assets | null,
    canvas: HTMLCanvasElement | null
) {
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
        ctx.paint()
    }, [assets, canvas])
}
