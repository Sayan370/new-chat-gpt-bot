import dotenv from "dotenv";
import http from 'http';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import express from "express";
import { Server } from "socket.io";
import fs from 'fs';
import { deleteData, getChatData, saveSystemFileData, saveVisitorFileData, sendMessageData } from "./utill/read-write";
import { openApiCallGpt } from "./services/openai-api";
import bodyParser from "body-parser";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;
// OpenAI API configuration

app.use(express.static("public"));
app.use(bodyParser.json());
app.get('/getSystemPromptData', (req, res) => {
  return res.send(getChatData('', 'system'));
});
app.post('/saveSystemPromptData', (req, res) => {
  saveSystemFileData([{ role: 'system', content: req.body.content }]).then((d) => {
    return res.send('Prompt Saved Successfully');
  }).catch((err) => {
    return res.status(500).send(err);
  })
});
export type userType = 'visitor' | 'system';
io.on("connection", (socket) => {
  socket.emit("initialized");
  console.log(socket.id);
  console.log("New user connected");
  // Initialize the conversation history
  socket.on("sendMessage", async (message: ChatCompletionRequestMessage, callback) => {
    // Add the user message to the conversation history
    let newConversationHistory: ChatCompletionRequestMessage[] = [];
    sendMessageData(socket.id, message);
    newConversationHistory.push(...getChatData(socket.id, 'system'));
    newConversationHistory.push(...getChatData(socket.id, 'visitor'));
    socket.emit("typing", true);
    const completion = openApiCallGpt(newConversationHistory).then((completion) => {
      console.log(completion.data.usage);
      const response = completion.data?.choices[0]?.message?.content;
      if (completion.data?.choices[0]?.message) {
        saveVisitorFileData(socket.id, completion.data?.choices[0]?.message);
      }
      // Add the assistant's response to the conversation history
      const sendResp = {
        response: response,
        totalTokens: completion?.data?.usage?.total_tokens
      }
      socket.emit("message", sendResp);
      callback();
    }).catch((error) => {
      console.error(error);
      callback(error);
    });
  });

  socket.on("sendInitialData", (initialData: [ChatCompletionRequestMessage & { active: boolean }]) => {
    if (socket.id && initialData) {
      const newArray = initialData.map(({ active, ...keepAttrs }) => keepAttrs)
      saveVisitorFileData(socket.id, newArray);
    }
  });
  socket.on("removeLocalStorageData", () => {
    deleteData(socket.id, "visitor");
  });
  socket.on("disconnect", () => {
    deleteData(socket.id, "visitor");
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});