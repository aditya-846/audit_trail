import { useState } from "react";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Activity,
  Package,
  Database,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="audit-login-page">
      <div className="login-bg-circle circle-one" />
      <div className="login-bg-circle circle-two" />

      <div className="login-wrapper">
        <div className="login-info">
          <div className="brand">
            <div className="brand-icon"><ShieldCheck size={30} /></div>
            <div>
              <h1>AuditFlow</h1>
              <p>Secure Shipment Audit Platform</p>
            </div>
          </div>

          <div className="login-info-content">
            <span className="small-label">SECURE EVENT TRACKING</span>
            <h2>Every shipment.<br /><span>Every event.</span><br />Fully traceable.</h2>
            <p>Monitor shipment activity, track sensor data, and maintain a secure immutable audit trail from one powerful dashboard.</p>
          </div>

          <div className="security-features">
            <Feature icon={<Activity size={20} />} title="Real-time Monitoring" description="Track live shipment events" />
            <Feature icon={<Package size={20} />} title="Shipment Tracking" description="Monitor containers and routes" />
            <Feature icon={<Database size={20} />} title="Immutable Audit Trail" description="Secure event history" />
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-card">
            <div className="mobile-brand">
              <div className="brand-icon"><ShieldCheck size={26} /></div>
              <h1>AuditFlow</h1>
            </div>

            <div className="login-header">
              <div className="welcome-icon"><Lock size={22} /></div>
              <h2>Welcome back</h2>
              <p>Sign in to access your dashboard.</p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <div className="input-wrapper">
                  <Mail size={19} className="input-icon" />
                  <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
                </div>
              </div>

              <div className="form-group">
                <div className="password-label">
                  <label htmlFor="password">Password</label>
                  <button type="button" className="forgot-password">Forgot password?</button>
                </div>
                <div className="input-wrapper">
                  <Lock size={19} className="input-icon" />
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="remember"><input type="checkbox" /> <span>Remember me</span></label>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? <><span className="button-loader" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="secure-message">
              <div className="secure-icon"><ShieldCheck size={17} /></div>
              <div><strong>Secure connection</strong><span>Your access is protected by secure authentication.</span></div>
            </div>

            <div className="already-account login-register-link">
              <span>New to AuditFlow?</span>
              <button type="button" onClick={() => navigate("/register")}>Create Account</button>
            </div>
          </div>
          <p className="login-footer">© 2026 AuditFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return <div className="security-feature"><div className="feature-icon">{icon}</div><div><strong>{title}</strong><span>{description}</span></div></div>;
}
