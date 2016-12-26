In order to run this app:
 
- Install [node.js](https://nodejs.org/en/).
- Clone the repository.
- Install dependencies using `npm install`.
- Get an API token using [these instructions](https://forums.plex.tv/discussion/129922/how-to-request-a-x-plex-token-token-for-your-app/p1).
- Figure out the identifier of the player you want to control by hitting https://plex.tv/api/resources.xml?auth_token=api-token and grab the `clientIdentifier` value for the player.

Then run the app as follows:

```
$ TOKEN=api-token PLAYER=client-identifier-to-control node index.js
```

Finally, add the webhook to https://app.plex.tv/web/app#!/account/webhooks (it'll be http://localhost:10000).
