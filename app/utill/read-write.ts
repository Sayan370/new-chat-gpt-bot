import fs from 'fs';
import { ChatCompletionRequestMessage } from 'openai';

const staticVisitorCommonPath = './database/visitor/' // path to our JSON file
const staticSystemPath = './database/system/system.json' // path to our JSON file

// util functions

export const saveVisitorFileData = (userId: string, chatData: ChatCompletionRequestMessage | ChatCompletionRequestMessage[]) => {
    const stringifyData = JSON.stringify(chatData);
    if (fs.existsSync(`${staticVisitorCommonPath}${userId}.json`)) {
        const file = fs.readFileSync(`${staticVisitorCommonPath}${userId}.json`, 'utf8');
        if (file.length == 0) {
            fs.writeFileSync(`${staticVisitorCommonPath}${userId}.json`, stringifyData);
        } else {
            const json = JSON.parse(file.toString())
            //add json element to json object
            json.push(chatData);
            fs.writeFileSync(`${staticVisitorCommonPath}${userId}.json`, JSON.stringify(json))
        }
    } else {
        fs.writeFileSync(`${staticVisitorCommonPath}${userId}.json`, stringifyData);
    }
}
export const saveSystemFileData = async (chatData: { role: userType, content: string }[]) => {
    const stringifyData = JSON.stringify(chatData);
    try {
        if (fs.existsSync(`${staticSystemPath}`)) {
            const file = fs.readFileSync(`${staticSystemPath}`, 'utf8');
            return await fs.writeFileSync(`${staticSystemPath}`, stringifyData);
        } else {
            return await fs.writeFileSync(`${staticSystemPath}`, stringifyData);
        }
    } catch (err) {
        console.error('Error occurred while Saving File:', err)
    }
}
export const getChatData = (userId: string, type: userType): ChatCompletionRequestMessage[] => {
    let jsonData: ChatCompletionRequestMessage[];
    if (type == "system") {
        jsonData = JSON.parse(fs.readFileSync(`${staticSystemPath}`, 'utf8'));
    } else {
        jsonData = JSON.parse(fs.readFileSync(`${staticVisitorCommonPath}${userId}.json`, 'utf8'));
    }
    return jsonData;
}

export const sendMessageData = (socketId: string, message: ChatCompletionRequestMessage) => {
    if (fs.existsSync(`${staticVisitorCommonPath}${socketId}.json`)) {
        const file = fs.readFileSync(`${staticVisitorCommonPath}${socketId}.json`, 'utf8');
        if (file.length == 0) {
            saveVisitorFileData(socketId, [message]);
        } else {
            saveVisitorFileData(socketId, message);
        }
    } else {
        saveVisitorFileData(socketId, [message]);
    }
}
export const deleteData = (socketId: string, type: userType) => {
    if (type == "visitor") {
        fs.rmSync(`${staticVisitorCommonPath}${socketId}.json`, {
            force: true,
        });
    }
}
export type userType = 'visitor' | 'system';
