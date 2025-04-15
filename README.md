# MedTalk Web App
## Welcome! Before you run, make sure to install dependencies using
`npm i`

## Set up your .env file which will need the following fields:
- MEDICINE_MONGODB_URI=<your-mongodb-uri>
- PORT=<desired port (usually 3000 for express)>
- SECRET_ACCESS_TOKEN=<Generate a random string using node's crypto module and save to this field>
- SECRET_REFRESH_TOKEN=<Generate a random string using node's crypto module and save to this field>

## To run the backend server
`npm run dev`

## To run the frontend server
`npm run frontdev`

## To build only the backend server
`npm run buildserver`

## To build both servers
`npm run build`

## To run the built server which has both frontend and backend
`npm start`

## Git Commit formats
Follow the conventional commits as much as possible for commit tracking
[](https://www.conventionalcommits.org/en/v1.0.0/)
