let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
L.marker([53.430127, 14.564802]).addTo(map);

let savedRaster = null;

document.getElementById("getLocation").addEventListener("click", function(){
    if(!navigator.geolocation){

        return alert("No geolocation");
    } 
    navigator.geolocation.getCurrentPosition(pos=>{
        map.setView([pos.coords.latitude, pos.coords.longitude]);
        L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map);
    });
});

function makeDraggable(img){
    img.addEventListener("dragstart", function(e){
        e.dataTransfer.setData("text", this.id);
        this.style.border="2px dashed #D8D8FF";
    });
    img.addEventListener("dragend", function(){
        this.style.border="2px solid transparent";
    });
}

function enableSlotDrop(slot){
    slot.addEventListener("dragover", e=> e.preventDefault());
    slot.addEventListener("drop", function(e){
        e.preventDefault();
        let id = e.dataTransfer.getData("text");
        let img = document.getElementById(id);
        if(!img) return;
        if(this.children.length === 0) this.appendChild(img);
        checkPuzzleCompletion();
    });
}

function setupAllSlots(){
    document.querySelectorAll(".puzzle-slot").forEach(enableSlotDrop);
}

function checkPuzzleCompletion(){
    let correct = true;
    let slots = document.querySelectorAll("#gridTarget .puzzle-slot");
    slots.forEach(slot=>{
        slot.classList.remove("correct");
        if(slot.children.length === 0){

            correct = false;
        }
        else {
            let imgId = slot.children[0].id;
            let pos = slot.dataset.pos;
            if(imgId === `block-${pos}`){
                slot.classList.add("correct");
            } else {
                correct = false;
            }
        }
    });

    if(correct) {
        console.log("Wszystkie elementy są na właściwym miejscu!");
        notifyCompletion();
    } else {
        console.log("Puzzle jeszcze nie są kompletne.");
    }
}

function notifyCompletion(){
    if(Notification.permission === "granted"){
        new Notification("🎉 Puzzle Ułożone!");
    } else if(Notification.permission !== "denied"){
        Notification.requestPermission().then(perm=>{
            if(perm === "granted"){
                notifyCompletion();
            } 
        });
    }
}

document.getElementById("saveRaster").addEventListener("click", function(){
    leafletImage(map, function(err, canvas){
        let rasterCanvas=document.getElementById("rasterMap");
        let ctx=rasterCanvas.getContext("2d");
        rasterCanvas.width=300; rasterCanvas.height=300;
        ctx.drawImage(canvas,0,0,300,300);

        savedRaster = rasterCanvas.toDataURL("image/png");

        let preview = document.getElementById("savedRasterPreview").getContext("2d");
        preview.clearRect(0,0,300,300);
        preview.drawImage(canvas,0,0,300,300);

        document.getElementById("createPuzzle").disabled = false;
    });
});

document.getElementById("createPuzzle").addEventListener("click", function(){
    if(!savedRaster){
        alert("Najpierw zapisz raster mapy!");
        return;
    }
    let img = new Image();
    img.src = savedRaster;

    img.onload = function(){
        let puzzleCanvas = document.getElementById("rasterMap");
        let ctx = puzzleCanvas.getContext("2d");
        ctx.clearRect(0,0,300,300);
        ctx.drawImage(img,0,0,300,300);

        let blockSize=75;
        let blocks=[];

        for(let row=0; row<4; row++){
            for(let col=0; col<4; col++){
                let blockCanvas=document.createElement("canvas");
                blockCanvas.width=blockSize; blockCanvas.height=blockSize;
                blockCanvas.getContext("2d").drawImage(puzzleCanvas,col*blockSize,row*blockSize,blockSize,blockSize,0,0,blockSize,blockSize);

                let tile=new Image();
                tile.src=blockCanvas.toDataURL("image/png");
                tile.width=blockSize; tile.height=blockSize;
                tile.draggable=true; tile.className="draggable";
                tile.id=`block-${row}-${col}`;
                makeDraggable(tile);
                blocks.push(tile);
            }
        }

        for(let i=blocks.length-1;i>0;i--){
            let j=Math.floor(Math.random()*(i+1));
            [blocks[i], blocks[j]]=[blocks[j], blocks[i]];
        }

        document.getElementById("gridSource").innerHTML="";
        document.querySelectorAll("#gridTarget .puzzle-slot").forEach(s=>{ s.innerHTML=""; s.classList.remove("correct"); });

        blocks.forEach(b=>{
            let slot=document.createElement("div");
            slot.className="puzzle-slot";
            slot.appendChild(b);
            document.getElementById("gridSource").appendChild(slot);
        });

        setupAllSlots();
    };
});
