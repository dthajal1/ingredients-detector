# Ingredients Detector
Ingredients Detector is an app that helps users identify ingredients from images and generate recipes. Using Google Vision API for image recognition and generative AI for recipe creation, this app aims to make cooking and meal prep simple and fun.

## Demo
TODO: Add demo

* add demo
* deploy to vercel
* add license
* add hotjar or any analytics tool
* ask users for their email (give value in return? maybe a cheatsheet/pattern for coding problems?)

## Features
1. **Take or Upload Images**: Snap a photo or upload images of your ingredients.
2. **Identify Ingredients**: Identify ingredients in uploaded images using Google Vision API.
3. **Manage Ingredients**: Users can add/remove ingredients from the identified list.
4. **Generate Recipes**: Once ingredients are finalized, users can generate recipe using Generative AI.

## Technologies Used
* Next.js
* Material UI
* Google Vision API
* Google Cloud Storage
* OpenAI API

## Installation
To run this app locally, run the following command in your terminal:
* Clone the repository
```bash
git clone git@github.com:dthajal1/ingredients-detector.git
```
* cd into the project repository
```bash
cd ingredients-detector
```
* Install dependencies
```bash
npm install
```
* Create a .env file in the root directory. Use .env.example as a reference.
* Start the dev server
```bash
npm run dev
```
* Open http://localhost:3000 in your browser and TADA! You're ready to go!


## Future Plans
* Feature to allow users to upload multiple ingredient images.
* Integrate chatbot with the recipe generator so users can ask follow-up questions.
* Fine-tune the model for better results (more accurate ingredients recognition).
* generate recipe videos using Generative AI (if it is possible?)

## Contributing
Contributions are welcome! Here's how you can get involved:

1.  Fork the repository
2. Create a new branch
```bash
git checkout -b feature-branch
```
3. Make your changes
4. Commit your changes
```bash
git add .
git commit -m "Add new feature"
```
5. Push to your branch
```bash
git push origin feature-branch
```
6. Create a pull request


---
\
Enjoy using Ingredients Detector! Happy cooking!