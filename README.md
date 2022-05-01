# Solidabis koodihaaste 2022

## Mitä teknologioita olet käyttänyt ja millä käyttöjärjestelmällä

NodeJS, React, NextJS. Käyttöjärjestelmänä macOS

## Ohjeet miten ratkaisusi pystytetään ja käynnistetään

### Backendin käynnistys

    ./gradlew bootRun

tai Dockerilla:

    docker run -p 8080:8080 solidabis/koodihaaste22:latest

### Frontendin käynnistys

    cd frontend
    npm install
    npm run dev

Frontend löytyy tämän jälkeen osoitteesta `http://localhost:3000`

Testit voi ajaa

    npm run test:coverage

## Muutaman lauseen kuvaus tekemästäsi ratkaisusta

Kaupungin valinta on erotettu omaksi vaiheekseen itse lounasravintolan äänestämisestä. Tämä mahdollistaa kaupunkisivun kiinnittämisen kirjanmerkiksi sillä saman käyttäjän kaupunki tuskin vaihtuu kovin usein. Sama temppu onnistuisi muillakin keinoilla.

Backendiä on muokattu niin että sieltä voi hakea oman äänensä jotta tieto on tarjolla jos selain esimerkiksi suljetaan. Tämän yhteydessä palautetaan myös VOTERID.

Backendin muu data haetaan NextJS-serverin puolella jotta se saadaan käyttäjän ruudulle nopeammin.

## Haluatko osallistua vain kilpailuun ja arvontaan

Kyllä kiitos
