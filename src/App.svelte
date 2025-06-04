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
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
