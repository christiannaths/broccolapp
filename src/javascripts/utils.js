const throttle = function(type, name, obj = window) {
  let running = false;
  const func = () => {
    if (running) return;
    running = true;
    requestAnimationFrame( () => {
      obj.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  };
  obj.addEventListener(type, func);
};

export { throttle };
