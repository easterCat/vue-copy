import { EVue } from "./src/evue";
import { createVnode } from "./src/vdom/vnode";

EVue.createVnode = createVnode;
EVue.version = "1.0.1";

export default EVue;
