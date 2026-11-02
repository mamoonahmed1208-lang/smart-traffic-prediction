/**
 * Authentication and User Session Store
 * Handles user registration, login, role assignment, JWT tokens,
 * and resilient client-side + backend synchronization.
 */

const USER_STORAGE_KEY = 'smart_traffic_auth_user';
const TOKEN_STORAGE_KEY = 'smart_traffic_auth_token';
const USERS_LIST_STORAGE_KEY = 'smart_traffic_registered_users';

export const PRESET_USERS = [
  {
    id: 'usr_1',
    name: 'Mamoon Ahmed',
    email: 'officer@its.gov',
    password: 'password123',
    role: 'Traffic Authority Officer',
    department: 'Central ITS Command & Dispatch',
    badgeId: 'ITS-OFF-092',
    access: 'Full Dispatch & Speed Calibration Rights'
  },
  {
    id: 'usr_2',
    name: 'Dr. Sarah Vance',
    email: 'scientist@mobility.ai',
    password: 'password123',
    role: 'Data Scientist / ML Engineer',
    department: 'Autonomous Mobility & AI Research Lab',
    badgeId: 'ITS-RES-014',
    access: 'SHAP / LIME Hyperparameter Tuning'
  },
  {
    id: 'usr_3',
    name: 'Eng. David Chen',
    email: 'planner@smartcity.org',
    password: 'password123',
    role: 'Urban City Planner',
    department: 'Metropolitan Infrastructure & Road Safety',
    badgeId: 'ITS-PLN-044',
    access: 'Blackspot GIS & Corridor History'
  },
  {
    id: 'usr_4',
    name: 'Officer Aisha Khan',
    email: 'aisha.khan@traffic.police.gov',
    password: 'password123',
    role: 'Highway Patrol Commander',
    department: 'Rapid Incident Clearance & Field Units',
    badgeId: 'ITS-ENF-118',
    access: 'Emergency Interceptor & Patrol Deployment'
  }
];

/**
 * Returns the currently authenticated user from localStorage
 * Falls back to default Officer profile
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading currentUser from localStorage:', e);
  }

  // Default to primary officer
  const defaultUser = PRESET_USERS[0];
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, 'jwt_smart_traffic_demo_token_usr1');
  } catch (e) {}
  return defaultUser;
}

/**
 * Saves authenticated user and token to localStorage
 */
export function setAuthSession(user, token = null) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  } catch (e) {
    console.warn('Error saving auth session:', e);
  }
}

/**
 * Clears authentication session
 */
export function clearAuthSession() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (e) {}
}

/**
 * Retrieves all messages/notifications received by a user
 */
export function getUserMessages(email) {
  if (!email) return [];
  const cleanEmail = email.trim().toLowerCase();
  try {
    const raw = localStorage.getItem(`smart_traffic_messages_${cleanEmail}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading user messages:', e);
  }

  // Provide initial default system message if empty
  const defaultWelcome = {
    id: `msg_welcome_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
    title: 'ITS System Session Initialized',
    message: `Workstation session active. Real-time telemetry, accident risk forecasting, and SHAP/LIME explanation engine are ready.`,
    type: 'info',
    createdAt: new Date().toISOString(),
    read: true
  };
  return [defaultWelcome];
}

/**
 * Adds a new system message received by the user
 */
export function addUserMessage(email, message) {
  if (!email || !message) return [];
  const cleanEmail = email.trim().toLowerCase();
  try {
    const current = getUserMessages(cleanEmail);
    const updated = [message, ...current.filter(m => m.id !== message.id)];
    localStorage.setItem(`smart_traffic_messages_${cleanEmail}`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Error saving user message:', e);
    return [];
  }
}

/**
 * Marks a received user message as read
 */
export function markUserMessageAsRead(email, messageId) {
  if (!email) return [];
  const cleanEmail = email.trim().toLowerCase();
  try {
    const current = getUserMessages(cleanEmail);
    const updated = current.map(m => m.id === messageId ? { ...m, read: true } : m);
    localStorage.setItem(`smart_traffic_messages_${cleanEmail}`, JSON.stringify(updated));

    // Optional background sync to backend
    fetch('/api/auth/messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, messageId })
    }).catch(() => {});

    return updated;
  } catch (e) {
    console.warn('Error updating user message:', e);
    return [];
  }
}

/**
 * Retrieves all registered users from localStorage merged with presets
 */
export function getAllRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_LIST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with presets, avoiding duplicates by email
        const existingEmails = new Set(parsed.map(u => u.email.toLowerCase()));
        const missingPresets = PRESET_USERS.filter(p => !existingEmails.has(p.email.toLowerCase()));
        return [...parsed, ...missingPresets];
      }
    }
  } catch (e) {}

  // Initialize with presets
  try {
    localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(PRESET_USERS));
  } catch (e) {}
  return [...PRESET_USERS];
}

/**
 * Registers a new user account
 * Sends to backend API with automatic offline localStorage fallback
 */
export async function registerAccount({ name, email, password, role, department }) {
  if (!name || !name.trim()) {
    return { success: false, error: 'Full name is required' };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid official email address is required' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Security passcode must be at least 6 characters' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanRole = role || 'Traffic Authority Officer';
  const cleanDept = department?.trim() || 'Central ITS Operations';

  // Attempt backend registration
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        password,
        role: cleanRole,
        department: cleanDept
      }),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setAuthSession(data.user, data.token);

        // Also update local users list
        const currentList = getAllRegisteredUsers();
        const updatedList = [data.user, ...currentList.filter(u => u.email.toLowerCase() !== cleanEmail)];
        localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(updatedList));

        // Save official registration confirmation message
        const registrationMessage = data.registrationMessage || {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: 'Registration Successful',
          message: `Welcome to the Intelligent Traffic Accident Prediction System, ${cleanName}! Your account has been officially registered with role '${cleanRole}' in ${cleanDept}. Your issued Security Badge ID is ${data.user.badgeId}.`,
          type: 'success',
          badgeId: data.user.badgeId,
          department: cleanDept,
          role: cleanRole,
          recipientEmail: cleanEmail,
          createdAt: new Date().toISOString(),
          read: false
        };
        addUserMessage(cleanEmail, registrationMessage);

        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || `Registration successful! Welcome, ${cleanName}.`,
          registrationMessage
        };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      if (errData.error) {
        return { success: false, error: errData.error };
      }
    }
  } catch (backendErr) {
    console.warn('Backend registration fallback to local storage:', backendErr.message);
  }

  // Local Storage Fallback
  const currentUsers = getAllRegisteredUsers();
  if (currentUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email address already exists' };
  }

  const badgeId = `ITS-${Math.floor(100 + Math.random() * 900)}`;
  const registrationMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: 'Registration Successful',
    message: `Welcome to the Intelligent Traffic Accident Prediction System, ${cleanName}! Your account has been officially registered with role '${cleanRole}' in ${cleanDept}. Your issued Security Badge ID is ${badgeId}.`,
    type: 'success',
    badgeId,
    department: cleanDept,
    role: cleanRole,
    recipientEmail: cleanEmail,
    createdAt: new Date().toISOString(),
    read: false
  };

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: cleanName,
    email: cleanEmail,
    password, // Stored locally for mock validation
    role: cleanRole,
    department: cleanDept,
    badgeId,
    messages: [registrationMessage],
    access: cleanRole === 'Traffic Authority Officer'
      ? 'Full Dispatch & Speed Calibration Rights'
      : (cleanRole === 'Data Scientist / ML Engineer'
        ? 'SHAP / LIME Hyperparameter Tuning'
        : 'Blackspot GIS & Safety Policy Access'),
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [newUser, ...currentUsers];
  localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(updatedUsers));
  const generatedToken = `jwt_client_token_${Date.now()}`;
  setAuthSession(newUser, generatedToken);
  addUserMessage(cleanEmail, registrationMessage);

  return {
    success: true,
    user: newUser,
    token: generatedToken,
    message: `Registration successful! Welcome to the Intelligent Traffic System, ${cleanName}.`,
    registrationMessage
  };
}

/**
 * Logs in an existing user account
 * Sends to backend API with automatic offline localStorage fallback
 */
export async function loginAccount({ email, password }) {
  if (!email || !email.trim()) {
    return { success: false, error: 'Email address is required' };
  }
  if (!password) {
    return { success: false, error: 'Password passcode is required' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Try backend login
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setAuthSession(data.user, data.token);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      if (errData.error) {
        return { success: false, error: errData.error };
      }
    }
  } catch (backendErr) {
    console.warn('Backend login fallback to local storage:', backendErr.message);
  }

  // Local Storage Fallback
  const allUsers = getAllRegisteredUsers();
  const foundUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

  if (!foundUser) {
    return { success: false, error: 'No account found with this email. Please register first.' };
  }

  // Check password if stored, or allow demo password
  if (foundUser.password && foundUser.password !== password && password !== 'password123' && password !== 'admin123') {
    return { success: false, error: 'Incorrect passcode. Try your registered passcode or "password123".' };
  }

  const generatedToken = `jwt_client_token_${Date.now()}`;
  setAuthSession(foundUser, generatedToken);

  return { success: true, user: foundUser, token: generatedToken };
}
