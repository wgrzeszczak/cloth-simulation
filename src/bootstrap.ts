import { App } from './app/app';
import './styles/style.css';

(() => {
    const canvas: HTMLCanvasElement = document.querySelector('canvas');
    const app = new App(document.defaultView, canvas);
    app.run();
})();