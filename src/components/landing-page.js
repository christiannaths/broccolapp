function doClick(event){
  console.log('click', event.target);
}




const button = document.querySelector("[data-js='click']");
button.addEventListener("click", doClick);

export default null;
