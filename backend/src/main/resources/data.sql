INSERT IGNORE INTO users (id, username, email, password) VALUES (1, 'Admin Finova', 'admin@finova.com', '123456');
INSERT IGNORE INTO users (id, username, email, password) VALUES (2, 'Marlon', 'marlon@finova.com', '123456');

INSERT IGNORE INTO bank_accounts (id, name, account_type, balance, color) VALUES (1, 'Banco Pichincha', 'Cuenta principal', 5200.00, 'emerald');
INSERT IGNORE INTO bank_accounts (id, name, account_type, balance, color) VALUES (2, 'Produbanco', 'Cuenta de ahorro', 2900.00, 'blue');
INSERT IGNORE INTO bank_accounts (id, name, account_type, balance, color) VALUES (3, 'Banco Guayaquil', 'Cuenta secundaria', 4350.00, 'amber');

INSERT IGNORE INTO transactions (id, date, description, transaction_type, amount, color, bank_account_id) VALUES (1, '2026-05-18', 'Netflix', 'Gasto', -12.00, 'rose', 1);
INSERT IGNORE INTO transactions (id, date, description, transaction_type, amount, color, bank_account_id) VALUES (2, '2026-05-18', 'Salario', 'Ingreso', 900.00, 'emerald', 1);
INSERT IGNORE INTO transactions (id, date, description, transaction_type, amount, color, bank_account_id) VALUES (3, '2026-05-17', 'Uber', 'Gasto', -25.00, 'rose', 2);
INSERT IGNORE INTO transactions (id, date, description, transaction_type, amount, color, bank_account_id) VALUES (4, '2026-05-27', 'Steam', 'Gasto', -50.00, 'rose', 3);

INSERT IGNORE INTO budgets (id, title, spent, total, progress, color) VALUES (1, 'Alimentación', 300.00, 500.00, 60, 'emerald');
INSERT IGNORE INTO budgets (id, title, spent, total, progress, color) VALUES (2, 'Transporte', 90.00, 200.00, 45, 'blue');
INSERT IGNORE INTO budgets (id, title, spent, total, progress, color) VALUES (3, 'Entretenimiento', 160.00, 200.00, 80, 'amber');
INSERT IGNORE INTO budgets (id, title, spent, total, progress, color) VALUES (4, 'Educación', 70.00, 200.00, 35, 'rose');

INSERT IGNORE INTO savings_goal (id, title, saved, total, progress, remaining, color) VALUES (1, 'Laptop', 1300.00, 2000.00, 65, 700.00, 'emerald');
INSERT IGNORE INTO savings_goal (id, title, saved, total, progress, remaining, color) VALUES (2, 'Viaje a la Playa', 400.00, 1000.00, 40, 600.00, 'blue');
INSERT IGNORE INTO savings_goal (id, title, saved, total, progress, remaining, color) VALUES (3, 'Mazda CX-30', 3000.00, 15000.00, 20, 12000.00, 'amber');
INSERT IGNORE INTO savings_goal (id, title, saved, total, progress, remaining, color) VALUES (4, 'Fondo Emergencia', 1700.00, 2000.00, 85, 300.00, 'rose');
