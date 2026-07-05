import { addDoc, collection, serverTimestamp } from "firebase/firestore/lite";
import { db, firebaseEnabled } from "./firebase";

// A stable per-browser id so the admin page can distinguish unique visitors.
function getVisitorId(): string {
  try {
    let id = localStorage.getItem("visitorId");
    if (!id) {
      id = (crypto.randomUUID?.() ?? String(Math.random()).slice(2)) as string;
      localStorage.setItem("visitorId", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

// "YYYY-MM-DD" in Korea Standard Time, so daily buckets match your local day.
function todayKST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

type Geo = { country?: string; countryCode?: string; city?: string };

async function lookupGeo(): Promise<Geo> {
  try {
    // ipwho.is: free, HTTPS, no API key, ~10k requests/month.
    const res = await fetch("https://ipwho.is/");
    const d = await res.json();
    if (d && d.success) {
      return { country: d.country, countryCode: d.country_code, city: d.city };
    }
  } catch {
    /* ignore — geo is best-effort */
  }
  return {};
}

// Guard so React StrictMode's double-mount (and SPA hash changes) log at most one visit per page load.
let logged = false;

export async function logVisit(section: string): Promise<void> {
  if (!firebaseEnabled || !db) return;
  if (logged) return;
  logged = true;

  try {
    const geo = await lookupGeo();
    await addDoc(collection(db, "visits"), {
      ts: serverTimestamp(),
      date: todayKST(),
      visitorId: getVisitorId(),
      section: section || "about",
      country: geo.country ?? "Unknown",
      countryCode: geo.countryCode ?? "",
      city: geo.city ?? "",
    });
  } catch {
    // Never let analytics break the page.
    logged = false;
  }
}
