const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "juristrack"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL");

    // Clear existing demo data
    console.log("Clearing existing demo data...");
    db.query("DELETE FROM Case_File", (err, result) => {
        if (err) {
            console.error("Error clearing data:", err);
            process.exit(1);
        }
        console.log(`Cleared ${result.affectedRows} rows from Case_File`);

        // Modify Case_No column to accept text
        console.log("Modifying Case_No column to accept text values...");
        db.query("ALTER TABLE Case_File MODIFY COLUMN Case_No VARCHAR(50)", (err, result) => {
            if (err) {
                console.error("Error modifying column:", err);
                process.exit(1);
            }
            console.log("Successfully modified Case_No column to VARCHAR(50)");

            // Test insertion
            console.log("Testing insertion with text Case_No...");
            db.query(
                "INSERT INTO Case_File (Case_No, Type, Date_Filed) VALUES (?, ?, ?)",
                ['TEST-001', 'Test Case', '2026-05-05'],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting test data:", err);
                        process.exit(1);
                    }
                    console.log("Successfully inserted test case");

                    // Clean up test data
                    db.query("DELETE FROM Case_File WHERE Case_No = 'TEST-001'", (err, result) => {
                        if (err) {
                            console.error("Error cleaning up test data:", err);
                        } else {
                            console.log("Cleaned up test data");
                        }
                        
                        console.log("Database setup complete!");
                        db.end();
                    });
                }
            );
        });
    });
});
