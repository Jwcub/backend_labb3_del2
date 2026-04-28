"use strict";

document.addEventListener("DOMContentLoaded", () => {
    renderJobs();
}); 

async function getJobs() {
    try {
        const res = await fetch("https://backend-labb2.vercel.app/jobs");
        return await res.json();

    } catch(error) {
        console.error("Ett fel uppstod" + error);
    }
}

async function renderJobs() {
    const jobs = await getJobs();
    let tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    // Skriver ut varje jobb, ett i taget
    jobs.forEach(job => {
        const tableRow = document.createElement("tr");

        let enddate = "";
        if(job.enddate === null) {
            enddate = "Pågående"
        } else {
            enddate = job.enddate;
        }

        tableRow.innerHTML = `
            <td data-label="Företag">${job.companyname}</td>
            <td data-label="Roll">${job.jobtitle}</td>
            <td data-label="Ort">${job.joblocation}</td>
            <td data-label="Började">${job.startdate}</td>
            <td data-label="Slutade">${enddate}</td>
            <td data-label="Beskrivning" colspan="2">${job.description}</td>
        `;

        // Lägger till knapp för radering
        const deleteCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Radera"
        deleteBtn.classList.add("delete-btn");
        deleteCell.appendChild(deleteBtn);
        tableRow.appendChild(deleteCell);

        deleteBtn.addEventListener("click", () => {
            tableRow.remove;
            deleteJobb(job.id) 
        });

        // Lägger till rad i DOM
        tableBody.appendChild(tableRow);

    });
}

async function deleteJobb(id) {
    const url = "https://backend-labb2.vercel.app/jobs/" + id;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json;
        if(!result) {
            console.log("Jobb kunde inte raderas")
        } else {
            renderJobs()
        }
        
    } catch(error) {
        console.error("Fel: " + error);
    }
}

