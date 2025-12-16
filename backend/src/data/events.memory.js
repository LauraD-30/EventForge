export const events = []; // { id, email, passwordHash, role }

let _id = 106;
export function nextId()      { return _id++; }
export function findByTitle(email) { return users.find(u => u.email === email); }
export function findById(id)       { return users.find(u => u.id === id); }
export function insertUser(u)      { users.push(u); return u; }
