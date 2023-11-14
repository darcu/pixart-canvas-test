The project was initiated with Vite, so there may be leftover config files and maybe some useless code, though I've tried to clean it up.

I've followed the specs, but also took some inspiration from the color picker the actual Picsart app uses.
I built a very minimal UI and focused more on performance and functionality.

To test performance, I've also added the possibility to artificially scale the canvas to 4x and 16x size, going from 1280x720 to 5120x2880 and 20480x11520 respectively. Apart from the initial load/draw and the expected memory usage increase, performance seems unaffected.


To run the project, run the following commands:

```bash
npm install
npm run dev
```
