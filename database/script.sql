CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT true,
    security_question VARCHAR(255),
    security_answer VARCHAR(255),
    profile_picture TEXT,
    font_size VARCHAR(50) DEFAULT 'normal',
    font_family VARCHAR(50) DEFAULT 'Inter'
);

CREATE TABLE bank_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    account_type VARCHAR(100) NOT NULL,
    account_number VARCHAR(255),
    card_number VARCHAR(255),
    cvv VARCHAR(255),
    expiry_date VARCHAR(50),
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.0,
    color VARCHAR(50),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    color VARCHAR(50),
    bank_account_id INTEGER NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    spent DECIMAL(15,2) NOT NULL DEFAULT 0.0,
    total DECIMAL(15,2) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    color VARCHAR(50),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true
);

CREATE TABLE savings_goals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    saved DECIMAL(15,2) NOT NULL DEFAULT 0.0,
    total DECIMAL(15,2) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    remaining DECIMAL(15,2) NOT NULL,
    color VARCHAR(50),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true
);
