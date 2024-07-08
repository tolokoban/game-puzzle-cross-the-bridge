import React from "react"

import AssetsManager, { Assets, useLowResAssets } from "@/assets"
import { IconPlay, ViewButton, ViewPanel } from "@tolokoban/ui"
import { makeGoto } from "./routes"

export default function Page() {
    const assets = useLowResAssets()
    return (
        <ViewPanel
            position="absolute"
            fullsize
            display="grid"
            placeItems="center"
            color="neutral-1"
        >
            <h1>Cross the Bridge</h1>
            <p>Blablabla...</p>
            <ViewButton
                waiting={!assets}
                onClick={makeGoto("/play")}
                icon={IconPlay}
            >
                {assets ? "Solve the puzzle" : "Wait for assets to be loaded"}
            </ViewButton>
        </ViewPanel>
    )
}
