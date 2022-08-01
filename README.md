# A Whatsapp quiz powered by Twilio

### What do you need
1. Twilio Account
2. Airtable for storing your questions and user data

### How does it work

### Folder structure
#### Frontend:
The frontend code is present inside the `frontend` folder. 

The entire setup is hosted on Twilio Serverless and the frontend is served as static pages. 

While the frontend is a react app, to update the frontend. 

Build the react app
```bash
npm run build
```

Copy the build static assets to the serverless assets folder
```bash
cp ./build ../assets/
```

Deploy the project to your environment
```bash
twilio serverless:deploy
```


