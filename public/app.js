let config = {
  canvas: { width: 1024, height: 1024 },
  photo: { width: 1024, height: 1024 },
  frame: { image: "/twibbon.png", x: 0, y: 0, width: 1024, height: 1024 }
};

let canvas, ctx;
let userImg = null;
let frameImg = new Image();
let frameLoaded = false;

let scale = 1, minScale = 0.5, maxScale = 3;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastX = 0, lastY = 0;
let lastDist = 0;
let isInteracting = false;

window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = config.canvas.width;
  canvas.height = config.canvas.height;

  document.getElementById("upload").addEventListener("change", handleUpload);
  document.getElementById("uploadFrame").addEventListener("change", handleUploadFrame);
  document.getElementById("download").addEventListener("click", handleDownload);
  document.getElementById("share").addEventListener("click", handleShare);

  // Default frame
  frameImg.src = config.frame.image;
  frameImg.onload = () => {
    frameLoaded = true;
    drawCanvas();
  };

  // Touch & mouse gestures
  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  // Hide share if unsupported
  const shareBtn = document.getElementById("share");
  if (!navigator.canShare || !navigator.canShare({ files: [new File([], "")] })) {
    shareBtn.style.display = "none";
  }
};

function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    userImg = new Image();
    userImg.onload = () => {
      resetTransform();
      drawCanvas();
    };
    userImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleUploadFrame(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    frameImg = new Image();
    frameImg.onload = () => {
      frameLoaded = true;
      drawCanvas();
    };
    frameImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleDownload() {
  if (!userImg) return showAlert("Silakan unggah gambar terlebih dahulu!");

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  drawCanvas(tempCtx, true);
  drawWatermark(tempCtx);

  const link = document.createElement("a");
  link.download = "twibbon.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
}

async function handleShare() {
  if (!userImg) return showAlert("Silakan unggah gambar terlebih dahulu!");

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  drawCanvas(tempCtx, true);
  drawWatermark(tempCtx);

  tempCanvas.toBlob(async (blob) => {
    const file = new File([blob], "twibbon.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Twibbon Saya",
        text: "Lihat hasil twibbon saya!",
        url: "https://twibbon-tools.vercel.app/"
      });
    } else {
      showAlert("Perangkat Anda tidak mendukung fitur Bagikan.");
    }
  }, "image/png");
}

function resetTransform() {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
}

function drawCanvas(context = ctx, final = false) {
  const { width, height } = config.photo;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (userImg) {
    context.save();
    context.translate(offsetX, offsetY);
    context.scale(scale, scale);
    context.drawImage(userImg, 0, 0, width, height);
    context.restore();
  }

  if (frameLoaded) {
    context.save();
    if (!final && isInteracting) {
      context.globalAlpha = 0.5;
      context.filter = "blur(2px)";
    }
    const f = config.frame;
    context.drawImage(frameImg, f.x, f.y, f.width, f.height);
    context.restore();
  }
}

function drawWatermark(context) {
  const padding = 10;
  const fontSize = 16;
  const text = "Twibbon by Ferry Ayunda";

  context.font = `${fontSize}px sans-serif`;
  context.textBaseline = "middle";
  context.textAlign = "center";

  const textWidth = context.measureText(text).width;
  const bgWidth = textWidth + padding * 2;
  const bgHeight = fontSize + padding * 2;

  const x = canvas.width - bgWidth - 20;
  const y = canvas.height - bgHeight - 20;

  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(x, y, bgWidth, bgHeight);

  context.fillStyle = "white";
  context.fillText(text, x + bgWidth / 2, y + bgHeight / 2);
}

// Touch Events
function onTouchStart(e) {
  if (!userImg) return;
  isInteracting = true;

  if (e.touches.length === 1) {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    lastDist = getTouchDistance(e.touches);
  }
}

function onTouchMove(e) {
  if (!userImg) return;
  e.preventDefault();

  if (e.touches.length === 1 && isDragging) {
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    offsetX += dx;
    offsetY += dy;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    const newDist = getTouchDistance(e.touches);
    const scaleChange = newDist / lastDist;
    scale *= scaleChange;
    scale = Math.max(minScale, Math.min(maxScale, scale));
    lastDist = newDist;
  }

  drawCanvas();
}

function onTouchEnd() {
  isDragging = false;
  isInteracting = false;
  drawCanvas();
}

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Mouse Events
function onMouseDown(e) {
  if (!userImg) return;
  isDragging = true;
  isInteracting = true;
  lastX = e.clientX;
  lastY = e.clientY;
}

function onMouseMove(e) {
  if (!userImg || !isDragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  offsetX += dx;
  offsetY += dy;
  lastX = e.clientX;
  lastY = e.clientY;
  drawCanvas();
}

function onMouseUp() {
  isDragging = false;
  isInteracting = false;
  drawCanvas();
}

function onWheel(e) {
  if (!userImg) return;
  e.preventDefault();
  isInteracting = true;

  const delta = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= delta;
  scale = Math.max(minScale, Math.min(maxScale, scale));

  drawCanvas();
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    isInteracting = false;
    drawCanvas();
  }, 300);
}

let wheelTimeout;
