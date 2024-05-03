import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { GptModel } from "../enum/gpt-model";
import { availableFunctions, functionsData } from "../functions/functions-structure";
dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const openApiCallGpt = async (conversationHistory: ChatCompletionRequestMessage[]): Promise<any> => {
    return await openai.createChatCompletion({
        model: GptModel.gpt3,
        messages: conversationHistory,
        max_tokens: 1024,
        n: 1,
        temperature: 0.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        functions: functionsData,
        function_call: "auto",
    }).then((d) => {
        let response_message = d.data?.choices[0]?.message;
        if (response_message.function_call) {
            let function_name = response_message.function_call.name
            let fuction_to_call = availableFunctions[function_name]
            let function_args = JSON.parse(response_message.function_call.arguments);
            let function_response = fuction_to_call(function_args["location"], function_args["unit"]);
            conversationHistory.push(response_message);
            conversationHistory.push({
                "role": "function",
                "name": function_name,
                "content": function_response,
            });
            return callFunctionWithGpt(conversationHistory);
        } else {
            return d;
        }
    });
}

export const callFunctionWithGpt = async (conversationHistory: ChatCompletionRequestMessage[]): Promise<any> => {
    return await openai.createChatCompletion({
        model: GptModel.gpt3,
        messages: conversationHistory,
        max_tokens: 100,
        n: 1,
        temperature: 0.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.6
    });
}