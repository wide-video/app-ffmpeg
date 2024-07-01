# app-ffmpeg

## TODO

- complete with tab
- handle ffmpeg errors
- style stderr vs stdout
- `about`, `man`
- embed as iframe

## Test

```sh
ffmpeg -filter_complex "smptehdbars=size=320x240:rate=30000/1001;sine=frequency=440:sample_rate=48000:beep_factor=2" -c:v libx264 -pix_fmt:v yuv420p -profile:v high -c:a aac -ac 2 -t 5 out.mp4 -movflags +faststart
```
