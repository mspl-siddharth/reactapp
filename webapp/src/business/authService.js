export const authService = {
  createAccount({ username, password, name }) {
    if (!username || !password || !name) {
      throw new Error("All fields are required");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const newUser = { username, password, name };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return newUser;
  },

  login({ username, password }) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem("user");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("user");
  },
};
