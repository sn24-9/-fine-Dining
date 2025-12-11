app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    // Check if user exists
    const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    db.prepare(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`)
      .run(name, email, hashedPassword);

    res.json({ success: true, message: "Account created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});
function requireAuth(req, res, next) {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
