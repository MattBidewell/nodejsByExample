//<b>Dynamic Imports</b> allow you to import modules only when they are needed. This can help reduce the initial load time of your application.

async function loadModule() {
  if(condition) {
    const module = await import('./module.js');
    module.someFunction();
    return module;
  } else {
    return import('./another-module.js');
  }
}