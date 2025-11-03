# MedTalk Web App
A web application for maintaining a medicine catalog and patient medication scheduling with medicine analytics.

## Setup
Welcome! Before you run, make sure to install dependencies using
`npm i`

## Set up your .env file which will need the following fields:
- MEDICINE_MONGODB_URI=your mongodb connection string from MongoDB Atlas
- PORT=desired port (usually 3000 for express)
- NODE_ENV=development/production
- SECRET_ACCESS_TOKEN=<Generate a random string using node's crypto module and save to this field>
- SECRET_REFRESH_TOKEN=<Generate a random string using node's crypto module and save to this field>
- MAIL_USERNAME=email address used for nodemailer
- GOOGLE_CLIENT_ID=OAuth client ID from Google Cloud Console
- GOOGLE_CLIENT_SECRET=OAuth client secret from Google Cloud Console
- GOOGLE_REFRESH_TOKEN=refresh token from OAuth Playground
- GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground

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
[https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)
