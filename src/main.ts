import { Application } from "pixi.js";
import WelcomePage from "./pages/welcomePage";
import GameManager from "./gameManager";
import { textureLoader } from "./textureLoader";
import { soundLoader } from "./soundLoader";

(async () => {

  await textureLoader.loadAll();
  const app = new Application();
  soundLoader.loadAll();

  await app.init({ background: "black", resizeTo: document.getElementById("pixi-container")!, antialias: true });

  const gameManager = new GameManager(new WelcomePage(), app);
  document.addEventListener('keydown', (evt: KeyboardEvent) => { gameManager.handleKeyDown(evt); });
  document.addEventListener('keyup', (evt: KeyboardEvent) => { gameManager.handleKeyUp(evt); });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  app.ticker.add((time) => {
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    gameManager.advance(time);
  });
})();
