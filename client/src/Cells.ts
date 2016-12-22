export class Cells {
    public data: string;

    constructor() {
        this.data = "";
    }

    public add(value: any, attributes?: any) {
        this.data += `<td${" " + attributes}>${value}</td>`;
        return this;
    }
}
