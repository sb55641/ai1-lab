type StyleMap = Record<string, string>;

const styles: StyleMap = {
  "Styl 1": "/style-1.css",
  "Styl 2": "/style-2.css",
  "Styl 3": "/style-3.css",
};

let currentStyle: string = "Styl 1";

function applyStyle(name: string): void {
  const old = document.getElementById("dynamic-style");
  if (old){
    old.remove();
  }
  const link = document.createElement("link");
  link.id = "dynamic-style";
  link.rel = "stylesheet";
  link.href = styles[name];

  document.head.appendChild(link);
  currentStyle = name;
}

function buildLinks() {
  const div = document.createElement("div");
  div.style.padding = "10px";
  div.style.background = "#222" ;

  Object.keys(styles).forEach(name => {const a = document.createElement("a");
    a.textContent = name;
    a.href = "#";
    a.style.color = "white";
    a.style.background = "blue";
    a.style.padding = "6px 10px";
    a.style.marginRight = "10px";
    a.style.textDecoration = "none";
    a.style.borderRadius = "5px";
    a.onmouseover = () => a.style.background = "darkblue";
    a.onmouseout = () => a.style.background = "blue";
    a.onclick = e => {
      e.preventDefault();
      applyStyle(name);
    };
    div.appendChild(a);
  });
  document.body.prepend(div);
}

buildLinks();
applyStyle(currentStyle);