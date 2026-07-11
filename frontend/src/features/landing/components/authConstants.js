// export const AUTH_VIEWS = {
//   LOGIN: "login",
//   SIGNUP: "signup",
//   FORGOT_PASSWORD: "forgot-password",
// };

// export const AUTH_CONFIG = {
//   [AUTH_VIEWS.LOGIN]: {
//     title: "Welcome Back",
//   },

//   [AUTH_VIEWS.SIGNUP]: {
//     title: "Join FinPal",
//   },

//   [AUTH_VIEWS.FORGOT_PASSWORD]: {
//     title: "Secure Recovery",
//   },
// };

export const AUTH_VIEWS = {
  LOGIN: "login",
  SIGNUP: "signup",
  FORGOT_PASSWORD: "forgot-password",
};

export const AUTH_CONFIG = {
  [AUTH_VIEWS.LOGIN]: {
    title: "Welcome Back",
    subtitle: "New to FinPal?",
    switchLabel: "Create account",
    switchView: AUTH_VIEWS.SIGNUP,
    footerLabel: "Forgot Password?",
    footerView: AUTH_VIEWS.FORGOT_PASSWORD,
  },

  [AUTH_VIEWS.SIGNUP]: {
    title: "Join FinPal",
    subtitle: "Already a member?",
    switchLabel: "Sign in",
    switchView: AUTH_VIEWS.LOGIN,
  },

  [AUTH_VIEWS.FORGOT_PASSWORD]: {
    title: "Forgot Password?",
    subtitle: "Remembered it?",
    switchLabel: "Back to sign in",
    switchView: AUTH_VIEWS.LOGIN,
  },
};
