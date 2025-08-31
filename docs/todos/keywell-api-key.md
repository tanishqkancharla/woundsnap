<slack_message>
Hey hackers! Here are instructions to use our LLM endpoints for the hackathon.
We have MedGemma 4b, GPT-oss, and Llama set up right now.
Let me know if you have requests and we’ll try to help!
XPC Hackathon – Keywell Platform
Keywell Guide
The Keywell AI Platform is a control center for healthcare AI use cases (beta). The platform is built on Databricks and designed to be deployed in a customer’s Databricks environment. You can learn more about our solutions here:
<https://www.keywell.ai/healthcare-ai-platform/>
For the XPC hackathon, we’ve set up a simple page to view and test models. You can view models, set prompts, and get API endpoint information.
UI Sandbox
Step 1: Get your credentials by going to [this spreadsheet](https://docs.google.com/spreadsheets/d/1gZRsng2koyEG3Dbk19fjH7zB0YbkGGkUpqVgauIgRzo/edit?usp=sharing) and claiming a row with your team name and point of contact. This is obviously a staging environment but use the honor system and use your own tokens. If we run out, let me know by sending the following to <mailto:xpc_hackathon@keywell.ai>:
• Team Name
• Point of contact
• Point of contact e-mail address
Step 2: We’ll send you the following information:
• SSO username
• SSO password
• Platform username
• Platform password
• API auth token
Step 3: Using Keywell AI Portal
• Go to <http://platform.keywell.ai>
• Log in using your platform username and password
• When you log in, it will ask you to authenticate (SSO between Retool and Databricks). Use the SSO username and password
• Postman collection JSON: <https://drive.google.com/file/d/19MRIHcUCBpatVncuKMKow-hb5AXnX_LO/view?usp=sharing>
Step 4: Using API Token
• Use the models that you see with an API
• Browse to the model settings page (gear icon on the dashboard models) and go to the model card API tab to see the API information
• API uses bearer authentication (use PAT token)
• Inference calls require a session ID — first generate a session ID, then call the model (example in API tab) (edited)

</slack_message>
