import type { FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Login.module.css";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { UserService } from "../../service/User.service";
import logoLight from "../../assets/logo-preta.png";
import logoDark from "../../assets/logo-branco.png";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { HealthService } from "../../service/health.service";
import { useTheme } from "../../contexts/useTheme";
import { ChevronLeft, Moon, Sun, Headset } from "lucide-react";

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const requestFailureMessage =
    "Erro ao processar sua solicitacao. Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.";
  const supportPhone = "64999663524";
  const supportMessage =
    "Ola! Aqui e do Gerenciamento de Estoque Giuseppe Vidal. Estou com um problema ao acessar o painel, podem me ajudar?";
  const supportUrl = `https://wa.me/${supportPhone}?text=${encodeURIComponent(
    supportMessage,
  )}`;
  const [email, setEmail] = useState("admin.giuseppevidal@gmail.com");
  const [password, setPassword] = useState("giuseppe.vidal@");
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<"login" | "verify">("login");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }
    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const showErrorToast = useCallback(() => {
    toast.error(
      <span>
        {requestFailureMessage}{" "}
        <a
          className={styles.toastLink}
          href={supportUrl}
          target="_blank"
          rel="noreferrer"
        >
          Falar no WhatsApp
        </a>
      </span>,
    );
  }, [requestFailureMessage, supportUrl]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (step === "login") {
        try {
          setLoading(true);
          await UserService.verifyEmail({ email, password });
          setStep("verify");
        } catch {
          showErrorToast();
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        const verify = await UserService.verificationToken({
          email,
          code: code.join(""),
        });

        localStorage.setItem("token", verify.token);
        contextLogin(verify.token);

        navigate("/dashboard");
      } catch {
        setCode(["", "", "", "", "", ""]);
        codeRefs.current[0]?.focus();
        showErrorToast();
      } finally {
        setLoading(false);
      }
    },
    [code, contextLogin, email, navigate, password, showErrorToast, step],
  );

  useEffect(() => {
    if (step === "verify") {
      setTimeout(() => {
        codeRefs.current[0]?.focus();
      }, 0);
    }
  }, [step]);

  useEffect(() => {
    HealthService.health();
  }, []);

  const handleResendCode = useCallback(async () => {
    if (loading || resendCooldown > 0) {
      return;
    }
    try {
      setLoading(true);
      await UserService.verifyEmail({ email, password });
      setResendCooldown(60);
      setCode(["", "", "", "", "", ""]);
      codeRefs.current[0]?.focus();
    } catch {
      showErrorToast();
    } finally {
      setLoading(false);
    }
  }, [email, loading, password, resendCooldown, showErrorToast]);

  function handleCodeChange(index: number, value: string) {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = nextValue;
    setCode(next);
    if (nextValue && index < code.length - 1) {
      codeRefs.current[index + 1]?.focus();
    }
  }

  function handleCodeKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  }

  function handleCodePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setCode(next);
    const focusIndex = Math.min(pasted.length, 5);
    codeRefs.current[focusIndex]?.focus();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageTopBar}>
        <a
          className={styles.topBtn}
          href={supportUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com suporte"
          data-tooltip="Suporte"
        >
          <Headset size={18} />
        </a>
        <button
          type="button"
          className={styles.topBtn}
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Modo claro" : "Modo escuro"}
          data-tooltip={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div className={styles.card}>
        {step === "verify" && (
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setStep("login")}
            aria-label="Voltar"
            data-tooltip="Voltar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div className={styles.formWrap}>
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="Logo"
            className={styles.logoImg}
          />

          <div className={styles.header}>
            <div className={styles.h1}>Bem-vindo</div>
            <div className={styles.sub}>
              Acesse sua conta para gerenciar seu negócio.
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {step === "login" ? (
              <>
                <label className={styles.label}>E-mail</label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@pinha.com.br"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <label className={styles.label} style={{ marginTop: 24 }}>Senha</label>

                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Manter conectado por 30 dias</span>
                </label>

                <button className={styles.submit} type="submit">
                  {loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className={styles.loading}
                    />
                  ) : (
                    <>
                      ENTRAR
                      <span className={styles.submitIcon} aria-hidden>
                        <FiArrowRight />
                      </span>
                    </>
                  )}
                </button>

                <div className={styles.copy}>© 2026 GIUSEPPE VIDAL.</div>
              </>
            ) : (
              <div className={styles.verifyWrap}>
                <div className={styles.verifyTitle}>
                  Verificacao de Seguranca
                </div>
                <div className={styles.verifySub}>
                  Enviamos um código de 6 dígitos para o seu e-mail.
                </div>
                <div className={styles.codeRow}>
                  {code.map((digit, index) => (
                    <input
                      key={`code-${index}`}
                      className={styles.codeInput}
                      value={digit}
                      ref={(el) => {
                        codeRefs.current[index] = el;
                      }}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={handleCodePaste}
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`Código ${index + 1}`}
                    />
                  ))}
                </div>
                <div className={styles.verifyNote}>
                  Por favor, insira o código para continuar.
                </div>
                <button className={styles.verifyButton} type="submit">
                  {loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className={styles.loading}
                    />
                  ) : (
                    "VERIFICAR CÓDIGO"
                  )}
                </button>
                <button
                  type="button"
                  className={styles.resend}
                  onClick={handleResendCode}
                  disabled={loading || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : "Reenviar código"}
                </button>
                <div className={styles.helpLink}>
                  Não recebeu o código?{" "}
                  <a
                    className={styles.supportLink}
                    href={supportUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Fale com suporte
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
