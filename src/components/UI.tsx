import type { ReactNode } from "react";
import type { IconName } from "../data/content";
export function Icon({ name, size = 22 }: { name: IconName | string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="M3 10.7 12 3l9 7.7" /><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" /></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H11v17H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 4.5A2.5 2.5 0 0 0 17.5 2H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    wallet: <><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H19v16H5.5A2.5 2.5 0 0 1 3 17.5z" /><path d="M3 8h16M15 12h6v5h-6a2.5 2.5 0 0 1 0-5Z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    flame: <path d="M13.5 2.5c.8 4-2.2 5-2.2 8.2-1.3-1.4-1.6-3-1.1-4.8C7 8 5 10.7 5 14.2a7 7 0 0 0 14 0c0-4.6-2.6-8.3-5.5-11.7Z" />,
    star: <path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9L6.4 20l1.1-6.2L3 9.4l6.2-.9Z" />,
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    back: <><path d="M19 12H5" /><path d="m10 17-5-5 5-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    sparkle: <><path d="M12 3c.5 4.4 2.6 6.5 7 7-4.4.5-6.5 2.6-7 7-.5-4.4-2.6-6.5-7-7 4.4-.5 6.5-2.6 7-7Z" /><path d="M19 16c.2 1.8 1.2 2.8 3 3-1.8.2-2.8 1.2-3 3-.2-1.8-1.2-2.8-3-3 1.8-.2 2.8-1.2 3-3Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" /></>,
    edit: <><path d="m4 20 4.5-1 10.8-10.8a2.1 2.1 0 0 0-3-3L5.5 16Z" /><path d="m14.8 6.7 3 3" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    reset: <><path d="M4 7v5h5" /><path d="M5.5 16.5A8 8 0 1 0 6 6l-2 2" /></>,
    alert: <><path d="M12 3 2.8 20h18.4Z" /><path d="M12 9v5m0 3h.01" /></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Penny({ small = false, celebrate = false }: { small?: boolean; celebrate?: boolean }) {
  return (
    <div className={`penny ${small ? "penny-small" : ""} ${celebrate ? "penny-celebrate" : ""}`} aria-label="Penny the piggy bank mascot">
      {celebrate && <span className="confetti">✦</span>}
      <svg viewBox="0 0 150 126" role="img" aria-hidden="true">
        <ellipse cx="76" cy="114" rx="48" ry="7" fill="#24553F" opacity=".12" />
        <path d="M35 70c-10-2-13-10-9-17 3-5 9-4 11 0" fill="none" stroke="#C98271" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="78" cy="69" rx="52" ry="39" fill="#F4C7AB" />
        <path d="M49 43 43 23c11 1 19 7 23 15M104 40l11-17c7 7 9 16 6 25" fill="#EBAE94" stroke="#D98C79" strokeWidth="2" strokeLinejoin="round" />
        <path d="M53 35c14-8 38-9 53 0" fill="none" stroke="#2F6B4F" strokeWidth="7" strokeLinecap="round" />
        <path d="M64 27h32l-5-13H70Z" fill="#2F6B4F" />
        <path d="M70 14h21" stroke="#F7DC88" strokeWidth="3" strokeLinecap="round" />
        <circle cx="59" cy="64" r="3.5" fill="#254A39" />
        <circle cx="100" cy="64" r="3.5" fill="#254A39" />
        <circle cx="58" cy="62.5" r="1" fill="white" />
        <circle cx="99" cy="62.5" r="1" fill="white" />
        <ellipse cx="80" cy="78" rx="16" ry="12" fill="#EAAE94" />
        <ellipse cx="74" cy="77" rx="2.2" ry="3" fill="#C47969" />
        <ellipse cx="86" cy="77" rx="2.2" ry="3" fill="#C47969" />
        <path d="M76 85c3 2 6 2 9 0" fill="none" stroke="#B9685C" strokeWidth="2" strokeLinecap="round" />
        <path d="M48 99v10m14-7v10m35-11v11m13-17v14" stroke="#D98C79" strokeWidth="8" strokeLinecap="round" />
        <path d="M38 71c-5 1-9 5-10 10" fill="none" stroke="#D98C79" strokeWidth="6" strokeLinecap="round" />
        <rect x="66" y="34" width="28" height="4" rx="2" fill="#C98271" opacity=".75" />
      </svg>
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", disabled = false, icon }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; disabled?: boolean; icon?: IconName;
}) {
  return <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>{children}{icon && <Icon name={icon} size={19} />}</button>;
}


export function NumberInput({
  value,
  onChange,
  label,
  prefix = "$"
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  prefix?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-wrap">
        <b>{prefix}</b>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value || ""}
          onChange={(e) => {
            const inputValue = e.target.value;

            if (inputValue === "") {
              onChange(0);
              return;
            }

            const amount = Number(inputValue);

            if (Number.isFinite(amount)) {
              onChange(Math.max(0, amount));
            }
          }}
        />
      </span>
    </label>
  );
}


export function TopBar({ title, onBack, action }: { title: string; onBack?: () => void; action?: React.ReactNode }) {
  return <div className="topbar">{onBack ? <button className="icon-btn" onClick={onBack} aria-label="Go back"><Icon name="back" /></button> : <div className="brand-dot">P</div>}<div className="topbar-title">{title}</div>{action || <div className="topbar-spacer" />}</div>;
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return <div className="progress-block">{label && <div className="progress-label"><span>{label}</span><b>{Math.round(value)}%</b></div>}<div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div></div>;
}

