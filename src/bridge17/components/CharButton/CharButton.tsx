import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./CharButton.module.css"

const $ = Theme.classNames

export interface CharButtonProps {
    className?: string
    speed: number
    color: string
    onClick(): void
}

export default function CharButton({
    className,
    speed,
    color,
    onClick,
}: CharButtonProps) {
    return (
        <button
            className={$.join(className, Styles.charbutton)}
            style={{ background: color }}
            type="button"
            onClick={onClick}
        >
            {speed}
        </button>
    )
}
