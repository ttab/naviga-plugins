# TT-linan (agent)
Plugin för externt bruk som används tillsammans med [TT-linan (app)](https://github.com/ttab/dashboard-plugins/tree/master/tt-linan-app). Visar TT:s textutgivning och gör det möjligt att importera TT-artiklar med tillhörande bilder till kundens OC, för redigering och publicering i Writer.

## Konfiguration
I plugin-inställningarna i Dashboard behöver man ange adresserna till Navigas importtjänst och kundens OC, samt inloggningsuppgifter för OC.

## Ladda upp till S3
Själva pluggen ligger här: https://ttnewsagency-dashboard-plugins.s3-eu-west-1.amazonaws.com/se-tt-tt-linan-agent/.
Den laddas upp med scriptet `upload.js` med följande kommando: ```npm run upload:s3 S3_BUCKET_NAME="ttnewsagency-dashboard-plugins" S3_REGION="eu-west-1" S3_ACCESS_KEY="YOUR_ACCESS_KEY" S3_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"```.
