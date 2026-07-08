import { useEffect, useMemo, useState, type ReactNode } from "react";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query } from "firebase/firestore/lite";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { ADMIN_EMAIL, app, db, firebaseEnabled } from "@/lib/firebase";

// Initialized here (in the lazy admin chunk) so firebase/auth stays out of the main bundle.
const auth = app ? getAuth(app) : null;

type Visit = {
  id: string;
  date: string;
  visitorId: string;
  section: string;
  country: string;
  city: string;
};

// The visitorId stored in this browser's localStorage — i.e. "this device".
function thisBrowserVisitorId(): string | null {
  try {
    return localStorage.getItem("visitorId");
  } catch {
    return null;
  }
}

function BarRow({ label, value, max, sub }: { label: string; value: number; max: number; sub?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 py-1.5">
      <span className="font-sans text-sm text-foreground truncate" title={label}>
        {label}
        {sub && <span className="text-muted-foreground"> · {sub}</span>}
      </span>
      <div className="h-2.5 rounded bg-muted overflow-hidden">
        <div className="h-full bg-primary rounded" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-muted-foreground text-right tabular-nums">{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-border rounded-lg p-5 bg-card">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="font-garamond text-3xl text-foreground">{value}</p>
    </div>
  );
}

function countBy<T>(items: T[], key: (t: T) => string): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it) || "—";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        .font-garamond { font-family: 'EB Garamond', Georgia, serif; }
        .font-mono { font-family: 'DM Mono', 'Courier New', monospace; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const authorized = Boolean(user && user.email === ADMIN_EMAIL);

  // Watch auth state.
  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setAuthReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, []);

  // Load data once the admin is signed in.
  useEffect(() => {
    if (!authorized || !db) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "visits"), orderBy("ts", "desc"), limit(10000)));
        setVisits(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Visit, "id">) })));
      } catch (e) {
        setError(String(e));
      }
    })();
  }, [authorized]);

  const stats = useMemo(() => {
    if (!visits) return null;
    const byDate = countBy(visits, (v) => v.date).sort((a, b) => a.label.localeCompare(b.label));
    const uniqueVisitors = new Set(visits.map((v) => v.visitorId)).size;
    const uniqueByDate = new Map<string, Set<string>>();
    for (const v of visits) {
      if (!uniqueByDate.has(v.date)) uniqueByDate.set(v.date, new Set());
      uniqueByDate.get(v.date)!.add(v.visitorId);
    }
    const byCountry = countBy(visits, (v) => v.country);
    const byCity = countBy(visits, (v) => (v.city ? `${v.city}, ${v.country}` : ""));
    const bySection = countBy(visits, (v) => v.section);
    const byVisitor = countBy(visits, (v) => v.visitorId);
    return { byDate, uniqueVisitors, uniqueByDate, byCountry, byCity, bySection, byVisitor };
  }, [visits]);

  const signIn = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      setError(String(e));
    }
  };

  // Delete every visit logged under a given visitorId (used to prune the owner's
  // own visits). Removes the docs from Firestore, then drops them from local state.
  const deleteVisitor = async (visitorId: string) => {
    if (!db || !visits) return;
    const targets = visits.filter((v) => v.visitorId === visitorId);
    if (targets.length === 0) return;
    if (!window.confirm(`이 방문자(${visitorId.slice(0, 8)}…)의 방문 기록 ${targets.length}건을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setDeleting(visitorId);
    try {
      await Promise.all(targets.map((v) => deleteDoc(doc(db, "visits", v.id))));
      setVisits((prev) => (prev ? prev.filter((v) => v.visitorId !== visitorId) : prev));
    } catch (e) {
      setError(String(e));
    } finally {
      setDeleting(null);
    }
  };

  // ── Gates ──────────────────────────────────────────────────────────────────
  if (!firebaseEnabled) {
    return (
      <Shell>
        <h1 className="font-garamond text-3xl text-foreground mb-3">Analytics</h1>
        <p className="font-sans text-sm text-muted-foreground">
          Firebase가 아직 설정되지 않았습니다. <span className="font-mono">.env.local</span> 에 설정값을 채우고
          개발 서버를 재시작하세요. (<span className="font-mono">FIREBASE_SETUP.md</span>)
        </p>
      </Shell>
    );
  }

  if (!authReady) {
    return <Shell><p className="font-sans text-sm text-muted-foreground">확인 중…</p></Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <div className="max-w-sm space-y-5">
          <h1 className="font-garamond text-3xl text-foreground">Analytics</h1>
          <p className="font-sans text-sm text-muted-foreground">관리자 전용 페이지입니다. Google 계정으로 로그인하세요.</p>
          <button
            onClick={signIn}
            className="px-4 py-2 border border-border rounded font-sans text-sm text-foreground hover:bg-accent hover:text-white transition-colors"
          >
            Sign in with Google
          </button>
          {error && <p className="text-xs font-mono text-red-500 break-words">{error}</p>}
        </div>
      </Shell>
    );
  }

  if (!authorized) {
    return (
      <Shell>
        <div className="max-w-md space-y-4">
          <h1 className="font-garamond text-3xl text-foreground">Access denied</h1>
          <p className="font-sans text-sm text-muted-foreground">
            <span className="font-mono">{user.email}</span> 계정은 접근 권한이 없습니다.
            관리자 계정(<span className="font-mono">{ADMIN_EMAIL}</span>)으로 로그인하세요.
          </p>
          <button
            onClick={() => auth && signOut(auth)}
            className="px-4 py-2 border border-border rounded font-sans text-sm text-foreground hover:bg-accent hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <h1 className="font-garamond text-3xl text-foreground mb-3">Analytics</h1>
        <p className="font-sans text-sm text-red-500">데이터를 불러오지 못했습니다.</p>
        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap mt-2">{error}</pre>
      </Shell>
    );
  }

  if (!visits || !stats) {
    return <Shell><p className="font-sans text-sm text-muted-foreground">불러오는 중…</p></Shell>;
  }

  const maxDate = Math.max(1, ...stats.byDate.map((d) => d.value));

  return (
    <Shell>
      <div className="space-y-10">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h1 className="font-garamond text-3xl md:text-4xl text-foreground">Analytics</h1>
          <button
            onClick={() => auth && signOut(auth)}
            className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
          >
            sign out
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total Visits" value={visits.length} />
          <StatCard label="Unique Visitors" value={stats.uniqueVisitors} />
          <StatCard label="Countries" value={stats.byCountry.filter((c) => c.label !== "Unknown" && c.label !== "—").length} />
        </div>

        <section>
          <h2 className="font-garamond text-2xl text-foreground mb-4">Daily Visits</h2>
          <div className="space-y-1">
            {stats.byDate.length === 0 && <p className="text-sm text-muted-foreground">아직 방문 기록이 없습니다.</p>}
            {stats.byDate.map((d) => (
              <BarRow
                key={d.label}
                label={d.label}
                value={d.value}
                max={maxDate}
                sub={`${stats.uniqueByDate.get(d.label)?.size ?? 0} uniq`}
              />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section>
            <h2 className="font-garamond text-2xl text-foreground mb-4">By Country</h2>
            <div className="space-y-1">
              {stats.byCountry.map((c) => (
                <BarRow key={c.label} label={c.label} value={c.value} max={stats.byCountry[0]?.value ?? 1} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-garamond text-2xl text-foreground mb-4">By City</h2>
            <div className="space-y-1">
              {stats.byCity.filter((c) => c.label !== "—").map((c) => (
                <BarRow key={c.label} label={c.label} value={c.value} max={stats.byCity[0]?.value ?? 1} />
              ))}
              {stats.byCity.filter((c) => c.label !== "—").length === 0 && (
                <p className="text-sm text-muted-foreground">도시 정보 없음.</p>
              )}
            </div>
          </section>
        </div>

        <section>
          <h2 className="font-garamond text-2xl text-foreground mb-4">By Entry Section</h2>
          <div className="space-y-1">
            {stats.bySection.map((s) => (
              <BarRow key={s.label} label={s.label} value={s.value} max={stats.bySection[0]?.value ?? 1} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-garamond text-2xl text-foreground mb-4">Visitors</h2>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            방문자(브라우저)별 방문 수입니다. 본인 기기의 기록을 삭제하면 위 통계에서 즉시 제외됩니다. 삭제는 되돌릴 수 없습니다.
          </p>
          <div className="space-y-1">
            {stats.byVisitor.map((v) => {
              const isThisDevice = v.label === thisBrowserVisitorId();
              return (
                <div key={v.label} className="grid grid-cols-[1fr_3rem_5rem] items-center gap-3 py-1.5 border-t border-border">
                  <span className="font-mono text-xs text-foreground truncate" title={v.label}>
                    {v.label}
                    {isThisDevice && <span className="ml-2 text-primary">· this device</span>}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground text-right tabular-nums">{v.value}</span>
                  <button
                    onClick={() => deleteVisitor(v.label)}
                    disabled={deleting !== null}
                    className="font-mono text-xs text-red-500 hover:text-red-600 disabled:opacity-40 transition-colors text-right"
                  >
                    {deleting === v.label ? "삭제 중…" : "delete"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Shell>
  );
}
