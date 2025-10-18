import { useApp } from "../../../app/store";
import { Login } from "../../../components/Auth/Login";
import { Signup } from "../../../components/Auth/Signup";

export function AuthPage() {
  const { state, actions } = useApp();
  const { showLoginScreen } = state;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {showLoginScreen ? (
          <Login
            onLoginSuccess={actions.loginUser}
            onSwitchToSignup={() => actions.setShowLoginScreen(false)}
          />
        ) : (
          <Signup
            onSignupSuccess={actions.loginUser}
            onSwitchToLogin={() => actions.setShowLoginScreen(true)}
          />
        )}
      </div>
    </div>
  );
}
