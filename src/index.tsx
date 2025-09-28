import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

const app = new Hono()

// Static assets from public/static
app.use('/static/*', serveStatic({ root: './public' }))

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <main>
      <header className="sticky top-0 z-30 backdrop-blur bg-white/20 border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/30 shadow-inner flex items-center justify-center text-white">
              <i className="fas fa-water"></i>
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold">מים <span className="text-green-300">וטבע</span></div>
              <div className="text-white/80 text-sm">שירותי בריכות, גינון ונקיון מקצועי</div>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-white/90 text-sm">
            <a href="#services" className="hover:text-white transition">שירותים</a>
            <a href="#plans" className="hover:text-white transition">מנויים</a>
            <a href="#contact" className="hover:text-white transition">צור קשר</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-sm mb-2">הכל במקום אחד</h1>
          <p className="text-white/90 mb-6">בריכות • גינון • ניקיון — פתרון מקצועי ומיידי.</p>
          <div className="flex gap-3">
            <a href="#diagnosis" className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg shadow hover:bg-slate-50 transition">
              <i className="fas fa-camera"></i>
              אבחון מהיר
            </a>
            <a href="tel:0500000000" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600 transition">
              <i className="fas fa-phone"></i>
              התקשר עכשיו
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/20 rounded-xl p-3 text-white">
              <div className="text-2xl font-bold">10+</div>
              <div className="text-sm">שנות ניסיון</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-white">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">לקוחות מרוצים</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-white">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">זמינות מיידית</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white/60 backdrop-blur rounded-t-3xl -mt-2">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">שירותים</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: 'fa-microscope', label: 'אבחון' },
              { icon: 'fa-calendar-check', label: 'תיאום טכנאי' },
              { icon: 'fa-toolbox', label: 'ציוד ותחזוקה' },
              { icon: 'fa-water-ladder', label: 'בריכה' },
              { icon: 'fa-seedling', label: 'גינון' },
              { icon: 'fa-robot', label: 'צ׳אט חכם' },
            ].map((s) => (
              <a key={s.label} href="#" className="bg-white rounded-xl shadow p-4 flex items-center justify-center gap-2 hover:shadow-md transition text-slate-700">
                <i className={`fas ${s.icon} text-blue-600`}></i>
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">מנויים</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'מנוי בסיסי', price: '₪600/חודש', features: ['2 ביקורים'] },
              { name: 'מנוי חודשי', price: '₪1000/חודש', features: ['4 ביקורים'] },
              { name: 'מנוי שנתי', price: '₪9000/שנה', features: ['פופולרי'] },
              { name: 'מנוי VIP', price: '₪15000/שנה', features: ['כולל חומרים', 'הדברה', 'שטיפת רכב 1x/שבוע'] },
              { name: 'מנוי פרימיום', price: '₪2500/חודש', features: ['כולל הכל בריכה וגינון', 'ביקור שבועי'] },
            ].map((p) => (
              <div key={p.name} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <span className="text-blue-700 font-semibold">{p.price}</span>
                </div>
                <ul className="text-sm text-slate-600 space-y-1 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><i className="fas fa-check text-emerald-500"></i>{f}</li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2">בחר מנוי</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 text-white">
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
    </main>
  )
})

export default app
