import type { CSSProperties, FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Login.module.css";
import Colors from "../../themes/Colors";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { UserService } from "../../service/User.service";
import logo from "../../assets/logo.png";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { HealthService } from "../../service/health.service";
type Props = {
  backgroundImageUrl?: string;
};

type CSSVariables = CSSProperties & Record<`--${string}`, string>;

export default function Login({
  backgroundImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx5T1LvEjeIQBt-UxZLODbdXIF-tr7NXUvdQ&s",
}: Props) {
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
    if (step === "verify" && code.every((digit) => digit !== "") && !loading) {
      const submitEvent = { preventDefault: () => {} } as FormEvent;
      handleSubmit(submitEvent);
    }
  }, [code, step, loading, handleSubmit]);

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

  const colorVars: CSSVariables = {
    "--bgPrimary": Colors.Background.primary,
    "--bgSecondary": Colors.Background.secondary,
    "--bgSidebar": Colors.Background.sidebar ?? "#1E1B18",
    "--surface": Colors.Background.surface ?? "#FFFFFF",
    "--surfaceMuted": Colors.Background.surfaceMuted ?? "#F0F1F5",
    "--highlight": Colors.Highlight.primary,
    "--textPrimary": Colors.Texts.primary,
    "--textSecondary": Colors.Texts.secondary,
    "--textMuted": Colors.Texts.muted ?? "#9CA3AF",
    "--textOnDark": Colors.Texts.onDark ?? "#FFFFFF",
    "--border": Colors.Border?.default ?? "#E5E7EB",
    "--borderLight": Colors.Border?.light ?? "#F1F1F1",
    "--heroImage": `url(${backgroundImageUrl})`,
  };

  return (
    <div className={styles.page} style={colorVars}>
      <div className={styles.left}>
        <div className={styles.leftBg} />
        <div className={styles.leftGlow} />
        <div className={styles.leftInner}>
          <img src={logo} alt="Logo" className={styles.logoImg} />
          <div className={styles.leftTitle}>Giuseppe Vidal</div>
          <div className={styles.leftDesc}>
            Gestão moderna de inventário e vendas
            <br />
            com inteligência e simplicidade.
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
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
                  <span className={styles.inputIcon} aria-hidden>
                    <FiMail />
                  </span>
                  <input
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@pinha.com.br"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div className={styles.rowBetweenTop}>
                  <label className={styles.label}>Senha</label>
                  <button type="button" className={styles.forgot}>
                    Esqueci minha senha
                  </button>
                </div>

                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon} aria-hidden>
                    <FiLock />
                  </span>
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

                <div className={styles.support}>
                  Ainda nao tem acesso?{" "}
                  <a
                    className={styles.supportLink}
                    href={supportUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Fale com o suporte
                  </a>
                </div>
                <div className={styles.copy}>© 2026 GIUSEPPE VIDAL.</div>
              </>
            ) : (
              <div className={styles.verifyWrap}>
                <div className={styles.verifyTitle}>
                  Verificacao de Seguranca
                </div>
                <div className={styles.verifySub}>
                  Enviamos um codigo de 6 digitos para o seu e-mail.
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
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`Codigo ${index + 1}`}
                    />
                  ))}
                </div>
                <div className={styles.verifyNote}>
                  Por favor, insira o codigo para continuar.
                </div>
                <button className={styles.verifyButton} type="submit">
                  {loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className={styles.loading}
                    />
                  ) : (
                    "VERIFICAR CODIGO"
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
                    : "Reenviar codigo"}
                </button>
                <div className={styles.helpLink}>
                  Nao recebeu o codigo?{" "}
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
