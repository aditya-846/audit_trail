import { useState } from "react";
import {
  ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight,
  CheckCircle2, Package, Database, Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "AUDITOR",
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!formData.email.trim()) return "Please enter your email address.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Please enter a valid email address.";
    if (!formData.password) return "Please enter a password.";
    if (formData.password.length < 8) return "Password must contain at least 8 characters.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    if (!agreeTerms) return "Please accept the security policy.";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (registrationError) {
      setError(registrationError.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="audit-register-page">
      <div className="register-circle register-circle-one" />
      <div className="register-circle register-circle-two" />
      <div className="register-wrapper">
        <div className="register-info">
          <div className="register-brand">
            <div className="register-brand-icon"><ShieldCheck size={30} /></div>
            <div><h1>AuditFlow</h1><p>Secure Shipment Audit Platform</p></div>
          </div>
          <div className="register-info-content">
            <span className="register-label">SECURE ACCESS</span>
            <h2>Build trust with<br /><span>every shipment.</span></h2>
            <p>Create your AuditFlow account and securely monitor shipments, sensor events, routes, and audit history.</p>
          </div>
          <div className="register-features">
            <RegisterFeature icon={<Activity size={19} />} title="Live Monitoring" text="Monitor shipment events in real time." />
            <RegisterFeature icon={<Package size={19} />} title="Shipment Tracking" text="Track containers and shipment routes." />
            <RegisterFeature icon={<Database size={19} />} title="Secure Audit Logs" text="Maintain a protected event history." />
          </div>
        </div>

        <div className="register-form-section">
          <div className="register-card">
            <div className="register-mobile-brand"><div className="register-brand-icon"><ShieldCheck size={25} /></div><h1>AuditFlow</h1></div>
            <div className="register-header">
              <div className="register-header-icon"><User size={21} /></div>
              <h2>Create your account</h2>
              <p>Register to access the AuditFlow platform.</p>
            </div>
            {error && <div className="register-error">{error}</div>}
            {success && <div className="register-success"><CheckCircle2 size={17} /> <span>{success}</span></div>}
            <form onSubmit={handleSubmit} className="register-form">
              <RegisterInput label="Full Name" name="name" type="text" placeholder="Enter your full name" icon={<User size={18} />} value={formData.name} onChange={handleChange} autoComplete="name" />
              <RegisterInput label="Email Address" name="email" type="email" placeholder="you@example.com" icon={<Mail size={18} />} value={formData.email} onChange={handleChange} autoComplete="email" />
              <div className="register-form-group"><label htmlFor="role">Access Role</label><div className="register-select"><ShieldCheck size={18} className="register-input-icon" /><select id="role" name="role" value={formData.role} onChange={handleChange}><option value="AUDITOR">Auditor (Read-Only)</option><option value="DISPATCHER">Dispatcher (Can Move Shipments)</option><option value="TELEMETRY_BOT">Telemetry Bot (Can Log Sensors)</option></select></div><small className="role-description">Select the level of access required for your work.</small></div>
              <PasswordInput label="Password" name="password" placeholder="Minimum 8 characters" value={formData.password} show={showPassword} onChange={handleChange} onToggle={() => setShowPassword(!showPassword)} />
              <PasswordInput label="Confirm Password" name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} show={showConfirmPassword} onChange={handleChange} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              <label className="register-terms"><input type="checkbox" checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} /><span>I agree to the AuditFlow security policy and terms of service.</span></label>
              <button type="submit" className="register-button" disabled={loading}>{loading ? <><span className="register-loader" /> Creating Account...</> : <>Create Account <ArrowRight size={18} /></>}</button>
            </form>
            <div className="already-account"><span>Already have an account?</span><button type="button" onClick={() => navigate("/login")}>Sign In</button></div>
            <div className="register-security"><ShieldCheck size={17} /><span>Secure audit-protected environment</span></div>
          </div>
          <p className="register-footer">© 2026 AuditFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function RegisterInput({ label, name, icon, ...props }) {
  return <div className="register-form-group"><label htmlFor={name}>{label}</label><div className="register-input">{icon}<input id={name} name={name} {...props} /></div></div>;
}

function PasswordInput({ label, name, value, show, onChange, onToggle, placeholder }) {
  return <div className="register-form-group"><label htmlFor={name}>{label}</label><div className="register-input"><Lock size={18} className="register-input-icon" /><input id={name} name={name} type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} autoComplete="new-password" /><button type="button" className="register-password-toggle" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>;
}

function RegisterFeature({ icon, title, text }) {
  return <div className="register-feature"><div className="register-feature-icon">{icon}</div><div><strong>{title}</strong><span>{text}</span></div></div>;
}
