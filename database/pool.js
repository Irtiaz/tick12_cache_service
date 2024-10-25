const { Pool } = require("pg");

const fs = require("fs");
const path = require("path");
require("dotenv/config");

const caCertificatePath = "./database/ca-certificate.crt";
const caCertificate = fs
  .readFileSync(path.resolve(caCertificatePath))
  .toString();

const pool = new Pool({
  connectionString: `postgresql://doadmin:${process.env.POSTGRES_PASSWORD}@template-pg-do-user-18003520-0.g.db.ondigitalocean.com:25061/template-pool`,
  ssl: {
    rejectUnauthorized: true,
    ca: caCertificate,
    checkServerIdentity: () => undefined,
    servername: "template-pg-do-user-18003520-0.g.db.ondigitalocean.com"
  }
});

module.exports = { pool };

