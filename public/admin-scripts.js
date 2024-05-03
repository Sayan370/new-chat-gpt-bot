const txtPromptText = document.getElementById("txtPromptText");
const txtSuccessMsg = document.getElementById("txtSuccessMsg");
const txtErrorMsg = document.getElementById("txtErrorMsg");
const txtxErrText = document.getElementById("txtxErrText");
const responseHolder = document.getElementById("responseHolder");
let isFormSubmitting = false;
function getAdminPrompts() {
    fetch('./getSystemPromptData')
        .then((response) => response.json())
        .then((json) => generateData(json[0]));
}
function generateData(data) {
    txtPromptText.value = data.content;
}
function saveSystemMessage() {
    if (!isFormSubmitting) {
        isFormSubmitting = true;
        updateSystemMessage().then((d) => {
            showResponse(false);
        }).catch((d) => {
            showResponse(true, d.message);
        })
    }
}
function showResponse(isError, message=null) {
    isFormSubmitting = false;
    if (!isError) {
        if (txtSuccessMsg.classList.contains("hide")) {
            txtSuccessMsg.classList.remove("hide");
            txtSuccessMsg.classList.add("show");
            responseHolder.classList.remove("d-none");
            responseHolder.classList.add("d-block");
            txtErrorMsg.classList.remove("d-block");
            txtErrorMsg.classList.add("d-none");
            setTimeout(() => {
                txtSuccessMsg.classList.add("hide");
                txtSuccessMsg.classList.remove("show");
                responseHolder.classList.remove("d-block");
                responseHolder.classList.add("d-none");
                txtErrorMsg.classList.remove("d-none");
                txtErrorMsg.classList.add("d-block");
            }, 3000);
        }
    } else {
        if (txtErrorMsg.classList.contains("hide")) {
            txtErrorMsg.classList.remove("hide");
            txtErrorMsg.classList.add("show");
            responseHolder.classList.remove("d-none");
            responseHolder.classList.add("d-block");
            txtSuccessMsg.classList.remove("d-block");
            txtSuccessMsg.classList.add("d-none");
            txtxErrText.innerHTML = message;
            setTimeout(() => {
                txtErrorMsg.classList.add("hide");
                txtErrorMsg.classList.remove("show");
                responseHolder.classList.remove("d-block");
                responseHolder.classList.add("d-none");
                txtSuccessMsg.classList.remove("d-none");
                txtSuccessMsg.classList.add("d-block");
            }, 3000);
        }
    }

}
async function updateSystemMessage() {
    const response = await fetch('./saveSystemPromptData', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: txtPromptText.value }), // body data type must match "Content-Type" header
    });
    return response;
}
getAdminPrompts();