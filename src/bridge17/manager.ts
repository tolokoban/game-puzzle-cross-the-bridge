import { Character } from "./painter/object/character"

export class Manager {
    public char1: Character | null = null
    public char2: Character | null = null
    public char5: Character | null = null
    public char10: Character | null = null

    private onTheBrige: number[] = []

    init() {
        this.char1?.moveToLeftBank()
        this.char2?.moveToLeftBank()
        this.char5?.moveToLeftBank()
        this.char10?.moveToLeftBank()
    }

    handleClick(speed: 1 | 2 | 5 | 10): void {
        const char = this.getChar(speed)
        if (!char) return

        if (this.onTheBrige.includes(speed)) {
            char.moveToLeftBank(300)
            this.onTheBrige = this.onTheBrige.filter(n => n !== speed)
        } else {
            char.moveToRightBank(300)
            this.onTheBrige.push(speed)
        }
    }

    private getChar(speed: 1 | 2 | 5 | 10): Character | null {
        switch (speed) {
            case 1:
                return this.char1
            case 2:
                return this.char2
            case 5:
                return this.char5
            default:
                return this.char10
        }
    }
}
