import * as React from "react"
import { createRoot } from "react-dom/client"
import { Theme } from "@tolokoban/ui"

import Assets from "./assets"
import App from "./app"

import "./index.css"
import "./fonts/fuzzy-bubbles.css"

async function start() {
    new Theme({
        colors: {
            neutral: ["#111", "#999"],
        },
    }).apply()
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(<App />)

    await Assets.lowRes
    const splash = document.getElementById("splash-screen")
    if (!splash) throw Error("Unable to find element #splash-screen!")

    splash.classList.add("vanish")
    window.setTimeout(() => splash.parentNode?.removeChild(splash), 1000)
}

void start()
