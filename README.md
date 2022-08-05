# A Whatsapp quiz powered by Twilio

### What do you need
1. Twilio Account
2. Airtable for storing your questions and user data

### How does it work

### Folder structure
The entire setup is hosted on Twilio Serverless and Twilio Studio, with the data stored on Airtable.

You will need to make a copy of the .env.copy file and rename this to .env and enter the appropriate env variables for your project.

### Serverless
Ensure you have the [twilio cli](https://www.twilio.com/docs/twilio-cli/quickstart) installed in addition to the [serverless toolkit](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit). Once they are installed, to deploy the serverless side of this simply move to the root of the project and enter

```bash
twilio serverless:deploy
```

### Studio Flows
You will then need to deploy the studio flows which can be found in the studio-flows folder of this project. To do this import these json files when creating a new flow in the Twilio console.

While these studio flows contain the logic to follow they are set-up to be used with my Twilio infrastructure. You will need to change each "Functions" call to point to your newly deployed serverless project.

After this, you need to connect the flow redirects within the Orchestrator flow to the Survey flow within your account. 


### How it Works

#### Assigning Users to Surveys
Each Survey has an associated user and state which is stored within the Survey Status table in airtable. For a user to be able to take a survey they must have an entry within this table associating their number with the Survey unique ID. 

The status part of this table denotes the survey state. Below is a description of each status

0 - Shows that the user is able to take the survey but hasn't started
Any Positive Integer - Shows the current question the user is on within the quiz
-1 - Indicates that the user has completed the survey and that it is no longer available for them to take

For users to be assigned a survey you can either directly enter this in airtable or you can "push" a survey to the user by using the "/survey/start" endpoint.

```curl
curl --location --request POST 'https://<your-functions-url>dev.twil.io/survey/start' \
--header 'Content-Type: application/json' \
--data-raw '{
    "quiz_key": "<key-defined-in-env-file",
    "survey_id": "XXX"
}'
```

#### Creating Surveys
For this demo the only way to create a survey is directly within Airtable. In the Surveys table you define the meta-data of the survey which will be sent out to the users. 

Within the questions part of the survey you define the questions of all surveys, with the connection to the right survey being made through the survey_id. The question_num paramter within each question is required and must start at 0 and increment by 1.

#### Creating Whatsapp Templates
This survey makes use of Whatsapp Templates and buttons to show the users the possible choices they can make. If you do not want to use buttons and whatsapp templates you should change the Survey-Flow so that it displays the answers within the question and you should add some answer validation.



