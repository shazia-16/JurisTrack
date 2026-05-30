const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "juristrack"
});

db.connect(err => {
    if (err) console.error(err);
    else console.log("Connected to MySQL");
});

app.post("/addCase", (req, res) => {
    const { id, title, status, court, next_hearing_date } = req.body;
    console.log("POST /addCase - Request body:", { id, title, status, court, next_hearing_date });

    // Generate case ID if not provided
    let caseId = id;
    if (!caseId) {
        // Generate a new case ID (get max + 1)
        db.query("SELECT MAX(CAST(SUBSTRING(id, 5) AS UNSIGNED)) as maxCase FROM cases WHERE id LIKE 'CASE%'", (err, result) => {
            if (err) return res.status(500).send(err);
            const maxCaseNum = result[0]?.maxCase || 0;
            caseId = `CASE${String(maxCaseNum + 1).padStart(4, '0')}`;
            
            db.query(
                "INSERT INTO cases (id, title, status, court, next_hearing_date) VALUES (?, ?, ?, ?, ?)",
                [caseId, title, status || 'Active', court, next_hearing_date],
                (err, result) => {
                    if (err) return res.status(500).send(err);
                    console.log("POST /addCase - Insert result:", result);
                    console.log("POST /addCase - Generated Case ID:", caseId);
                    res.send(`Case added with ID: ${caseId}`);
                }
            );
        });
    } else {
        // Use the provided case ID
        db.query(
            "INSERT INTO cases (id, title, status, court, next_hearing_date) VALUES (?, ?, ?, ?, ?)",
            [caseId, title, status || 'Active', court, next_hearing_date],
            (err, result) => {
                if (err) return res.status(500).send(err);
                console.log("POST /addCase - Insert result:", result);
                res.send("Case added");
            }
        );
    }
});

app.get("/cases", (req, res) => {
    console.log("GET /cases - Retrieving cases");
    db.query("SELECT * FROM cases", (err, result) => {
        if (err) return res.status(500).send(err);
        console.log("GET /cases - Result:", result);
        res.json(result);
    });
});

// POST /api/cases - Create new case
app.post("/api/cases", (req, res) => {
    const { title, status, court, next_hearing_date } = req.body;
    console.log("POST /api/cases - Request body:", { title, status, court, next_hearing_date });

    // Validate required fields
    if (!title || !status || !court) {
        return res.status(400).json({ 
            error: 'Missing required fields', 
            required: ['title', 'status', 'court'] 
        });
    }

    // Generate case ID
    db.query("SELECT MAX(CAST(SUBSTRING(id, 5) AS UNSIGNED)) as maxCase FROM cases WHERE id LIKE 'CASE%'", (err, result) => {
        if (err) return res.status(500).send(err);
        const maxCaseNum = result[0]?.maxCase || 0;
        const caseId = `CASE${String(maxCaseNum + 1).padStart(4, '0')}`;
        
        const query = `
            INSERT INTO cases (id, title, status, court, next_hearing_date) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        db.query(query, [caseId, title, status, court, next_hearing_date || null], (err, result) => {
            if (err) {
                console.error("Error creating case:", err);
                return res.status(500).json({ error: 'Failed to create case' });
            }
            
            console.log("POST /api/cases - Case created successfully:", caseId);
            res.status(201).json({ 
                message: 'Case created successfully', 
                caseId,
                data: { id: caseId, title, status, court, next_hearing_date }
            });
        });
    });
});

// PUT /api/cases/:id - Update existing case
app.put("/api/cases/:id", (req, res) => {
    const { id } = req.params;
    const { title, status, court, next_hearing_date } = req.body;
    console.log("PUT /api/cases/:id - Request:", { id, title, status, court, next_hearing_date });

    // Validate required fields
    if (!title || !status || !court) {
        return res.status(400).json({ 
            error: 'Missing required fields', 
            required: ['title', 'status', 'court'] 
        });
    }

    // Check if case exists
    db.query("SELECT id FROM cases WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Case not found' });
        }

        const query = `
            UPDATE cases 
            SET title = ?, status = ?, court = ?, next_hearing_date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        db.query(query, [title, status, court, next_hearing_date || null, id], (err, result) => {
            if (err) {
                console.error("Error updating case:", err);
                return res.status(500).json({ error: 'Failed to update case' });
            }
            
            console.log("PUT /api/cases/:id - Case updated successfully:", id);
            res.json({ 
                message: 'Case updated successfully', 
                data: { id, title, status, court, next_hearing_date }
            });
        });
    });
});

// GET /api/cases/:id - Get single case
app.get("/api/cases/:id", (req, res) => {
    const { id } = req.params;
    console.log("GET /api/cases/:id - Fetching case:", id);
    
    db.query("SELECT * FROM cases WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error fetching case:", err);
            return res.status(500).json({ error: 'Failed to fetch case' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Case not found' });
        }
        
        console.log("GET /api/cases/:id - Result:", result[0]);
        res.json(result[0]);
    });
});


app.post("/addJudge", (req, res) => {
    const { name, email, phone, court } = req.body;
    console.log("POST /addJudge - Request body:", { name, email, phone, court });

    db.query(
        "INSERT INTO judges (name, email, phone, court) VALUES (?, ?, ?, ?)",
        [name, email, phone, court],
        (err, result) => {
            if (err) return res.status(500).send(err);
            console.log("POST /addJudge - Insert result:", result);
            res.send("Judge added");
        }
    );
});

app.get("/judges", (req, res) => {
    db.query("SELECT * FROM judges", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post("/addHearing", (req, res) => {
    const { id, type, date, time, courtroom, status, judge, case_id } = req.body;

    // Generate hearing ID if not provided
    let hearingId = id;
    if (!hearingId) {
        db.query("SELECT MAX(CAST(SUBSTRING(id, 4) AS UNSIGNED)) as maxHearing FROM hearings WHERE id LIKE 'HRG%'", (err, result) => {
            if (err) return res.status(500).send(err);
            const maxHearingNum = result[0]?.maxHearing || 0;
            hearingId = `HRG${String(maxHearingNum + 1).padStart(4, '0')}`;
            
            db.query(
                "INSERT INTO hearings (id, type, date, time, courtroom, status, judge, case_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [hearingId, type, date, time, courtroom, status || 'Scheduled', judge, case_id],
                (err, result) => {
                    if (err) return res.status(500).send(err);
                    res.send("Hearing added");
                }
            );
        });
    } else {
        db.query(
            "INSERT INTO hearings (id, type, date, time, courtroom, status, judge, case_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [hearingId, type, date, time, courtroom, status || 'Scheduled', judge, case_id],
            (err, result) => {
                if (err) return res.status(500).send(err);
                res.send("Hearing added");
            }
        );
    }
});

app.get("/hearings", (req, res) => {
    db.query("SELECT * FROM hearings", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// 🗑️ Delete endpoints
app.delete("/deleteCase/:caseId", (req, res) => {
    const { caseId } = req.params;
    console.log("DELETE /deleteCase - Case ID:", caseId);
    
    db.query("DELETE FROM cases WHERE id = ?", [caseId], (err, result) => {
        if (err) return res.status(500).send(err);
        console.log("DELETE /deleteCase - Result:", result);
        res.send("Case deleted");
    });
});

app.delete("/deleteJudge/:judgeId", (req, res) => {
    const { judgeId } = req.params;
    console.log("DELETE /deleteJudge - Judge ID:", judgeId);
    
    db.query("DELETE FROM judges WHERE id = ?", [judgeId], (err, result) => {
        if (err) return res.status(500).send(err);
        console.log("DELETE /deleteJudge - Result:", result);
        res.send("Judge deleted");
    });
});

app.delete("/deleteHearing/:hearingId", (req, res) => {
    const { hearingId } = req.params;
    console.log("DELETE /deleteHearing - Hearing ID:", hearingId);
    
    db.query("DELETE FROM hearings WHERE id = ?", [hearingId], (err, result) => {
        if (err) return res.status(500).send(err);
        console.log("DELETE /deleteHearing - Result:", result);
        res.send("Hearing deleted");
    });
});

// Dashboard API endpoint for aggregated statistics
app.get("/api/dashboard", (req, res) => {
    console.log("GET /api/dashboard - Fetching dashboard statistics");
    
    const queries = {
        totalCases: "SELECT COUNT(*) as count FROM cases",
        activeCases: "SELECT COUNT(*) as count FROM cases WHERE status = 'Active'",
        closedCases: "SELECT COUNT(*) as count FROM cases WHERE status = 'Closed'",
        pendingCases: "SELECT COUNT(*) as count FROM cases WHERE status = 'Pending'",
        totalClients: "SELECT COUNT(*) as count FROM clients",
        totalJudges: "SELECT COUNT(*) as count FROM judges",
        totalHearings: "SELECT COUNT(*) as count FROM hearings",
        upcomingHearings: "SELECT COUNT(*) as count FROM hearings WHERE date >= CURDATE() AND status = 'Scheduled'",
        todayHearings: "SELECT COUNT(*) as count FROM hearings WHERE date = CURDATE()",
        completedHearings: "SELECT COUNT(*) as count FROM hearings WHERE status = 'Completed'"
    };

    const results = {};
    let completedQueries = 0;
    const totalQueries = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
        db.query(query, (err, result) => {
            if (err) {
                console.error(`Error in ${key} query:`, err);
                results[key] = 0;
            } else {
                results[key] = result[0]?.count || 0;
            }
            
            completedQueries++;
            if (completedQueries === totalQueries) {
                console.log("GET /api/dashboard - Results:", results);
                res.json(results);
            }
        });
    });
});

// Recent cases endpoint
app.get("/api/recent-cases", (req, res) => {
    console.log("GET /api/recent-cases - Fetching recent cases");
    
    const query = `
        SELECT c.id, c.title, c.status, c.court, c.next_hearing_date, c.created_at
        FROM cases c
        ORDER BY c.created_at DESC
        LIMIT 5
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching recent cases:", err);
            return res.status(500).send(err);
        }
        console.log("GET /api/recent-cases - Result:", result);
        res.json(result);
    });
});

// Upcoming hearings endpoint
app.get("/api/upcoming-hearings", (req, res) => {
    console.log("GET /api/upcoming-hearings - Fetching upcoming hearings");
    
    const query = `
        SELECT h.id, h.type, h.date, h.time, h.courtroom, h.status, h.judge,
               c.title as case_title, c.id as case_id
        FROM hearings h
        JOIN cases c ON h.case_id = c.id
        WHERE h.date >= CURDATE()
        ORDER BY h.date ASC, h.time ASC
        LIMIT 5
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching upcoming hearings:", err);
            return res.status(500).send(err);
        }
        console.log("GET /api/upcoming-hearings - Result:", result);
        res.json(result);
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
