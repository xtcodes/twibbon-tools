<script>
	export let name;
</script>

<div class="main">
    <h1>Twibbon {name}</h1>
    <p>
      <label>Upload Poto
      <input type="file" id="upload" accept="image/*" />
      </label>
      
      <label>Upload Twibbon
      <input type="file" id="uploadFrame" accept="image/*" />
      </label>
    </p>
    <p><canvas id="canvas" width="1024" height="1024">Perangkat Anda tidak mendukung fitur Canvas.</canvas></p>
    <p>
      <button id="download">Download</button>
      <button id="share">Bagikan</button>
    </p>
</div>

<style>
	.main {
width: 600px;
margin: 20px auto;
background: white;
padding: 20px;
border-radius: 12px;
display: inline-block;
box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

	@media (max-width: 700px) {
.main {
margin: 0 auto;
width: auto;
}
}
</style>
