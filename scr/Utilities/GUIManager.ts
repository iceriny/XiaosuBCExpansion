export class GUI {


    static DrawButton(position:Position,
        label: string, color: string, img?: string, HoveringText?: string, Disabled?: boolean): void {
        DrawButton(position[0], position[1], position[2], position[3], label, color, img, HoveringText, Disabled);
    }

    static MouseIn(position: Position):boolean {
        return MouseIn(position[0], position[1], position[2], position[3]);
    }
}

export type Position = [left: number, top: number, width: number, height: number];
