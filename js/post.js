"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("add-workexperience");
    form.addEventListener("submit", addWorkexperience);

}); 

async function addWorkexperience(event) {
    event.preventDefault();

    // Container för felmeddelanden
    const messageEl = document.getElementById("message");
    messageEl.innerHTML = "";
    let errorMessages = [];

    // Inputfält
    const companyInput = document.getElementById("company-name");
    const titleInput = document.getElementById("job-title");
    const locationInput = document.getElementById("job-location");
    const startdateInput = document.getElementById("start-date");
    const enddateInput = document.getElementById("end-date");
    const descInput = document.getElementById("job-description")

    // Inputvärden
    const companyValue = companyInput.value;
    const titleValue = titleInput.value;
    const locationValue = locationInput.value;
    const startdateValue = startdateInput.value;
    const enddateValue = enddateInput.value;
    const descValue = descInput.value;

    // Kontrollerar värden i fält
    if(companyValue.length < 2) {
        errorMessages.push("företagsnamn");
    } if(titleValue.length < 2) {
        errorMessages.push("roll");
    } if(locationValue.length < 2) {
        errorMessages.push("ort");
    } if(startdateValue < 2) {
        errorMessages.push("startdatum");
    } if(descValue < 2) {
        errorMessages.push("arbetsbeskrivning")
    } if (errorMessages.length > 0) {
        for (const message of errorMessages) {
            messageEl.innerHTML += `<span>Du måste ange ${message}</span>`;
        }
        return; 
    }

    // Skicka värden till databas
    const newJob = { companyname: companyValue, jobtitle: titleValue, joblocation: locationValue, startdate: startdateValue, enddate: enddateValue, description: descValue };

    const result = await postNewJob("https://backend-labb2.vercel.app/jobs", newJob);

    // Hantering av händelse efter skickat till databas
    if(result) {
        companyInput.value = "";
        titleInput.value = "";
        locationInput.value = "";
        startdateInput.value = "åååå-mm-dd";
        enddateInput.value = "åååå-mm-dd";
        descInput.value = "";

        messageEl.innerHTML = `Jobb vid ${companyValue} tillagd`;

        messageEl.innerHTML = `Jobb vid ${result.companyname} tillagd`;
   
    } else {
        messageEl.innerHTML = "Något gick fel, försök igen.";
    }
}

async function postNewJob(url, jobdata) {
    try {
        const response = await fetch(url , {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jobdata)
        });

        if(!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.json();
        return result;

    } catch(error) {
        console.error("Fel:", error);
        return null;
    }
}