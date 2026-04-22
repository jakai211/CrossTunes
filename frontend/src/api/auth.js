const API_URL = "http://localhost:5000/api"; // change if needed

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return await res.json();
  } catch (err) {
    return { error: "Server error" };
  }
}

export async function registerUser(email, password, username) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });

    return await res.json();
  } catch (err) {
    return { error: "Server error" };
  }
}