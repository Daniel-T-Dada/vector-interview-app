// This is a simple in-memory data store for users
// In a real application, you would use a database

// Initial mock user
const initialUsers = [
    {
        id: "1",
        name: "Demo User",
        email: "user@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
    },

    {
        id: "2",
        name: "Double D",
        email: "double_d@vector.com",
        password: "password123",
        createdAt: new Date().toISOString(),
    },
];

// Users data store
let users = [...initialUsers];

// Get all users
export function getAllUsers() {
    return users.map(({ password, ...user }) => user); // Remove passwords from the response
}

// Get user by email
export function getUserByEmail(email) {
    return users.find((user) => user.email === email);
}

// Get user by ID
export function getUserById(id) {
    return users.find((user) => user.id === id);
}

// Create a new user
export function createUser({ name, email, password }) {
    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
        return null;
    }

    // Create new user
    const newUser = {
        id: String(users.length + 1),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
    };

    // Add to users array
    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

// Authenticate user
export function authenticateUser(email, password) {
    const user = getUserByEmail(email);
    if (user && user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

// Get total user count
export function getUserCount() {
    return users.length;
} 