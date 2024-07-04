# FFmpeg Online

Run ffmpeg directly in your browser with a terminal-like interface. No installations needed. Convert, edit, and process multimedia files with this powerful web-based tool.

This app is running on [ffmpeg.wide.video](https://ffmpeg.wide.video).

## Embedding

```html
<iframe width="800" height="300"></iframe>
<script>
const iframe = document.querySelector("iframe");
const commands = [
	`fetch https://ffmpeg.wide.video/asset/input.mp4`,
	`ffmpeg -i input.mp4 -vframes 4 -r .1 output%03d.jpg`];
const params = {command:commands.join("\n"), placeholder:commands[1]};
const hash = encodeURIComponent(JSON.stringify(params));
iframe.src = `/#${hash}`;
</script>
```

## TODO

- ffmpeg `Conversion failed!` means file already exists on FS
- report crbug worker returning many blobs crashes on terminate()