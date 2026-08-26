// features/landing/components/auth/AuthPanel.jsx

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { AUTH_VIEWS } from "./authConstants";

export default function AuthPanel({ view, onNavigate }) {
  switch (view) {
    case AUTH_VIEWS.SIGNUP:
      return <SignupForm />;

    case AUTH_VIEWS.FORGOT_PASSWORD:
      return <ForgotPasswordForm />;

    case AUTH_VIEWS.LOGIN:
    default:
      return <LoginForm onNavigate={onNavigate} />;
  }
}
