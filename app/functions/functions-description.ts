// export const getDealerShipContactDetails = (location: string, unit: string = "fahrenheit") => {
//     let weather_info = {
//         "location": location,
//         "working-hours": "Monday to Saturday from 8 am to 6 pm EST",
//         "unit": unit,
//         "forecast": ["sunny", "windy"],
//     }
//     return JSON.stringify(weather_info);
// }
export const getDealerShipContactDetails = () => {
    return JSON.stringify({
        "address": "210 S Pinellas Ave Suite 195, Tarpon Springs, FL 34689, United States",
        "working-hours": "Monday to Saturday from 8 am to 6 pm EST",
        "email": "sales@carchat24.com",
        "phone": "1-800-510-7567",
        "website": "carchat24.com"
    });
}
export const getOwnerDetails = () => {
    return JSON.stringify({
        "owners": ["Shereef Moawad", "Patty Moawad"]
    });
}
export const getSalesDetails = () => {
    return JSON.stringify({
        "sales-people": ["Alicia Fillion", "Jeff Sterns", "Richard Mycka"],
    });
}