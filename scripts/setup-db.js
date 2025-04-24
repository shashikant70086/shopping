#!/usr/bin/env node

/**
 * Script to set up the database with initial user
 * Run with: node scripts/setup-db.js
 */

const { Pool } = require('pg');
const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');
const readline = require('readline');
const { config } = require('dotenv');

// Load environment variables
config();

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function createTables(pool) {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        CONSTRAINT "users_username_unique" UNIQUE("username")
      );
    `);
    console.log('✅ Users table created or already exists');

    // Create session table for session storage
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL PRIMARY KEY,
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log('✅ Session table created or already exists');

    return true;
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    return false;
  }
}

async function createDefaultUser(pool) {
  try {
    // Check if default user exists
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', ['shopping']);
    
    if (rows.length === 0) {
      const hashedPassword = await hashPassword('shopping123');
      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        ['shopping', hashedPassword]
      );
      console.log('✅ Default user created (username: shopping, password: shopping123)');
    } else {
      console.log('ℹ️ Default user already exists');
    }
    return true;
  } catch (err) {
    console.error('❌ Error creating default user:', err);
    return false;
  }
}

async function createCustomUser(pool) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Would you like to create a custom user? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.question('Enter username: ', async (username) => {
          rl.question('Enter password: ', async (password) => {
            try {
              const hashedPassword = await hashPassword(password);
              await pool.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password = $2',
                [username, hashedPassword]
              );
              console.log(`✅ User "${username}" created or updated successfully`);
              rl.close();
              resolve(true);
            } catch (err) {
              console.error('❌ Error creating custom user:', err);
              rl.close();
              resolve(false);
            }
          });
        });
      } else {
        rl.close();
        resolve(false);
      }
    });
  });
}

async function main() {
  console.log('🔧 Setting up database...');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set.');
    console.log('Please create a .env file with DATABASE_URL=postgresql://username:password@localhost:5432/dbname');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Check connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database');

    // Create tables
    const tablesCreated = await createTables(pool);
    if (!tablesCreated) {
      throw new Error('Failed to create tables');
    }

    // Create default user
    const defaultUserCreated = await createDefaultUser(pool);
    if (!defaultUserCreated) {
      throw new Error('Failed to create default user');
    }

    // Offer to create custom user
    await createCustomUser(pool);

    console.log('🎉 Database setup complete!');
    console.log('You can now run "npm run dev" to start the application');
  } catch (err) {
    console.error('❌ Setup failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();