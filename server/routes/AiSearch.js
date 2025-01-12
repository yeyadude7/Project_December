const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const pool = require("../db");
const {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
} = require("../utils");

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(GOOGLE_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
  },
}
);


router.get('/', async (req, res) => {
  const { prompt, user_id } = req.query;

  if (!prompt || !user_id) {
    return handleBadRequestError(res, "Prompt and user_id are required.");
  }


  const promptTemplate = `
    You are a helpful assistant that interprets a user's request. Based on the prompt, determine whether the user is searching for friends or events.
    If the user is searching for friends, fill in the following details:
    - query (empty if not explicitly stated, otherwise if a user says that people whose name start with a or b or something like that, 'a' or 'b' should go in the query)
    - user_id (given as input)
    - friendship_status (can be "pending", "friends", "rejected" or empty(""). if a user writes friends in the query and you think it is looking for a friend, then put friends. if the propmt says users or people then keep it empty)
    - namestartswith (yes if explicitly stated, otherwise leave empty)
    - order (ASC, DESC, or empty)
    - major (Computer Science, Mathematics, etc. or empty)
    - type_of_student (Undergraduate, Graduate, etc. or empty)
    - year (Freshman, Sophomore, etc. or empty)
    
    If the user is searching for events, fill in the following details:
    - event_name (explicit event name or what it starts with)
    - tags (Technology, Networking, etc. or empty)
    - start_time (timestamp in ISO 8601 format)

    **User Input**: ${prompt}

    Based on the user's request, generate the following JSON response:
    {
      "searchfor": "friend" or "event", keep it empty only in case of user saying search something invalid or something like that
      "query": "value",
      "user_id": ${user_id},
      "friendship_status": "pending/friends/rejected/ ",
      "namestartswith": "yes" or "",
      "order": "ASC/DESC" or "",
      "major": "major" or "",
      "type_of_student": "Undergraduate/Graduate" or "",
      "year": "Freshman/Sophomore/Junior/Senior/Master's/PhD" or "",
      "event_name": "event_name" or "",
      "tags": "Technology/Networking/Health/Art/Education" or "",
      "start_time": "start_time" or ""
    }
  `;

  try {
    const response = await model.generateContent(promptTemplate);
    console.log("Raw AI Response:", response.response.candidates[0].content.parts[0].text);

    const jsonString = response.response.candidates[0].content.parts[0].text.trim();

    const jsonData = JSON.parse(jsonString.replace('```json', '').replace('```', '').trim());

    const { searchfor, ...searchParams } = jsonData;


    if (searchfor === 'friend') {
      res.redirect(`/api/friend/Aisearch?${new URLSearchParams(searchParams).toString()}`);
    } else if (searchfor === 'event') {
      res.redirect(`/api/event/search?${new URLSearchParams(searchParams).toString()}`);
    } else {
      res.status(400).json({ error: "Invalid search type" });
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process prompt" });
  }
});


router.get('/friend', async (req, res) => {
  const { prompt, user_id } = req.query;

  if (!prompt || !user_id) {
    return handleBadRequestError(res, "Prompt and user_id are required.");
  }


  const promptTemplate = `
    You are a helpful assistant that interprets a user's request and helps a user in searching for people or friends based on his prompt, fill in the following details:
    - query (empty if not explicitly stated, otherwise if a user says that people whose name start with a or b or something like that, 'a' or 'b' should go in the query)
    - user_id (given as input)
    - friendship_status (can be "pending", "friends", "rejected" or empty(""). if a user writes friends in the query and you think it is looking for a friend, then put friends. if the propmt says users or people then keep it empty)
    - namestartswith (yes if explicitly stated, otherwise leave empty)
    - order (ASC, DESC, or empty)
    - major (Computer Science, Mathematics, etc. or empty)
    - type_of_student (Undergraduate, Graduate, etc. or empty)
    - year (Freshman, Sophomore, etc. or empty)
    **User Input**: ${prompt}

    Based on the user's request, generate the following JSON response:
    {
      "query": "value",
      "user_id": ${user_id},
      "friendship_status": "pending/friends/rejected/ ",
      "namestartswith": "yes" or "",
      "order": "ASC/DESC" or "",
      "major": "major" or "",
      "type_of_student": "Undergraduate/Graduate" or "",
      "year": "Freshman/Sophomore/Junior/Senior/Master's/PhD" or "",
    }
  `;

  try {
    const response = await model.generateContent(promptTemplate);
    console.log("Raw AI Response:", response.response.candidates[0].content.parts[0].text);

    const jsonString = response.response.candidates[0].content.parts[0].text.trim();

    const jsonData = JSON.parse(jsonString.replace('```json', '').replace('```', '').trim());

    const { searchfor, ...searchParams } = jsonData;


      res.redirect(`/api/friend/Aisearch?${new URLSearchParams(searchParams).toString()}`);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process prompt" });
  }
});


router.get('/event', async (req, res) => {
  const { prompt, user_id } = req.query;

  if (!prompt || !user_id) {
    return handleBadRequestError(res, "Prompt and user_id are required.");
  }


  const promptTemplate = `
    You are a helpful assistant that interprets a user's request. The user is searching for events, fill in the following details based on his prompt:
    - event_name (explicit event name or what it starts with)
    - tags (Technology, Networking, etc. or empty)
    - start_time (timestamp in ISO 8601 format)

    **User Input**: ${prompt}

    Based on the user's request, generate the following JSON response:
    {
      "event_name": "event_name" or "",
      "tags": "Technology/Networking/Health/Art/Education" or "",
      "start_time": "start_time" or ""
    }
  `;

  try {
    const response = await model.generateContent(promptTemplate);
    console.log("Raw AI Response:", response.response.candidates[0].content.parts[0].text);

    const jsonString = response.response.candidates[0].content.parts[0].text.trim();

    const jsonData = JSON.parse(jsonString.replace('```json', '').replace('```', '').trim());

    const { searchfor, ...searchParams } = jsonData;


      res.redirect(`/api/event/search?${new URLSearchParams(searchParams).toString()}`);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process prompt" });
  }
});


module.exports = router;