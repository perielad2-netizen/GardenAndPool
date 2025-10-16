import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

// ---- Types for Cloudflare bindings (env secrets) ----
type Bindings = {
  OPENAI_API_KEY?: string
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  AUTH_SECRET?: string
  PUBLIC_BASE_URL?: string
  PUBLIC_SUPABASE_URL?: string
  PUBLIC_SUPABASE_ANON_KEY?: string
  SUPABASE_SERVICE_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Static assets from public/static
app.use('/static/*', serveStatic({ root: './public' }))

// Enable CORS for API (safe default)
app.use('/api/*', cors())

app.use(renderer)

// ------------------- UI -------------------
app.get('/', (c) => {
  return c.render(
    <main className="pb-24 sm:pb-0 page-snap-y">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/10 border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight drop-shadow-md header-brand-glow text-[2.1rem] sm:text-[2.5rem] text-white">
                מים
                <span className="bg-gradient-to-r from-lime-300 to-emerald-500 bg-clip-text text-transparent"> וטבע</span>
              </div>
              <div className="brand-underline mt-1 mb-1"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-5 text-white/90 text-sm">
              <a href="#services" className="hover:text-white transition">שירותים</a>
              <a href="#plans" className="hover:text-white transition">מנויים</a>
              <a href="#portal" className="hover:text-white transition">הפורטל שלי</a>
              <a href="#contact" className="hover:text-white transition">צור קשר</a>
            </nav>
            <div id="headerAuthZone" className="mt-1 sm:mt-0">
              <a href="#auth" id="openAuthModal" className="btn btn-cta-header text-[11px] sm:text-sm px-2 py-[4px] sm:px-3 sm:py-2">
                <i className="fas fa-user-lock"></i>
                התחברות / הרשמה
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden snap-start reveal">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Hebrew headline with colored keywords (mobile-friendly sizes) */}
          <div className="mb-1">
            <h1 className="font-extrabold drop-shadow-sm text-[1.8rem] sm:text-[2.2rem] leading-tight">
              <span className="text-blue-300">בריכות</span>
              <span className="mx-2 text-white/80">•</span>
              <span className="text-emerald-300">גינון</span>
              <span className="mx-2 text-white/80">•</span>
              <span className="text-white">ניקיון</span>
            </h1>
          </div>
          {/* Sub-headline */}
          <h2 className="text-[1.6rem] sm:text-[2rem] font-extrabold text-white drop-shadow-sm mb-2">הכל במקום אחד</h2>
          <div className="flex gap-3 mt-2">
            <a href="#diagnosis" className="btn btn-cta-primary">
              <i className="fas fa-camera"></i>
              אבחון מהיר
            </a>
            <a href="tel:0500000000" className="btn btn-cta-secondary">
              <i className="fas fa-phone"></i>
              התקשר עכשיו
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="pill text-slate-800">
              <div className="text-2xl font-bold" data-counter data-target="10">0</div>
              <div className="text-sm">מעל 10 שנות ניסיון</div>
            </div>
            <div className="pill text-slate-800">
              <div className="text-2xl font-bold" data-counter data-target="500">0</div>
              <div className="text-sm">יותר מ 500 לקוחות מרוצים</div>
            </div>
            <div className="pill text-slate-800">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">זמינות מיידית</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white/60 backdrop-blur rounded-t-3xl -mt-2 snap-start reveal">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">שירותים</h2>

          {/* Chips (cleaner UI) */}
          <div id="serviceChips" className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { id: 'diagnosis', icon: 'fa-microscope', label: 'אבחון' },
              { id: 'scheduler', icon: 'fa-calendar-check', label: 'תיאום טכנאי' },
              { id: 'cabinet', icon: 'fa-toolbox', label: 'ציוד ותחזוקה' },
              { id: 'subscription', icon: 'fa-water-ladder', label: 'מנויים' },
              { id: 'chat', icon: 'fa-robot', label: 'צ׳אט חכם' },
            ].map((t) => (
              <button
                key={t.id}
                data-tab={t.id}
                className="chip"
              >
                <span className="text-slate-800 text-sm font-medium">{t.label}</span>
                <span className="icon-bubble">
                  <i className={`fas ${t.icon}`}></i>
                </span>
              </button>
            ))}
          </div>

          {/* Panels */}
          <div id="panelsScroller" className="space-y-6">
            {/* Diagnosis */}
            <div id="panel-diagnosis" className="card reveal">
              <div className="heading mb-2">אבחון מהיר באמצעות תמונה</div>
              <form id="diagnosisForm" className="space-y-3">
                <input id="diagFile" type="file" name="image" accept="image/*" className="hidden" required />
                <div className="flex items-center gap-2">
                  <label htmlFor="diagFile" className="btn water-outline cursor-pointer">
                    <i className="fas fa-upload"></i>
                    העלאת תמונה
                  </label>
                  <span id="diagFileName" className="text-sm text-slate-600 truncate max-w-[50%]">לא נבחר קובץ</span>
                </div>
                <button type="submit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4">
                  <i className="fas fa-magnifying-glass"></i>
                  נתח תמונה
                </button>
              </form>
              <pre id="diagnosisResult" className="mt-3 text-sm text-slate-700 whitespace-pre-wrap"></pre>
              <p className="text-xs text-slate-500 mt-2">טיפ: הוסיפו OPENAI_API_KEY כדי להפעיל אבחון AI אמיתי. ללא מפתח יוצג מענה הדמיה.</p>
            </div>

            {/* Scheduler */}
            <div id="panel-scheduler" className="card hidden reveal">
              <div className="heading mb-2">תיאום טכנאי</div>
              <form id="schedulerForm" className="grid gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-600">סוג שירות</label>
                    <select id="sched_service" className="border rounded-lg px-3 py-2 w-full">
                      <option value="maintenance">תחזוקה</option>
                      <option value="cleaning">ניקיון</option>
                      <option value="repair">תיקון</option>
                      <option value="garden">גינון</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">תאריך</label>
                    <input id="sched_date" type="date" className="border rounded-lg px-3 py-2 w-full" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600">חלון זמן</label>
                  <select id="sched_window" className="border rounded-lg px-3 py-2 w-full" required>
                    <option value="08:00-10:00">08:00–10:00</option>
                    <option value="10:00-12:00">10:00–12:00</option>
                    <option value="12:00-14:00">12:00–14:00</option>
                    <option value="14:00-16:00">14:00–16:00</option>
                    <option value="16:00-18:00">16:00–18:00</option>
                  </select>
                  <div id="slotHelp" className="text-xs text-slate-500 mt-1">חלונות תפוסים באותו תאריך ינוטרלו אוטומטית</div>
                </div>
                <div>
                  <label className="text-sm text-slate-600">הערות (אופציונלי)</label>
                  <textarea id="sched_notes" className="border rounded-lg px-3 py-2 w-full" placeholder="שער, כלב, חניה, קוד וכו'"></textarea>
                </div>
                <div className="flex items-center gap-2">
                  <button type="submit" className="btn btn-primary"><i className="fas fa-calendar-check"></i> בקש תור</button>
                  <span id="schedulerStatus" className="text-sm text-slate-600"></span>
                </div>
              </form>
            </div>

            {/* Cabinet */}
            <div id="panel-cabinet" className="card hidden reveal">
              <div className="heading mb-2">ארון תחזוקה דיגיטלי</div>
              <p className="text-sm text-slate-600 mb-3">מעקב אחר חומרים, כלים וחלקי חילוף לתחזוקה שוטפת.</p>
              <div id="cabinetSignedOut" className="text-sm text-slate-600">יש להתחבר כדי לצפות ולהתעדכן.</div>
              <div id="cabinetApp" className="hidden">
                {/* Add item form */}
                <form id="cabinetAddForm" className="grid sm:grid-cols-4 gap-2 mb-3 items-end">
                  <div>
                    <label className="text-xs text-slate-600">שם פריט</label>
                    <input id="cab_name" className="border rounded-lg px-3 py-2 w-full" placeholder="לדוגמה: כלור גרגירים" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">קטגוריה</label>
                    <select id="cab_type" className="border rounded-lg px-3 py-2 w-full">
                      <option value="chemicals">כימיקלים</option>
                      <option value="tools">כלים</option>
                      <option value="parts">חלקים</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-600">מינימום</label>
                      <input id="cab_min" type="number" min="0" step="0.01" className="border rounded-lg px-3 py-2 w-full" placeholder="0" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600">יחידה</label>
                      <select id="cab_unit" className="border rounded-lg px-3 py-2 w-full">
                        <option value="גרם">גרם</option>
                        <option value="ק&quot;ג">ק&quot;ג</option>
                        <option value="ליטר">ליטר</option>
                        <option value="סמ&quot;ק">סמ&quot;ק</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="submit" className="btn btn-primary whitespace-nowrap"><i className="fas fa-plus"></i> הוסף פריט</button>
                    <span id="cab_add_status" className="text-xs text-slate-600"></span>
                  </div>
                </form>

                <div id="cabinetAlerts" className="mb-3"></div>
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <button data-cabinet-filter="all" className="btn">הכל</button>
                  <button data-cabinet-filter="chemicals" className="btn">כימיקלים</button>
                  <button data-cabinet-filter="tools" className="btn">כלים</button>
                  <button data-cabinet-filter="parts" className="btn">חלקים</button>
                </div>
                <div id="cabinetList" className="grid gap-3"></div>
              </div>
            </div>

            {/* Subscription (Pool) */}
            <div id="panel-subscription" className="card hidden reveal">
              <div className="heading mb-2">מנויים</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* מנוי VIP */}
                <div className="plan-card p-4">
                  <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                    <div>
                      <h3 className="font-bold text-lg">מנוי VIP</h3>
                      <p className="text-sm text-slate-600">שירות פרימיום עם גיבוי הנדסי מלא</p>
                    </div>
                    <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
                  </button>
                  <div className="plan-details mt-3 hidden">
                    <ul className="text-sm text-slate-700 space-y-1 mb-3">
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>כל מה שבמנוי מלא</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ביקור צוות מלא כל חודש</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>פיקוח הנדסי ע״י מהנדס אזרחי</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>SOS ללא הגבלה</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>כימיקלים כלולים במחיר</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ריסוס בית רבעוני</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>דו״ח הנדסי שנתי</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>הנחות על שדרוגים</li>
                    </ul>
                    <div className="text-sm text-slate-600 mb-1 font-medium">הצוות שלנו</div>
                    <div className="text-sm text-slate-700 mb-3">אינסטלטור • קונסטרוקטור • חשמלאי • איש משאבות • מהנדס אזרחי</div>
                    <div className="text-sm text-slate-600 mb-1 font-medium">מה כלול:</div>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>ביקורים: <b>שבועי בקיץ, ביקור צוות חודשי</b></li>
                      <li>קריאות SOS: <b>ללא הגבלה</b></li>
                      <li>כימיקלים: <b>כלול</b></li>
                      <li>ריסוס בית: <b>כלול</b></li>
                      <li>פיקוח הנדסי: <b>כלול</b></li>
                    </ul>
                  </div>
                </div>
                {/* מנוי מלא */}
                <div className="plan-card p-4">
                  <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                    <div>
                      <h3 className="font-bold text-lg">מנוי מלא</h3>
                      <p className="text-sm text-slate-600">תחזוקה מלאה כל השנה</p>
                    </div>
                    <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
                  </button>
                  <div className="plan-details mt-3 hidden">
                    <ul className="text-sm text-slate-700 space-y-1 mb-3">
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>כל מה שבמנוי קיץ</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>סגירת בריכה וכיסוי לחורף</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ניקוז חלקי ובדיקות איטום</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>2 קריאות SOS בחינם בשנה</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>הנחה 15% על חומרים</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ביקור טכנאי חודשי</li>
                    </ul>
                    <div className="text-sm text-slate-600 mb-1 font-medium">הצוות שלנו</div>
                    <div className="text-sm text-slate-700 mb-3">איש משאבות • אינסטלטור • חשמלאי</div>
                    <div className="text-sm text-slate-600 mb-1 font-medium">מה כלול:</div>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>ביקורים: <b>שבועי בקיץ, חודשי בחורף</b></li>
                      <li>קריאות SOS: <b>2 חינם</b></li>
                      <li>כימיקלים: <b>נפרד</b></li>
                      <li>ריסוס בית: <b>נפרד</b></li>
                      <li>פיקוח הנדסי: <b>לא</b></li>
                    </ul>
                  </div>
                </div>
                {/* מנוי קיץ */}
                <div className="plan-card p-4">
                  <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                    <div>
                      <h3 className="font-bold text-lg">מנוי קיץ</h3>
                      <p className="text-sm text-slate-600">תחזוקה מקצועית לעונת הרחצה</p>
                    </div>
                    <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
                  </button>
                  <div className="plan-details mt-3 hidden">
                    <ul className="text-sm text-slate-700 space-y-1 mb-3">
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>תחזוקה שוטפת מאי-ספטמבר</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ניקוי שבועי ובדיקות מים</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>מילוי מים לפי צורך</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ביקור חירום אחד בחינם</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ייעוץ טלפוני ללא הגבלה</li>
                    </ul>
                    <div className="text-sm text-slate-600 mb-1 font-medium">הצוות שלנו</div>
                    <div className="text-sm text-slate-700 mb-3">איש משאבות • מנקה מקצועי</div>
                    <div className="text-sm text-slate-600 mb-1 font-medium">מה כלול:</div>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>ביקורים: <b>שבועי</b></li>
                      <li>קריאות SOS: <b>1 חינם</b></li>
                      <li>כימיקלים: <b>נפרד</b></li>
                      <li>ריסוס בית: <b>נפרד</b></li>
                      <li>פיקוח הנדסי: <b>לא</b></li>
                    </ul>
                  </div>
                </div>
                {/* מנוי גינון */}
                <div className="plan-card p-4">
                  <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                    <div>
                      <h3 className="font-bold text-lg">מנוי גינון</h3>
                      <p className="text-sm text-slate-600">פרטים בהמשך</p>
                    </div>
                    <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
                  </button>
                  <div className="plan-details mt-3 hidden">
                    <p className="text-sm text-slate-600">פרטים בהמשך</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Smart Chat */}
            <div id="panel-chat" className="card hidden reveal">
              <div className="heading mb-2">צ׳אט חכם</div>
              <div className="flex gap-2">
                <input id="chatInput" className="flex-1 border rounded-lg px-3 py-2" placeholder="שאל שאלה על תחזוקת בריכה" />
                <button id="chatSend" className="btn btn-accent">שלח</button>
              </div>
              <div id="chatLog" className="mt-3 text-sm text-slate-700 space-y-2"></div>
              <p className="text-xs text-slate-500 mt-2">טיפ: הוסיפו OPENAI_API_KEY כדי להפעיל תשובות AI אמיתיות. שאלות לא רלוונטיות יסוננו.</p>
            </div>



            {/* Portal (read-only) */}
            <div id="panel-portal" className="card hidden reveal">
              <div className="heading mb-2">הפורטל שלי</div>
              <div id="portalSignedOut" className="text-sm text-slate-600">יש להתחבר כדי לצפות בפרטים האישיים.</div>
              <div id="portalContent" className="hidden space-y-3">
                <div className="rounded-xl border p-3">
                  <div className="font-semibold mb-1">פרופיל</div>
                  <div id="portalProfile" className="text-sm text-slate-700"></div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="font-semibold mb-1">מנויים</div>
                  <div id="portalSubs" className="text-sm text-slate-700"></div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="font-semibold mb-1">תורים קרובים</div>
                  <div id="portalAppts" className="text-sm text-slate-700"></div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="font-semibold mb-1">חשבוניות</div>
                  <div id="portalInvoices" className="text-sm text-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="plans" className="bg-white snap-start reveal">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">מנויים</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="plan-card p-4">
              <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                <div>
                  <h3 className="font-bold text-lg">מנוי VIP</h3>
                  <p className="text-sm text-slate-600">שירות פרימיום עם גיבוי הנדסי מלא</p>
                </div>
                <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
              </button>
              <div className="plan-details mt-3 hidden">
                <ul className="text-sm text-slate-700 space-y-1 mb-3">
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>כל מה שבמנוי מלא</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ביקור צוות מלא כל חודש</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>פיקוח הנדסי ע״י מהנדס אזרחי</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>SOS ללא הגבלה</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>כימיקלים כלולים במחיר</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ריסוס בית רבעוני</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>דו״ח הנדסי שנתי</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>הנחות על שדרוגים</li>
                </ul>
                <div className="text-sm text-slate-600 mb-1 font-medium">הצוות שלנו</div>
                <div className="text-sm text-slate-700 mb-3">אינסטלטור • קונסטרוקטור • חשמלאי • איש משאבות • מהנדס אזרחי</div>
                <div className="text-sm text-slate-600 mb-1 font-medium">מה כלול:</div>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>ביקורים: <b>שבועי בקיץ, ביקור צוות חודשי</b></li>
                  <li>קריאות SOS: <b>ללא הגבלה</b></li>
                  <li>כימיקלים: <b>כלול</b></li>
                  <li>ריסוס בית: <b>כלול</b></li>
                  <li>פיקוח הנדסי: <b>כלול</b></li>
                </ul>
              </div>
            </div>
            <div className="plan-card p-4">
              <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                <div>
                  <h3 className="font-bold text-lg">מנוי מלא</h3>
                  <p className="text-sm text-slate-600">תחזוקה מלאה כל השנה</p>
                </div>
                <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
              </button>
              <div className="plan-details mt-3 hidden">
                <ul className="text-sm text-slate-700 space-y-1 mb-3">
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>כל מה שבמנוי קיץ</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>סגירת בריכה וכיסוי לחורף</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ניקוז חלקי ובדיקות איטום</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>2 קריאות SOS בחינם בשנה</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>הנחה 15% על חומרים</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ביקור טכנאי חודשי</li>
                </ul>
                <div className="text-sm text-slate-600 mb-1 font-medium">הצוות שלנו</div>
                <div className="text-sm text-slate-700 mb-3">איש משאבות • אינסטלטור • חשמלאי</div>
                <div className="text-sm text-slate-600 mb-1 font-medium">מה כלול:</div>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>ביקורים: <b>שבועי בקיץ, חודשי בחורף</b></li>
                  <li>קריאות SOS: <b>2 חינם</b></li>
                  <li>כימיקלים: <b>נפרד</b></li>
                  <li>ריסוס בית: <b>נפרד</b></li>
                  <li>פיקוח הנדסי: <b>לא</b></li>
                </ul>
              </div>
            </div>
            <div className="plan-card p-4">
              <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                <div>
                  <h3 className="font-bold text-lg">מנוי קיץ</h3>
                  <p className="text-sm text-slate-600">תחזוקה מקצועית לעונת הרחצה</p>
                </div>
                <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
              </button>
              <div className="plan-details mt-3 hidden">
                <ul className="text-sm text-slate-700 space-y-1 mb-3">
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>תחזוקה שוטפת מאי-ספטמבר</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ניקוי שבועי ובדיקות מים</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>מילוי מים לפי צורך</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ביקור חירום אחד בחינם</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>ייעוץ טלפוני ללא הגבלה</li>
                </ul>
                <div className="text-sm text-slate-600 mb-1 font-medium">הצוות שלנו</div>
                <div className="text-sm text-slate-700 mb-3">איש משאבות • מנקה מקצועי</div>
                <div className="text-sm text-slate-600 mb-1 font-medium">מה כלול:</div>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>ביקורים: <b>שבועי</b></li>
                  <li>קריאות SOS: <b>1 חינם</b></li>
                  <li>כימיקלים: <b>נפרד</b></li>
                  <li>ריסוס בית: <b>נפרד</b></li>
                  <li>פיקוח הנדסי: <b>לא</b></li>
                </ul>
              </div>
            </div>
            <div className="plan-card p-4">
              <button className="w-full flex items-center justify-between text-right" data-plan-toggle>
                <div>
                  <h3 className="font-bold text-lg">מנוי גינון</h3>
                  <p className="text-sm text-slate-600">פרטים בהמשך</p>
                </div>
                <span className="text-slate-500"><i className="fas fa-chevron-down"></i></span>
              </button>
              <div className="plan-details mt-3 hidden">
                <p className="text-sm text-slate-600">פרטים בהמשך</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 text-white snap-start reveal">
        <div className="max-w-5xl mx-auto px-4 py-8 grid sm:grid-cols-3 gap-6">
          <div>
            <div className="font-bold mb-2">צור קשר</div>
            <div className="text-sm text-white/80">טלפון: 050-0000000</div>
            <div className="text-sm text-white/80">דוא"ל: info@wat-nature.co.il</div>
          </div>
          <div>
            <div className="font-bold mb-2">ניווט</div>
            <ul className="space-y-1 text-sm text-white/80">
              <li><a href="#services">שירותים</a></li>
              <li><a href="#plans">מנויים</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">שעות פעילות</div>
            <div className="text-sm text-white/80">א׳-ה׳ 08:00–18:00 | ו׳ 08:00–13:00</div>
          </div>
        </div>
        <div className="text-center text-xs text-white/60 pb-6">© {new Date().getFullYear()} מים וטבע</div>
      </footer>

      {/* Feature Modal */}
      <div id="featureModal" className="fixed inset-0 z-50 hidden">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        <div className="absolute inset-x-4 bottom-8 sm:inset-0 sm:m-auto sm:max-w-md">
          <div className="rounded-2xl bg-white shadow-xl p-5">
            <div className="font-bold mb-2">היכולת אינה זמינה זמנית</div>
            <p className="text-sm text-slate-600">אבחון ה-AI והצ׳אט החכם נמצאים בתחזוקה בסביבה זו. אנא נסו שוב מאוחר יותר.</p>
            <div className="mt-4 text-left">
              <button id="featureModalClose" className="btn btn-primary">סגור</button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal (RTL) */}
      <div id="authModal" className="fixed inset-0 z-50 hidden">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        <div className="absolute inset-x-4 bottom-8 sm:inset-0 sm:m-auto sm:max-w-md">
          <div className="rounded-2xl bg-white shadow-xl p-5">
            <div className="font-bold mb-2">התחברות / הרשמה</div>
            {/* Tabs header */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <button id="authTabLogin" className="px-3 py-2 rounded-lg border bg-slate-100 text-slate-800">התחברות</button>
              <button id="authTabRegister" className="px-3 py-2 rounded-lg border text-slate-700">הרשמה</button>
            </div>
            {/* Shared fields */}
            <div className="grid gap-3">
              <input id="authEmailModal" type="email" placeholder="דוא&quot;ל" className="border rounded-lg px-3 py-2" />
              <input id="authPasswordModal" type="password" placeholder="סיסמה" className="border rounded-lg px-3 py-2" />
              {/* Show password toggle */}
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input id="authShowPassword" type="checkbox" className="rounded" /> הצג סיסמה
              </label>
              {/* Confirm password (register only) */}
              <input id="authPasswordConfirm" type="password" placeholder="אימות סיסמה" className="border rounded-lg px-3 py-2 hidden" />

              {/* Login actions */}
              <div id="authLoginActions" className="flex gap-2">
                <button id="btnLoginModal" className="btn btn-primary">התחבר</button>
                <button id="btnResetModal" className="btn">איפוס סיסמה</button>
              </div>

              {/* Register actions */}
              <div id="authRegisterActions" className="flex gap-2 hidden">
                <button id="btnRegisterModal" className="btn">הירשם</button>
              </div>

              <button id="btnLogoutModal" className="btn hidden">התנתק</button>
              <div id="authStatusModal" className="text-sm text-slate-600"></div>
            </div>
            <div className="mt-4 text-left">
              <button id="authModalClose" className="btn">סגור</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <nav id="bottomNav" className="sm:hidden fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-5xl mx-auto px-4 pb-[calc(env(safe-area-inset-bottom)+8px)]">
          <div className="backdrop-blur bg-white/90 border border-white/80 rounded-2xl shadow-xl">
            <div className="grid grid-cols-5 text-center py-2">
              <button data-tab="diagnosis" className="flex flex-col items-center gap-1 text-slate-700">
                <span className="nav-icon w-10 h-10 grid place-items-center rounded-xl bg-blue-50 text-blue-600"><i className="fas fa-camera"></i></span>
                <span className="text-[11px] leading-none">אבחון</span>
              </button>
              <button data-tab="chat" className="flex flex-col items-center gap-1 text-slate-700">
                <span className="nav-icon w-10 h-10 grid place-items-center rounded-xl bg-blue-50 text-blue-600"><i className="fas fa-robot"></i></span>
                <span className="text-[11px] leading-none">צ׳אט</span>
              </button>
              <button data-tab="subscription" className="flex flex-col items-center gap-1 text-slate-700">
                <span className="nav-icon w-10 h-10 grid place-items-center rounded-xl bg-blue-50 text-blue-600"><i className="fas fa-water-ladder"></i></span>
                <span className="text-[11px] leading-none">מנויים</span>
              </button>
              <button data-tab="portal" className="flex flex-col items-center gap-1 text-slate-700">
                <span className="nav-icon w-10 h-10 grid place-items-center rounded-xl bg-blue-50 text-blue-600"><i className="fas fa-id-badge"></i></span>
                <span className="text-[11px] leading-none">הפורטל</span>
              </button>
              <a href="tel:0500000000" className="flex flex-col items-center gap-1 text-slate-700">
                <span className="nav-icon w-10 h-10 grid place-items-center rounded-xl bg-blue-50 text-blue-600"><i className="fas fa-phone"></i></span>
                <span className="text-[11px] leading-none">שיחה</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </main>
  )
})

// ------------------- API: Health & Config -------------------
app.get('/api/health', (c) => c.json({ ok: true }))

// New: env-backed config endpoint (use this on frontend)
app.get('/api/config/env', (c) => {
  return c.json({
    name: 'מים וטבע',
    baseUrl: c.env.PUBLIC_BASE_URL || (new URL(c.req.url)).origin,
    plans: ['basic', 'monthly', 'yearly', 'vip', 'premium'],
    supabase: {
      url: c.env.PUBLIC_SUPABASE_URL || '',
      anon: c.env.PUBLIC_SUPABASE_ANON_KEY || ''
    },
    features: {
      aiEnabled: Boolean(c.env.OPENAI_API_KEY),
      stripeEnabled: Boolean(c.env.STRIPE_SECRET_KEY),
      mockAuthFallback: false
    }
  })
})

// Legacy endpoint kept for compatibility
app.get('/api/config/public', (c) => {
  return c.json({
    name: 'מים וטבע',
    baseUrl: c.env.PUBLIC_BASE_URL || (new URL(c.req.url)).origin,
    plans: ['basic', 'monthly', 'yearly', 'vip', 'premium'],
    supabase: {
      url: c.env.PUBLIC_SUPABASE_URL || '',
      anon: c.env.PUBLIC_SUPABASE_ANON_KEY || ''
    },
    features: {
      aiEnabled: Boolean(c.env.OPENAI_API_KEY),
      stripeEnabled: Boolean(c.env.STRIPE_SECRET_KEY),
      mockAuthFallback: false
    }
  })
})


// ------------------- API: Mock Auth (temp until Supabase) -------------------
app.post('/api/auth/login', async (c) => {
  const body = await c.req.json<{ email: string, password: string }>().catch(() => ({ email: '', password: '' }))
  if (!body.email || !body.password) return c.json({ error: 'Missing credentials' }, 400)
  // TEMP: mock token (replace with Supabase later)
  const token = 'mock.' + btoa(body.email)
  return c.json({ token, user: { email: body.email, role: 'customer' } })
})

app.get('/api/auth/me', (c) => {
  const auth = c.req.header('authorization') || ''
  if (!auth.startsWith('Bearer mock.')) return c.json({ error: 'Unauthorized' }, 401)
  const email = atob(auth.replace('Bearer mock.', ''))
  return c.json({ email, name: 'לקוח/ה', role: 'customer' })
})

// ------------------- API: AI Diagnose (OpenAI Vision or mock) -------------------
app.post('/api/diagnose', async (c) => {
  const { env } = c
  const form = await c.req.parseBody()
  const file = form['image']
  if (!file || !(file instanceof File)) return c.json({ error: 'Image is required' }, 400)

  if (!env.OPENAI_API_KEY) {
    return c.json({
      source: 'mock',
      findings: [
        'Slight algae presence near waterline',
        'Filter likely needs backwashing',
      ],
      recommendations: [
        'Brush walls and vacuum debris',
        'Check pH (target 7.2–7.6) and free chlorine (1–3 ppm)',
        'Backwash filter and inspect pump basket',
      ],
    })
  }

  // Real call to OpenAI (vision) – minimal example
  const b64 = await file.arrayBuffer().then((buf) => {
    let binary = ''
    const bytes = new Uint8Array(buf)
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
  })

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional pool maintenance diagnostician. Return concise findings and specific recommendations in JSON.'
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this pool photo for issues and give recommended actions.' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}` } }
        ]
      }
    ],
    temperature: 0.2
  }

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!resp.ok) {
    const txt = await resp.text()
    return c.json({ error: 'OpenAI error', detail: txt }, 502)
  }

  const data = await resp.json<any>()
  const text = data.choices?.[0]?.message?.content || ''
  return c.json({ source: 'openai', raw: text })
})

// ------------------- API: Smart Chat with keyword filter -------------------
const KEYWORDS = ['pool', 'chlorine', 'ph', 'filter', 'pump', 'algae', 'leak', 'skimmer', 'vacuum', 'backwash', 'garden', 'plants']

app.post('/api/ai/chat', async (c) => {
  const { env } = c
  const { question } = await c.req.json<{ question: string }>().catch(() => ({ question: '' }))
  if (!question || question.trim().length < 4) return c.json({ error: 'Question unclear. Please rephrase.' }, 400)
  const qLower = question.toLowerCase()
  const relevant = KEYWORDS.some(k => qLower.includes(k))
  if (!relevant) return c.json({ error: 'Question unclear or irrelevant. Try again with pool/garden specifics.' }, 400)

  if (!env.OPENAI_API_KEY) {
    return c.json({ source: 'mock', answer: 'For light algae, brush the walls, vacuum, and balance pH 7.2–7.6 with chlorine 1–3 ppm.' })
  }

  const prompt = `Answer briefly as a professional pool/garden maintenance assistant. Focus on practical steps. Question: ${question}`
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.2 })
  })
  if (!resp.ok) return c.json({ error: 'OpenAI error' }, 502)
  const data = await resp.json<any>()
  const answer = data.choices?.[0]?.message?.content || 'No answer'
  return c.json({ source: 'openai', answer })
})

// ------------------- API: Scheduling - conflict check (server-side, optional) -------------------
app.post('/api/schedule/check', async (c) => {
  try {
    const { date, window } = await c.req.json<{ date: string; window: string }>().catch(() => ({ date: '', window: '' }))
    if (!date || !window) return c.json({ error: 'missing date/window' }, 400)
    const [start] = window.split('-')
    // Build ISO from client-provided local date/time (final storage should be UTC)
    const startIso = new Date(`${date}T${start}:00`).toISOString()

    const url = c.env.PUBLIC_SUPABASE_URL
    const key = c.env.SUPABASE_SERVICE_KEY
    if (!url || !key) {
      // No server credentials configured yet – allow client to proceed (frontend still runs its own check)
      return c.json({ ok: true, source: 'noop' })
    }

    // Supabase REST check for an existing appointment on that exact window_start (only active statuses)
    const endpoint = `${url.replace(/\/?$/, '')}/rest/v1/appointments?select=id&window_start=eq.${encodeURIComponent(startIso)}&status=in.(pending,confirmed)`
    const resp = await fetch(endpoint, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Accept': 'application/json'
      }
    })
    if (!resp.ok) {
      const txt = await resp.text()
      return c.json({ error: 'supabase_error', detail: txt }, 502)
    }
    const list = await resp.json<any[]>()
    if (Array.isArray(list) && list.length > 0) return c.json({ ok: false, conflict: true }, 409)
    return c.json({ ok: true, conflict: false })
  } catch (e) {
    return c.json({ error: 'server_error' }, 500)
  }
})

// ------------------- API: Portal - list appointments for logged-in user (server-side via Supabase Auth) -------------------
app.get('/api/portal/appointments', async (c) => {
  try {
    const url = c.env.PUBLIC_SUPABASE_URL
    const key = c.env.SUPABASE_SERVICE_KEY
    const auth = c.req.header('authorization') || ''
    if (!url || !key) return c.json({ error: 'not_configured' }, 501)
    if (!auth.startsWith('Bearer ')) return c.json({ error: 'unauthorized' }, 401)

    // Validate token and get user id from Supabase Auth
    const u = await fetch(`${url.replace(/\/?$/, '')}/auth/v1/user`, {
      headers: { 'apikey': key, 'Authorization': auth }
    })
    if (!u.ok) return c.json({ error: 'unauthorized' }, 401)
    const user = await u.json<any>()
    const uid = user?.id
    if (!uid) return c.json({ error: 'no_user' }, 401)

    // Query appointments for this user (service role bypasses RLS but we restrict by uid)
    const q = `${url.replace(/\/?$/, '')}/rest/v1/appointments?select=*` +
      `&user_id=eq.${encodeURIComponent(uid)}` +
      `&order=window_start.asc` +
      `&limit=10`
    const r = await fetch(q, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Accept': 'application/json' } })
    if (!r.ok) {
      const txt = await r.text();
      return c.json({ error: 'supabase_error', detail: txt }, 502)
    }
    const list = await r.json<any[]>()
    return c.json({ data: list || [] })
  } catch (e) {
    return c.json({ error: 'server_error' }, 500)
  }
})

// ------------------- API: Appointments - cancel with Israel same-day prohibition -------------------
app.post('/api/appointments/cancel', async (c) => {
  try {
    const { id } = await c.req.json<{ id: string }>().catch(() => ({ id: '' }))
    if (!id) return c.json({ error: 'missing id' }, 400)

    const url = c.env.PUBLIC_SUPABASE_URL
    const key = c.env.SUPABASE_SERVICE_KEY
    if (!url || !key) return c.json({ error: 'not_configured' }, 501)

    // Fetch appointment
    const fetchUrl = `${url.replace(/\/?$/, '')}/rest/v1/appointments?select=id,window_start,status&id=eq.${encodeURIComponent(id)}`
    const getResp = await fetch(fetchUrl, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Accept': 'application/json' } })
    if (!getResp.ok) return c.json({ error: 'fetch_failed' }, 502)
    const arr = await getResp.json<any[]>()
    const appt = Array.isArray(arr) ? arr[0] : null
    if (!appt) return c.json({ error: 'not_found' }, 404)

    // Israel same-day rule
    const tz = 'Asia/Jerusalem'
    const nowIL = new Date(new Date().toLocaleString('en-US', { timeZone: tz }))
    const startIL = new Date(new Date(appt.window_start).toLocaleString('en-US', { timeZone: tz }))
    const sameDay = nowIL.getFullYear() === startIL.getFullYear() && nowIL.getMonth() === startIL.getMonth() && nowIL.getDate() === startIL.getDate()
    if (sameDay) return c.json({ error: 'same_day_forbidden' }, 400)

    // Update status to cancelled
    const updUrl = `${url.replace(/\/?$/, '')}/rest/v1/appointments?id=eq.${encodeURIComponent(id)}`
    const updResp = await fetch(updUrl, {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ status: 'cancelled' })
    })
    if (!updResp.ok) {
      const txt = await updResp.text();
      return c.json({ error: 'update_failed', detail: txt }, 502)
    }
    const updated = await updResp.json<any>()
    return c.json({ ok: true, data: updated })
  } catch (e) {
    return c.json({ error: 'server_error' }, 500)
  }
})

// ------------------- API: Stripe Checkout (or mock) -------------------
const PLAN_MAP: Record<string, { name: string; amountIls: number; interval: 'month' | 'year'; interval_count: number }> = {
  basic:   { name: 'מנוי בסיסי',   amountIls: 600,  interval: 'month', interval_count: 1 },
  monthly: { name: 'מנוי חודשי',   amountIls: 1000, interval: 'month', interval_count: 1 },
  yearly:  { name: 'מנוי שנתי',    amountIls: 9000, interval: 'year',  interval_count: 1 },
  vip:     { name: 'מנוי VIP',     amountIls: 15000,interval: 'year',  interval_count: 1 },
  premium: { name: 'מנוי פרימיום', amountIls: 2500, interval: 'month', interval_count: 1 },
}

app.post('/api/stripe/create-checkout-session', async (c) => {
  const { env } = c
  const { plan } = await c.req.json<{ plan: string }>().catch(() => ({ plan: '' }))
  const cfg = PLAN_MAP[plan]
  if (!cfg) return c.json({ error: 'Unknown plan' }, 400)

  const baseUrl = env.PUBLIC_BASE_URL || (new URL(c.req.url)).origin
  const success_url = `${baseUrl}/?status=success`
  const cancel_url = `${baseUrl}/?status=cancel`

  if (!env.STRIPE_SECRET_KEY) {
    return c.json({ source: 'mock', url: success_url + `&plan=${plan}` })
  }

  const body = new URLSearchParams()
  body.set('mode', 'subscription')
  body.set('success_url', success_url)
  body.set('cancel_url', cancel_url)
  body.set('line_items[0][price_data][currency]', 'ils')
  body.set('line_items[0][price_data][recurring][interval]', cfg.interval)
  body.set('line_items[0][price_data][recurring][interval_count]', String(cfg.interval_count))
  body.set('line_items[0][price_data][unit_amount]', String(cfg.amountIls * 100))
  body.set('line_items[0][price_data][product_data][name]', cfg.name)
  body.set('line_items[0][quantity]', '1')

  const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })
  const data = await resp.json<any>()
  if (!resp.ok) return c.json({ error: 'Stripe error', detail: data }, 502)
  return c.json({ id: data.id, url: data.url })
})

// Minimal webhook handler with optional signature check
app.post('/api/stripe/webhook', async (c) => {
  const { env } = c
  const sigHeader = c.req.header('stripe-signature') || ''
  const body = await c.req.text()

  // Optional signature verification (v1)
  if (env.STRIPE_WEBHOOK_SECRET) {
    const parts = sigHeader.split(',').reduce<Record<string, string>>((acc, p) => { const [k, v] = p.split('='); if (k && v) acc[k] = v; return acc }, {})
    const t = parts['t']
    const v1 = parts['v1']
    if (!t || !v1) return c.json({ error: 'Invalid signature header' }, 400)
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', encoder.encode(env.STRIPE_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(`${t}.${body}`))
    const calc = Array.from(new Uint8Array(signatureBytes)).map(b => b.toString(16).padStart(2, '0')).join('')
    if (calc !== v1) return c.json({ error: 'Signature mismatch' }, 400)
  }

  // TODO: handle event types (checkout.session.completed, invoice.paid, etc.)
  return c.json({ received: true })
})

export default app
