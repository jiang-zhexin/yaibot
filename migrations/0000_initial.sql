CREATE TABLE inlines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  title TEXT,
  description TEXT, 
  entities TEXT, 
  file_id TEXT, 
  mark INTEGER
);