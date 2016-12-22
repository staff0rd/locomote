import * as $ from "jquery";
import {App} from "./App";

(<any> window).jQuery = $;
(<any> window).$ = $;

window.onload = () => {
    const app = new App();
};
