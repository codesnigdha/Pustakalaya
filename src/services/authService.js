const USERS_KEY = "pustakalaya_users";
const CURRENT_USER_KEY = "pustakalaya_current_user";

/* =====================================================
   GET ALL USERS FROM LOCAL STORAGE
===================================================== */

const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);

    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Unable to read users:", error);
    return [];
  }
};

/* =====================================================
   SAVE USERS
===================================================== */

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/* =====================================================
   REGISTER USER
===================================================== */

export const registerUser = (userData) => {
  const users = getUsers();

  const email = userData.email?.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.email?.toLowerCase() === email,
  );

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  const newUser = {
    id: Date.now().toString(),

    /* BASIC DETAILS */
    name: userData.name?.trim() || "",
    email: email || "",
    age: Number(userData.age) || null,
    phone: userData.phone?.trim() || "",

    /* ACCOUNT */
    role: userData.role || "Student",

    /* USER DETAILS */
    accountType: userData.accountType || null,

    course: userData.course?.trim() || "",

    department: userData.department?.trim() || "",

    semester: userData.semester || "",

    rollNumber: userData.rollNumber?.trim() || "",

    libraryRegistrationNumber: userData.libraryRegistrationNumber?.trim() || "",

    /* TEACHER DETAILS */
    employeeId: userData.employeeId?.trim() || "",

    /* LIBRARIAN DETAILS */
    designation: userData.designation?.trim() || "",

    libraryStaffId: userData.libraryStaffId?.trim() || "",

    /* AUTH */
    password: userData.password || "",

    createdAt: new Date().toISOString(),

    /* USER DATA */
    wishlist: [],
    borrowedBooks: [],
    notifications: [],
  };

  users.push(newUser);

  saveUsers(users);

  return {
    success: true,
    message: "Account created successfully.",
    user: removePassword(newUser),
  };
};

/* =====================================================
   REMOVE PASSWORD
===================================================== */

const removePassword = (user) => {
  const safeUser = { ...user };

  delete safeUser.password;

  return safeUser;
};

/* =====================================================
   LOGIN
===================================================== */

export const loginUser = (email, password) => {
  const users = getUsers();

  const user = users.find(
    (item) =>
      item.email?.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password,
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const safeUser = removePassword(user);

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

  return {
    success: true,
    message: "Login successful.",
    user: safeUser,
  };
};

/* =====================================================
   LOGOUT
===================================================== */

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

/* =====================================================
   GET CURRENT USER
===================================================== */

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);

    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Unable to read current user:", error);

    return null;
  }
};

/* =====================================================
   CHECK LOGIN
===================================================== */

export const isLoggedIn = () => {
  return Boolean(getCurrentUser());
};

/* =====================================================
   GET ALL USERS
===================================================== */

export const getAllUsers = () => {
  return getUsers().map(removePassword);
};

/* =====================================================
   GET USER BY ID
===================================================== */

export const getUserById = (userId) => {
  const users = getUsers();

  const user = users.find((item) => item.id === userId);

  return user ? removePassword(user) : null;
};

/* =====================================================
   UPDATE USER
===================================================== */

export const updateUser = (userId, updatedData) => {
  const users = getUsers();

  const index = users.findIndex((user) => user.id === userId);

  if (index === -1) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  const updatedUser = {
    ...users[index],
    ...updatedData,
    id: users[index].id,
    email: users[index].email,
  };

  users[index] = updatedUser;

  saveUsers(users);

  const safeUser = removePassword(updatedUser);

  /* Update currently logged-in user */
  const currentUser = getCurrentUser();

  if (currentUser && currentUser.id === userId) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  }

  return {
    success: true,
    message: "Profile updated successfully.",
    user: safeUser,
  };
};

/* =====================================================
   DELETE USER
===================================================== */

export const deleteUser = (userId) => {
  const users = getUsers();

  const filteredUsers = users.filter((user) => user.id !== userId);

  if (filteredUsers.length === users.length) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  saveUsers(filteredUsers);

  return {
    success: true,
    message: "User deleted successfully.",
  };
};
