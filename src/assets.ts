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
    body1Texture: HTMLImageElement
    body1Mesh: ArrayBuffer
    body2Texture: HTMLImageElement
    body2Mesh: ArrayBuffer
    body5Texture: HTMLImageElement
    body5Mesh: ArrayBuffer
    body10Texture: HTMLImageElement
    body10Mesh: ArrayBuffer
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
        body1Texture: "./assets/body-1.avif",
        body1Mesh: "./assets/body-1.glb",
        body2Texture: "./assets/body-2.avif",
        body2Mesh: "./assets/body-2.glb",
        body5Texture: "./assets/body-5.avif",
        body5Mesh: "./assets/body-5.glb",
        body10Texture: "./assets/body-10.avif",
        body10Mesh: "./assets/body-10.glb",
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
                    body1Texture,
                    body1Mesh,
                    body2Texture,
                    body2Mesh,
                    body5Texture,
                    body5Mesh,
                    body10Texture,
                    body10Mesh,
                ] = await Promise.all([
                    loadImage(urls.background),
                    loadImage(urls.bridgeTexture),
                    loadMesh(urls.bridgeMesh),
                    loadImage(urls.riverTexture),
                    loadMesh(urls.riverMesh),
                    loadImage(urls.worldTexture),
                    loadMesh(urls.worldMesh),
                    loadImage(urls.body1Texture),
                    loadMesh(urls.body1Mesh),
                    loadImage(urls.body2Texture),
                    loadMesh(urls.body2Mesh),
                    loadImage(urls.body5Texture),
                    loadMesh(urls.body5Mesh),
                    loadImage(urls.body10Texture),
                    loadMesh(urls.body10Mesh),
                ])
                resolve({
                    background,
                    bridgeTexture,
                    bridgeMesh,
                    riverTexture,
                    riverMesh,
                    worldTexture,
                    worldMesh,
                    body1Texture,
                    body1Mesh,
                    body2Texture,
                    body2Mesh,
                    body5Texture,
                    body5Mesh,
                    body10Texture,
                    body10Mesh,
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
