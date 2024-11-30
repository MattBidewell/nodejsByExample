// <b>Modularized</b> code using import and export:
/*math.js*/
export function add(a, b) {
  return a + b;
}

/*main.js*/
import { add } from './math.js';
add(2, 3); // 5