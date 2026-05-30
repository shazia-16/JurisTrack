// 📅 Date
function setTodayDate() {
    const today = new Date();
    document.getElementById("todayPill").textContent =
        today.toLocaleDateString();
}

// 📥 Load cases from backend
async function loadCases() {
    const res = await fetch("http://localhost:3000/cases");
    const data = await res.json();

    const tbody = document.getElementById("casesTbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No cases yet. Add one above.</td></tr>`;
        return;
    }

    data.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.Case_No}</td>
                <td>${c.Type}</td>
                <td>${c.Date_Filed ? c.Date_Filed.split("T")[0] : ""}</td>
                <td>-</td>
                <td><button onclick="deleteCase(${c.Case_No})">Delete</button></td>
            </tr>
        `;
    });
}

// 👨‍⚖️ Load judges from backend
async function loadJudges() {
    const res = await fetch("http://localhost:3000/judges");
    const data = await res.json();

    const tbody = document.getElementById("judgesTbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No judges yet</td></tr>`;
        return;
    }

    data.forEach(judge => {
        tbody.innerHTML += `
            <tr>
                <td>${judge.Judge_ID}</td>
                <td>${judge.Name}</td>
                <td>${judge.Court_ID || '-'}</td>
                <td><button onclick="deleteJudge(${judge.Judge_ID})">Delete</button></td>
            </tr>
        `;
    });
}

// ➕ Add case
document.getElementById("caseForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const Case_No = document.getElementById("caseNo").value;
    const Type = document.getElementById("caseType").value;
    const Date_Filed = document.getElementById("dateFiled").value;

    await fetch("http://localhost:3000/addCase", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Case_No, Type, Date_Filed })
    });

    this.reset();
    loadCases();
});

// ➕ Add judge
document.getElementById("judgeForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const Judge_ID = document.getElementById("judgeId").value;
    const Name = document.getElementById("judgeName").value;
    const Court = document.getElementById("judgeCourt").value;

    await fetch("http://localhost:3000/addJudge", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Judge_ID, Name, Court })
    });

    this.reset();
    loadJudges();
    loadHearings();
});

// 🔍 Search
document.getElementById("caseSearch").addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#casesTbody tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});


// 📅 Load hearings from backend
async function loadHearings() {
    const res = await fetch("http://localhost:3000/hearings");
    const data = await res.json();

    const tbody = document.getElementById("hearingsTbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No hearings yet</td></tr>`;
        return;
    }

    data.forEach(hearing => {
        tbody.innerHTML += `
            <tr>
                <td>${hearing.Case_No}</td>
                <td>${hearing.Date ? hearing.Date.split("T")[0] : ""}</td>
                <td>${hearing.Time}</td>
                <td><button onclick="deleteHearing(${hearing.Hearing_ID})">Delete</button></td>
            </tr>
        `;
    });
}

// ➕ Add hearing
document.getElementById("hearingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const Case_No = document.getElementById("hearingCaseNo").value;
    const Date = document.getElementById("hearingDate").value;
    const Time = document.getElementById("hearingTime").value;

    await fetch("http://localhost:3000/addHearing", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Case_No, Date, Time })
    });

    this.reset();
    loadHearings();
});

// �️ Delete functions
async function deleteCase(caseNo) {
    if (confirm("Are you sure you want to delete this case?")) {
        await fetch(`http://localhost:3000/deleteCase/${caseNo}`, { method: "DELETE" });
        loadCases();
    }
}

async function deleteJudge(judgeId) {
    if (confirm("Are you sure you want to delete this judge?")) {
        await fetch(`http://localhost:3000/deleteJudge/${judgeId}`, { method: "DELETE" });
        loadJudges();
    }
}

async function deleteHearing(hearingId) {
    if (confirm("Are you sure you want to delete this hearing?")) {
        await fetch(`http://localhost:3000/deleteHearing/${hearingId}`, { method: "DELETE" });
        loadHearings();
    }
}

// �� Init
window.onload = function () {
    setTodayDate();
    loadCases();
    loadJudges();
    loadHearings();
};

