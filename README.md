# Software Security: Web Application

## Over deze website

Een website dat gemaakt is voor het vak 'Software Security' om een website zo veilig mogelijk te maken.
Als aanpak voor dit project wou ik zoveel mogelijk leren over dit onderwerp waardoor ik het mezelf iets te moeilijk heb gemaakt door alles zelf te willen schrijven. Waardoor ik niet aan alle veresiten ben geraakt.

## Domein

Het domein dat ik voorzien had is [tychoverstraete.me](http://tychoverstraete.me). Deze is een domein van [Namecheap](https://www.namecheap.com/) dat gekoppeld is met een [Digital Ocean](https://www.digitalocean.com/) Droplet waar ik alle controle over heb. Voor HTTPS en bij gevolg CAA heb ik geen tijd meer gehad.

### URL naar de website

[www.tychoverstraete.me](http://tychoverstraete.me)

## Website

Voor het gehele project wou ik zo low-key mogelijk gaan en heb ik gekozen om het in [Node.Js](https://nodejs.org/) [Express](https://www.npmjs.com/package/express) te ontwikkelen.<br>
In mijn site kan je jezelf registreren, aanmelden, je gegevens bekijken, opvragen en verwijderen.<br>
Ook is er een privacy policy gemaakt geweest en heeft de user toegang van op iedere pagina om deze te lezen.
<br>
Gebruikmakend van npm heb ik packages geinstalleerd die bepaalde flows toch makkelijker maakte:

- [express](https://www.npmjs.com/package/express) dat dient als webframework voor Node.JS. In combinatie met [express-flash](https://www.npmjs.com/package/express-flash) om "flash"/error messages te sturen naar de verschillende pagina's, [express-session](https://www.npmjs.com/package/express-session) om sessies te maken wanneer een user in logt, [express-validator](https://www.npmjs.com/package/express-validator) om te checken of de data, gestuurd van de frontend, wel correct is.
- [bcrypt](https://www.npmjs.com/package/bcrypt) om de wachtwoorden veilig op te slaan in de database.
- [cors](https://www.npmjs.com/package/cors) om er voor te zorgen dat de api enkel requests van de frontend accepteert.
- [ejs](https://www.npmjs.com/package/ejs) een frontend template renderer. In combinatie met express-ejs-layouts om zo een layout systeem te configureren zoals bij andere frontend frameworks.
- [mysql2](https://www.npmjs.com/package/mysql2) om connectie te maken met de database.
- [node-fetch](https://www.npmjs.com/package/node-fetch) om de fetch functionaliteit van JavaScript te gebruiken binnen Node.js.
- [request](https://www.npmjs.com/package/request) om ook de fetch functionaliteit van JavaScript te gebruiken binnen Node.js, maar in combinatie met [zlib](https://www.npmjs.com/package/zlib) om Gunzip response body te behandelen (response van de [HIBP API](https://haveibeenpwned.com/API/v3#PwnedPasswords)). Maar ook in combinatie met [sha1](https://www.npmjs.com/package/sha1) om het wachtwoord van de user bij het registreren te encrypteren naar SHA-1 om de request naar de [HIBP API](https://haveibeenpwned.com/API/v3#PwnedPasswords) te kunnen maken.
- [passport](https://www.npmjs.com/package/passport) om de authenticatie flow van mijn site te implementeren. In combinatie met [passport-local](https://www.npmjs.com/package/passport-local) als gekozen strategie om de flow te schrijven.

Voor deze packages heb ik natuurlijk gekeken of deze enige (gekende) security issues hadden.

## API

Via postman kan er gebruik gemaakt worden van mijn api.
Omdat de api alleen maar application/json requests toelaat, voegen we een header toe: <b>Accept:application/json</b><br>
De API runt op dezelfde server als de site maar staat wel los van de frontend onder de route "/api".<br>
Het plan was om de API effectief te laten integreren in de wesite, maar door tijdsgebrek is mij dit niet gelukt.
Er is wel de mogelijkheid om de options op te vragen van iedere route onder "/api" indien er een origin header is meegegeven.
Ook is er voor iedere get request naar de api waarvan de route niet gekend is een 404 terugestuurd.
