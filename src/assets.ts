import React from "react"
import { TgdLoaderImage } from "@tolokoban/tgd"

export interface Assets {
    background: HTMLImageElement
    bridgeTexture: HTMLImageElement
    bridgeMesh: ArrayBuffer
    riverTexture: HTMLImageElement
    riverMesh: ArrayBuffer
    worldTexture: HTMLImageElement
    worldMesh: ArrayBuffer
}

class AssetsLoader {
    public readonly lowRes: Promise<Assets> = load({
        background: "./assets/background.2k.avif",
        bridgeTexture: "./assets/bridge.avif",
        bridgeMesh: "./assets/bridge.glb",
        riverTexture: "./assets/river.avif",
        riverMesh: "./assets/river.glb",
        worldTexture: "./assets/world.2k.avif",
        worldMesh: "./assets/world.glb",
    })
}

function load(urls: { [key in keyof Assets]: string }): Promise<Assets> {
    return new Promise<Assets>((resolve, reject) => {
        const action = async () => {
            try {
                const [
                    background,
                    bridgeTexture,
                    bridgeMesh,
                    riverTexture,
                    riverMesh,
                    worldTexture,
                    worldMesh,
                ] = await Promise.all([
                    loadImage(urls.background),
                    loadImage(urls.bridgeTexture),
                    loadMesh(urls.bridgeMesh),
                    loadImage(urls.riverTexture),
                    loadMesh(urls.riverMesh),
                    loadImage(urls.worldTexture),
                    loadMesh(urls.worldMesh),
                ])
                resolve({
                    background,
                    bridgeTexture,
                    bridgeMesh,
                    riverTexture,
                    riverMesh,
                    worldTexture,
                    worldMesh,
                })
            } catch (ex) {
                reject(ex)
            }
        }
        void action()
    })
}

async function loadImage(url: string) {
    const image = await TgdLoaderImage.image(url)
    if (!image) throw Error(`Unable to load image "${url}"!`)

    return image
}

async function loadMesh(url: string) {
    const resp = await fetch(url)
    const buffer = await resp.arrayBuffer()
    return buffer
}

const AssetsManager = new AssetsLoader()

export function useLowResAssets(): Assets | null {
    const [asset, setAsset] = React.useState<Assets | null>(null)
    React.useEffect(() => {
        AssetsManager.lowRes.then(setAsset).catch(console.error)
    }, [])
    return asset
}

export default AssetsManager
