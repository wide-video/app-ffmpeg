# Server

Run this app on secure context (https). Use attached ffmpeg.wv.crt to run the app via https://ffmpeg.wv/ or generate any custom one.

## Node server

A simple no-dependency http server to run the app

```sh
node server/start.js
```

## Create certificate

1. append into openssl.cfg (the one in `env.OPENSSL_CONF` or `openssl version -a | grep OPENSSLDIR`):

```
[ san ]
subjectAltName      = DNS:ffmpeg.wv

[dn]
CN=ffmpeg.wv

[EXT]
subjectAltName=DNS:ffmpeg.wv
keyUsage=digitalSignature
extendedKeyUsage=serverAuth
```

2. execute:

```
"c:\Program Files\OpenSSL-Win64\bin\openssl" req -x509 -nodes -days 3650 -newkey rsa:2048 -subj /CN=ffmpeg.wv -reqexts san -extensions san -keyout ffmpeg.wv.key -out ffmpeg.wv.crt
```

3. Windows: import cert to trusted root cert. auth. (doubleclick .crt and select trusted root)
Mac: import .crt file into Keychain Access / System. Once imported, dbl clikc the cert and set Trust / Always Trust


4. setup apache virtual host with "ffmpeg.wv.crt" and "ffmpeg.wv.key"

5. restart apache and chrome
