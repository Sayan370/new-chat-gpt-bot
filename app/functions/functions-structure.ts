import { ChatCompletionFunctions } from "openai";
import { getDealerShipContactDetails, getOwnerDetails, getSalesDetails } from "./functions-description";

export const functionsData: ChatCompletionFunctions[] = [
    // {
    //     "name": "getDealerShipContactDetails",
    //     "description": "Get the DealerShip contact Informations",
    //     "parameters": {
    //         "type": "object",
    //         "properties": {
    //             "location": {
    //                 "type": "string",
    //                 "description": "The city and state, e.g. San Francisco, CA",
    //             },
    //             "unit": {
    //                 "type": "string",
    //                 "enum": ["celsius", "fahrenheit"]
    //             }
    //         },
    //         "required": ["location"]
    //     }
    // },
    {
        name: "getDealerShipContactDetails",
        description: "Get the DealerShip contact Informations",
        parameters: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "getOwnerDetails",
        description: "Get the Owner Informations",
        parameters: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "getSalesDetails",
        description: "Get the Sales People Informations",
        parameters: {
            type: "object",
            properties: {}
        }
    }
];

export const availableFunctions = {
    "getDealerShipContactDetails": getDealerShipContactDetails,
    "getOwnerDetails": getOwnerDetails,
    "getSalesDetails": getSalesDetails
}