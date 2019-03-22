# SelfieWithFame PWA
Selfie With Fame PWA in NodeJS and React.

## Installation
To install, first clone this repository using:
```
git clone git@github.com:johnhany97/selfie-with-fame.git
```
Then change direcrtory into the project
```
cd selfie-with-fame
```
You'll need to install the node modules using the following series of commands to setup both the backend and the frontend
```
npm i
cd client
npm i
```
You'll lastly need to add to the `config` folder a configuration json file names `config.json` which should follow the following format and fill the following fields:
```
{
  "development": {
    "MONGODB_URI": "mongodb://localhost:27017/selfie-with-fame",
    "JWT_SECRET": "someSecret",
    "EMAIL_ADDRESS": "email@gmail.com",
    "EMAIL_PASSWORD": "thatEmailsPassword"
  }
}

```

## Running instructions

To run this project, you'll have to open two separate terminals. One for the backend and the other for the frontend

#### Running the backend

```
cd selfie-with-fame
npm run start
```

#### Running the frontend

```
cd selfie-with-fame/client
npm run start
```

At this point, the frontend should be accessible from `localhost:3000` with the backend running at port `3001` but proxied into the frontend.
