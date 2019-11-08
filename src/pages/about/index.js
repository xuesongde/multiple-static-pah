import("../../scss/main.scss");
import("./index.scss");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded", "page-about");
});

function count() {
  var arr = [];
  for (let i = 1; i < 3; i++) {
    arr.push(() => i * i);
  }
  return arr;
}
