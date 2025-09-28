import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Use JSX renderer
app.use(renderer)

// Main Application Component
const App = () => {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navigation Header */}
      <header class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-3xl wave-animation">🌊</div>
              <div>
                <h1 class="text-xl font-bold hebrew-title">
                  <span class="text-blue-600">מים</span>{" "}
                  <span class="text-green-600">וטבע</span>
                </h1>
                <p class="text-sm text-gray-600">שירותי בריכות, גינון ונקיון מקצועי</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn-water text-white px-4 py-2 rounded-lg text-sm">
                <i class="fas fa-user-plus ml-2"></i>
                התחברות
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section class="gradient-bg text-white py-20 relative overflow-hidden">
        <div class="container mx-auto px-4 text-center relative z-10">
          <div class="float-animation">
            <h2 class="text-5xl md:text-6xl font-bold hebrew-title mb-6">
              הכל במקום אחד
            </h2>
            <p class="text-xl md:text-2xl hebrew-subtitle mb-8 opacity-90">
              שירותי בריכות וגינון מקצועי עם ניסיון של שנים
            </p>
          </div>

          {/* Statistics */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="glass-card rounded-xl p-6">
              <div class="text-3xl font-bold">15+</div>
              <div class="text-sm opacity-80">שנות ניסיון</div>
            </div>
            <div class="glass-card rounded-xl p-6">
              <div class="text-3xl font-bold">500+</div>
              <div class="text-sm opacity-80">לקוחות מרוצים</div>
            </div>
            <div class="glass-card rounded-xl p-6">
              <div class="text-3xl font-bold">24/7</div>
              <div class="text-sm opacity-80">זמינות</div>
            </div>
          </div>

          {/* Main CTAs */}
          <div class="flex flex-col md:flex-row gap-6 justify-center">
            <button class="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105">
              <i class="fas fa-camera ml-3"></i>
              אבחון מהיר
            </button>
            <button class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
              <i class="fas fa-phone ml-3"></i>
              צור קשר
            </button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div class="absolute top-10 right-10 text-6xl opacity-20 float-animation">💧</div>
        <div class="absolute bottom-20 left-20 text-4xl opacity-20 float-animation" style="animation-delay: 1s;">🏊</div>
        <div class="absolute top-1/2 right-1/4 text-5xl opacity-20 float-animation" style="animation-delay: 2s;">🌱</div>
      </section>

      {/* Service Tabs */}
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h3 class="text-3xl font-bold text-center mb-12 hebrew-title text-gray-800">
            השירותים שלנו
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Diagnosis Tab */}
            <div class="glass-card-dark rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              <div class="text-center">
                <div class="text-4xl mb-4 text-blue-500">📸</div>
                <h4 class="text-xl font-bold mb-3 hebrew-title">אבחון</h4>
                <p class="text-gray-600 mb-4">צילום ואבחון מהיר של מצב הבריכה</p>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full">
                  התחל אבחון
                </button>
              </div>
            </div>

            {/* Scheduler Tab */}
            <div class="glass-card-dark rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              <div class="text-center">
                <div class="text-4xl mb-4 text-blue-500">📅</div>
                <h4 class="text-xl font-bold mb-3 hebrew-title">תיאום טכנאי</h4>
                <p class="text-gray-600 mb-4">קביעת תור לטכנאי מקצועי</p>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full">
                  קבע תור
                </button>
              </div>
            </div>

            {/* Cabinet Tab */}
            <div class="glass-card-dark rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              <div class="text-center">
                <div class="text-4xl mb-4 text-blue-500">🔧</div>
                <h4 class="text-xl font-bold mb-3 hebrew-title">ארון תחזוקה</h4>
                <p class="text-gray-600 mb-4">ניהול ציוד ואביזרי תחזוקה</p>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full">
                  ניהול ציוד
                </button>
              </div>
            </div>

            {/* Subscription Tab */}
            <div class="glass-card-dark rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              <div class="text-center">
                <div class="text-4xl mb-4 text-blue-500">📋</div>
                <h4 class="text-xl font-bold mb-3 hebrew-title">מנויים</h4>
                <p class="text-gray-600 mb-4">תוכניות מנוי לתחזוקה שוטפת</p>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full">
                  בחר מנוי
                </button>
              </div>
            </div>

            {/* Garden Tab */}
            <div class="glass-card-dark rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              <div class="text-center">
                <div class="text-4xl mb-4 text-nature-500">🌿</div>
                <h4 class="text-xl font-bold mb-3 hebrew-title">גינון</h4>
                <p class="text-gray-600 mb-4">שירותי גינון וטיפוח נוף</p>
                <button class="btn-nature text-white px-6 py-2 rounded-lg w-full">
                  שירותי גינון
                </button>
              </div>
            </div>

            {/* Garden Subscription Tab */}
            <div class="glass-card-dark rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              <div class="text-center">
                <div class="text-4xl mb-4 text-nature-500">🌱</div>
                <h4 class="text-xl font-bold mb-3 hebrew-title">מנוי גינון</h4>
                <p class="text-gray-600 mb-4">תוכניות מנוי לתחזוקת גינה</p>
                <button class="btn-nature text-white px-6 py-2 rounded-lg w-full">
                  מנוי גינה
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section class="py-16 gradient-bg">
        <div class="container mx-auto px-4">
          <h3 class="text-3xl font-bold text-center mb-12 hebrew-title text-white">
            תוכניות המנוי שלנו
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Basic Plan */}
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-center">
                <h4 class="text-xl font-bold mb-3 hebrew-title">מנוי בסיסי</h4>
                <div class="text-3xl font-bold text-blue-600 mb-4">₪600</div>
                <div class="text-sm text-gray-600 mb-6">לחודש</div>
                <ul class="text-right space-y-2 mb-6">
                  <li>✓ 2 ביקורים בחודש</li>
                  <li>✓ ניקוי בסיסי</li>
                  <li>✓ בדיקת כימיקלים</li>
                </ul>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full">
                  בחר תוכנית
                </button>
              </div>
            </div>

            {/* Monthly Plan */}
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-center">
                <h4 class="text-xl font-bold mb-3 hebrew-title">מנוי חודשי</h4>
                <div class="text-3xl font-bold text-blue-600 mb-4">₪1000</div>
                <div class="text-sm text-gray-600 mb-6">לחודש</div>
                <ul class="text-right space-y-2 mb-6">
                  <li>✓ 4 ביקורים בחודש</li>
                  <li>✓ ניקוי מלא</li>
                  <li>✓ טיפול כימי</li>
                  <li>✓ תחזוקת ציוד</li>
                </ul>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full">
                  בחר תוכנית
                </button>
              </div>
            </div>

            {/* Yearly Plan - Popular */}
            <div class="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden border-2 border-blue-500">
              <div class="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm">פופולרי</div>
              <div class="text-center">
                <h4 class="text-xl font-bold mb-3 hebrew-title">מנוי שנתי</h4>
                <div class="text-3xl font-bold text-blue-600 mb-4">₪9000</div>
                <div class="text-sm text-gray-600 mb-6">לשנה</div>
                <ul class="text-right space-y-2 mb-6">
                  <li>✓ ביקורים שבועיים</li>
                  <li>✓ ניקוי מקצועי</li>
                  <li>✓ טיפול כימי מלא</li>
                  <li>✓ תחזוקה מונעת</li>
                  <li>✓ זמינות 24/7</li>
                </ul>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full">
                  בחר תוכנית
                </button>
              </div>
            </div>

            {/* VIP Plan */}
            <div class="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl p-6 shadow-lg">
              <div class="text-center">
                <h4 class="text-xl font-bold mb-3 hebrew-title">מנוי VIP</h4>
                <div class="text-3xl font-bold mb-4">₪15000</div>
                <div class="text-sm opacity-90 mb-6">לשנה</div>
                <ul class="text-right space-y-2 mb-6">
                  <li>✓ כל שירותי השנתי</li>
                  <li>✓ כימיקלים כלולים</li>
                  <li>✓ ריסוס בית</li>
                  <li>✓ שטיפת רכב שבועית</li>
                  <li>✓ שירות פרימיום</li>
                </ul>
                <button class="bg-white text-orange-500 px-6 py-2 rounded-lg w-full font-bold">
                  בחר תוכנית
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-3xl font-bold mb-6 hebrew-title text-gray-800">
                מי אנחנו?
              </h3>
              <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                מים וטבע הינה חברה מובילה בתחום שירותי בריכות וגינון עם ניסיון של למעלה מ-15 שנה. 
                אנו מתמחים במתן שירות מקצועי, אמין ומותאם אישית לכל לקוח.
              </p>
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">500+</div>
                  <div class="text-sm text-gray-600">לקוחות מרוצים</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">15+</div>
                  <div class="text-sm text-gray-600">שנות ניסיון</div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-8xl mb-4">🏊‍♂️</div>
              <p class="text-gray-600">שירות מקצועי ואמין</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section class="py-16 bg-gray-100">
        <div class="container mx-auto px-4 text-center">
          <h3 class="text-3xl font-bold mb-8 hebrew-title text-gray-800">
            צור קשר
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-3xl mb-4 text-blue-500">📞</div>
              <h4 class="font-bold mb-2">טלפון</h4>
              <p class="text-gray-600">050-123-4567</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-3xl mb-4 text-blue-500">📧</div>
              <h4 class="font-bold mb-2">אימייל</h4>
              <p class="text-gray-600">info@water-nature.co.il</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-3xl mb-4 text-blue-500">📍</div>
              <h4 class="font-bold mb-2">כתובת</h4>
              <p class="text-gray-600">תל אביב, ישראל</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4 text-center">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="text-2xl">🌊</div>
            <div>
              <h4 class="font-bold">
                <span class="text-blue-400">מים</span>{" "}
                <span class="text-green-400">וטבע</span>
              </h4>
              <p class="text-sm text-gray-400">שירותי בריכות וגינון מקצועי</p>
            </div>
          </div>
          <div class="border-t border-gray-700 pt-4">
            <p class="text-sm text-gray-400">
              © 2024 מים וטבע. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>

      {/* JavaScript for interactions */}
      <script src="/static/app.js"></script>
    </div>
  )
}

// Routes
app.get('/', (c) => {
  return c.render(<App />)
})

// API Routes for future backend functionality
app.get('/api/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.get('/api/services', (c) => {
  return c.json({
    services: [
      { id: 'diagnosis', name: 'אבחון', icon: '📸' },
      { id: 'scheduler', name: 'תיאום טכנאי', icon: '📅' },
      { id: 'cabinet', name: 'ארון תחזוקה', icon: '🔧' },
      { id: 'subscription', name: 'מנויים', icon: '📋' },
      { id: 'garden', name: 'גינון', icon: '🌿' },
      { id: 'garden-subscription', name: 'מנוי גינון', icon: '🌱' }
    ]
  })
})

app.get('/api/plans', (c) => {
  return c.json({
    plans: [
      { id: 'basic', name: 'מנוי בסיסי', price: 600, visits: 2, period: 'month' },
      { id: 'monthly', name: 'מנוי חודשי', price: 1000, visits: 4, period: 'month' },
      { id: 'yearly', name: 'מנוי שנתי', price: 9000, visits: 'weekly', period: 'year', popular: true },
      { id: 'vip', name: 'מנוי VIP', price: 15000, visits: 'weekly', period: 'year', premium: true }
    ]
  })
})

export default app
