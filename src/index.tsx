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
            <div class="flex items-center gap-3 relative">
              <button class="btn-water text-white px-4 py-2 rounded-lg text-sm login-trigger">
                <i class="fas fa-user-plus ml-2"></i>
                התחברות
              </button>
              <div id="user-menu" class="hidden">
                <button class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors" id="user-menu-button">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-white text-sm"></i>
                  </div>
                  <span class="font-medium text-gray-800 hidden md:block" id="user-name">שם המשתמש</span>
                  <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
                </button>

                <div class="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 hidden z-50" id="user-menu-dropdown">
                  <div class="p-2">
                    <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <i class="fas fa-user text-blue-500"></i>
                      <span>פרופיל אישי</span>
                    </a>
                    <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <i class="fas fa-calendar text-green-500"></i>
                      <span>התורים שלי</span>
                    </a>
                    <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <i class="fas fa-credit-card text-purple-500"></i>
                      <span>המנויים שלי</span>
                    </a>
                    <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <i class="fas fa-file-invoice text-orange-500"></i>
                      <span>חשבוניות</span>
                    </a>
                    <div class="border-t border-gray-200 mt-2 pt-2">
                      <button class="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full text-right" id="logout-btn">
                        <i class="fas fa-sign-out-alt text-red-500"></i>
                        <span>התנתק</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
      <section class="py-16 bg-white" id="services">
        <div class="container mx-auto px-4">
          <h3 class="text-3xl font-bold text-center mb-12 hebrew-title text-gray-800">
            השירותים שלנו
          </h3>

          {/* Tab Navigation */}
          <div class="flex flex-wrap justify-center gap-3 mb-8" id="service-tabs">
            <button class="service-tab active" data-service="diagnosis">
              <i class="fas fa-camera text-lg"></i>
              <span>אבחון</span>
            </button>
            <button class="service-tab" data-service="scheduler">
              <i class="fas fa-calendar text-lg"></i>
              <span>תיאום טכנאי</span>
            </button>
            <button class="service-tab" data-service="cabinet">
              <i class="fas fa-toolbox text-lg"></i>
              <span>ארון תחזוקה</span>
            </button>
            <button class="service-tab" data-service="subscription">
              <i class="fas fa-credit-card text-lg"></i>
              <span>מנוי תחזוקה</span>
            </button>
            <button class="service-tab" data-service="garden">
              <i class="fas fa-leaf text-lg"></i>
              <span>גינון</span>
            </button>
            <button class="service-tab" data-service="garden-subscription">
              <i class="fas fa-seedling text-lg"></i>
              <span>מנוי גינון</span>
            </button>
          </div>

          {/* Tab Content */}
          <div id="service-content" class="min-h-96">
            {/* Diagnosis Content */}
            <div id="diagnosis-content" class="service-content active">
              <div class="glass-card-dark p-8 rounded-2xl max-w-2xl mx-auto">
                <h4 class="text-2xl font-bold hebrew-title mb-6 text-center text-gray-800">אבחון בריכה באמצעות תמונה</h4>
                
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 text-center mb-6">
                  <i class="fas fa-camera text-6xl text-blue-500 mb-4"></i>
                  <p class="text-gray-600 hebrew-subtitle text-lg mb-4">צלמו את הבריכה לאבחון מקצועי מיידי</p>
                  <p class="text-sm text-gray-500">האבחון כולל זיהוי בעיות, המלצות טיפול והערכת ציוד</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                  <button class="btn-water text-white py-4 rounded-xl font-medium text-lg">
                    <i class="fas fa-camera ml-2"></i>
                    צילום חדש
                  </button>
                  <button class="glass-card text-gray-700 py-4 rounded-xl font-medium text-lg">
                    <i class="fas fa-images ml-2"></i>
                    העלאה מהגלריה
                  </button>
                </div>
              </div>
            </div>

            {/* Scheduler Content */}
            <div id="scheduler-content" class="service-content">
              <div class="glass-card-dark p-8 rounded-2xl max-w-2xl mx-auto">
                <h4 class="text-2xl font-bold hebrew-title mb-6 text-center text-gray-800">תיאום פגישה עם טכנאי</h4>
                
                <form class="space-y-6">
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
                      <input type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right" placeholder="הכניסו את שמכם" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">טלפון *</label>
                      <input type="tel" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right" placeholder="052-123-4567" />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">כתובת מלאה *</label>
                    <input type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right" placeholder="רחוב, מספר בית, עיר" />
                  </div>
                  
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">תאריך מועדף</label>
                      <input type="date" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">שעה מועדפת</label>
                      <select class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right">
                        <option>בחרו שעה</option>
                        <option>08:00 - 10:00</option>
                        <option>10:00 - 12:00</option>
                        <option>12:00 - 14:00</option>
                        <option>14:00 - 16:00</option>
                        <option>16:00 - 18:00</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">סוג שירות</label>
                    <select class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right">
                      <option>תחזוקה שוטפת</option>
                      <option>תיקון תקלה דחופה</option>
                      <option>התקנת ציוד חדש</option>
                      <option>ייעוץ מקצועי</option>
                      <option>בדיקה תקופתית</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">הערות נוספות</label>
                    <textarea class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right" rows={3} placeholder="תאמו לנו בעיות ספציפיות או דרישות מיוחדות"></textarea>
                  </div>
                  
                  <button type="submit" class="w-full btn-water text-white py-4 rounded-xl font-bold text-lg">
                    <i class="fas fa-calendar-check ml-2"></i>
                    שליחת בקשה לתיאום
                  </button>
                </form>
              </div>
            </div>

            {/* Cabinet Content */}
            <div id="cabinet-content" class="service-content">
              <div class="glass-card-dark p-8 rounded-2xl">
                <h4 class="text-2xl font-bold hebrew-title mb-6 text-center text-gray-800">ארון תחזוקה וציוד מקצועי</h4>
                
                <div class="grid md:grid-cols-2 gap-8">
                  <div class="space-y-6">
                    <h5 class="text-xl font-semibold text-blue-600 border-b border-blue-200 pb-2">כימיקלים לבריכה</h5>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">כלור גרנולרי 5 ק״ג</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-blue-600 hebrew-number">₪89</div>
                          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
                            <i class="fas fa-shopping-cart ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">כלור טבליות איטיות 200 גר׳</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-blue-600 hebrew-number">₪156</div>
                          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
                            <i class="fas fa-shopping-cart ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">מוריד pH - 1.5 ק״ג</div>
                          <div class="text-sm text-gray-500">מעט במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-blue-600 hebrew-number">₪45</div>
                          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
                            <i class="fas fa-shopping-cart ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">מעלה pH - 1.5 ק״ג</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-blue-600 hebrew-number">₪45</div>
                          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
                            <i class="fas fa-shopping-cart ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">אלגיסייד נגד אצות - 1 ליטר</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-blue-600 hebrew-number">₪78</div>
                          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
                            <i class="fas fa-shopping-cart ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="space-y-6">
                    <h5 class="text-xl font-semibold text-green-600 border-b border-green-200 pb-2">ציוד תחזוקה</h5>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">מברשת דפנות אלומיניום</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-green-600 hebrew-number">₪120</div>
                          <button class="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                            <i class="fas fa-wrench ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">רשת לעלים עם מוט 3 מטר</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-green-600 hebrew-number">₪95</div>
                          <button class="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                            <i class="fas fa-wrench ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">שואב בריכה ידני</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-green-600 hebrew-number">₪180</div>
                          <button class="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                            <i class="fas fa-wrench ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">ערכת בדיקה pH וכלור</div>
                          <div class="text-sm text-gray-500">במלאי</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-green-600 hebrew-number">₪65</div>
                          <button class="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                            <i class="fas fa-wrench ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
                        <div>
                          <div class="font-medium text-gray-800">פילטרים לסנן חול</div>
                          <div class="text-sm text-gray-500">להזמנה</div>
                        </div>
                        <div class="text-left">
                          <div class="font-bold text-green-600 hebrew-number">₪340</div>
                          <button class="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                            <i class="fas fa-wrench ml-1"></i>
                            הזמן
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-8 text-center bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
                  <h6 class="font-bold text-lg mb-2">משלוח עד הבית</h6>
                  <p class="text-gray-600 mb-4">משלוח חינם להזמנות מעל ₪200 | זמן אספקה: 2-3 ימי עסקים</p>
                  <button class="btn-water text-white px-8 py-3 rounded-xl font-medium">
                    <i class="fas fa-truck ml-2"></i>
                    צור קשר להזמנת ציוד
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription Plans Content */}
            <div id="subscription-content" class="service-content">
              <div class="text-center mb-8">
                <h4 class="text-2xl font-bold hebrew-title text-gray-800">תוכניות מנוי לתחזוקה מקצועית</h4>
                <p class="text-gray-600 mt-2">בחרו את התוכנית המתאימה ביותר לבריכה שלכם</p>
              </div>
              
              <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* This content is already rendered in the subscription section above */}
              </div>
            </div>

            {/* Garden Services Content */}
            <div id="garden-content" class="service-content">
              <div class="glass-card-dark p-8 rounded-2xl">
                <h4 class="text-2xl font-bold hebrew-title mb-6 text-center text-gray-800">שירותי גינון וטיפוח נוף מקצועי</h4>
                
                <div class="grid md:grid-cols-3 gap-8 mb-8">
                  <div class="text-center p-6 bg-white/50 rounded-xl">
                    <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-cut text-white text-3xl"></i>
                    </div>
                    <h5 class="font-bold text-lg mb-3 text-gray-800">גיזום ועיצוב</h5>
                    <p class="text-sm text-gray-600 mb-4">גיזום מקצועי של עצים, שיחים ועיצוב נוף יפהפה</p>
                    <ul class="text-xs text-right space-y-1 text-gray-500">
                      <li>• גיזום עצי פרי</li>
                      <li>• עיצוב שיחי נוי</li>
                      <li>• גיזום דקלים</li>
                    </ul>
                  </div>
                  
                  <div class="text-center p-6 bg-white/50 rounded-xl">
                    <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-seedling text-white text-3xl"></i>
                    </div>
                    <h5 class="font-bold text-lg mb-3 text-gray-800">נטיעה והשתלה</h5>
                    <p class="text-sm text-gray-600 mb-4">נטיעת צמחים חדשים וטיפוח דשא ירוק ובריא</p>
                    <ul class="text-xs text-right space-y-1 text-gray-500">
                      <li>• זריעת דשא</li>
                      <li>• נטיעת עצים</li>
                      <li>• השתלת פרחים</li>
                    </ul>
                  </div>
                  
                  <div class="text-center p-6 bg-white/50 rounded-xl">
                    <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-tint text-white text-3xl"></i>
                    </div>
                    <h5 class="font-bold text-lg mb-3 text-gray-800">השקיה חכמה</h5>
                    <p class="text-sm text-gray-600 mb-4">התקנת מערכות השקיה אוטומטיות וחסכוניות</p>
                    <ul class="text-xs text-right space-y-1 text-gray-500">
                      <li>• מערכות טפטוף</li>
                      <li>• ממטרות אוטומטיות</li>
                      <li>• בקרי השקיה חכמים</li>
                    </ul>
                  </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                    <h6 class="font-bold text-lg mb-3 text-gray-800">שירותים נוספים</h6>
                    <ul class="space-y-2 text-sm">
                      <li class="flex items-center gap-2">
                        <i class="fas fa-check text-green-500"></i>
                        <span>דישון ותזונת צמחים</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <i class="fas fa-check text-green-500"></i>
                        <span>מיגון מעפורות</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <i class="fas fa-check text-green-500"></i>
                        <span>טיפול במזיקים טבעי</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <i class="fas fa-check text-green-500"></i>
                        <span>תכנון וייעוץ נופי</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl">
                    <h6 class="font-bold text-lg mb-3 text-gray-800">מחירים שקופים</h6>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span>גיזום עץ בינוני</span>
                        <span class="font-medium hebrew-number">₪150-250</span>
                      </div>
                      <div class="flex justify-between">
                        <span>זריעת דשא (מ״ר)</span>
                        <span class="font-medium hebrew-number">₪25-35</span>
                      </div>
                      <div class="flex justify-between">
                        <span>השקיה בטפטוף (מ״ר)</span>
                        <span class="font-medium hebrew-number">₪18-28</span>
                      </div>
                      <div class="text-xs text-gray-500 mt-3">
                        * המחירים כוללים חומרים ועבודה
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-8 text-center">
                  <button class="btn-nature text-white px-8 py-4 rounded-xl font-bold text-lg">
                    <i class="fas fa-leaf ml-2"></i>
                    קבלת הצעת מחיר מותאמת
                  </button>
                </div>
              </div>
            </div>

            {/* Garden Subscription Content */}
            <div id="garden-subscription-content" class="service-content">
              <div class="glass-card-dark p-8 rounded-2xl">
                <h4 class="text-2xl font-bold hebrew-title mb-6 text-center text-gray-800">מנויי תחזוקת גינה קבועה</h4>
                <p class="text-center text-gray-600 mb-8">תחזוקה שוטפת לגינה יפה וירוקה לאורך כל השנה</p>
                
                <div class="grid md:grid-cols-2 gap-8">
                  <div class="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
                    <div class="text-center mb-4">
                      <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-leaf text-white text-2xl"></i>
                      </div>
                      <h5 class="text-xl font-bold text-green-600">מנוי בסיסי - גינה</h5>
                      <div class="text-3xl font-bold text-gray-800 mt-2">
                        <span class="hebrew-number">₪400</span>
                        <span class="text-lg text-gray-500">/חודש</span>
                      </div>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                      <h6 class="font-semibold text-gray-800 border-b border-gray-200 pb-1">השירות כולל:</h6>
                      <ul class="space-y-2 text-sm">
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>ביקור חודשי (כ-2 שעות)</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>גיזום שיחים וצמחי נוי</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>ניכוש עשבים שוטים</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>בדיקת מערכת השקיה</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>ייעוץ טלפוני</span>
                        </li>
                      </ul>
                      <div class="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                        מתאים לגינות עד 100 מ״ר
                      </div>
                    </div>
                    
                    <button class="w-full btn-nature text-white py-3 rounded-xl font-medium">
                      <i class="fas fa-seedling ml-2"></i>
                      בחירת מנוי בסיסי
                    </button>
                  </div>
                  
                  <div class="bg-white p-6 rounded-xl shadow-lg border-2 border-green-400 relative">
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                      הכי פופולרי
                    </div>
                    
                    <div class="text-center mb-4">
                      <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-crown text-yellow-300 text-2xl"></i>
                      </div>
                      <h5 class="text-xl font-bold text-green-600">מנוי מלא - גינה</h5>
                      <div class="text-3xl font-bold text-gray-800 mt-2">
                        <span class="hebrew-number">₪800</span>
                        <span class="text-lg text-gray-500">/חודש</span>
                      </div>
                      <div class="text-sm text-green-600 font-medium">חיסכון של 20% ביחס לשירות נקודתי</div>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                      <h6 class="font-semibold text-gray-800 border-b border-gray-200 pb-1">השירות כולל:</h6>
                      <ul class="space-y-2 text-sm">
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>ביקורים שבועיים (כ-4 שעות)</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>תחזוקת דשא מלאה</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>השקיה אוטומטית מותאמת</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>דישון וטיפוח צמחים</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>החלפת צמחים עונתית</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-check text-green-500"></i>
                          <span>טיפול מונע במזיקים</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="fas fa-crown text-yellow-500"></i>
                          <span>שירות חירום 24/7</span>
                        </li>
                      </ul>
                      <div class="text-xs text-gray-500 mt-2 p-2 bg-green-50 rounded">
                        מתאים לגינות עד 300 מ״ר | כולל חומרים ודשנים
                      </div>
                    </div>
                    
                    <button class="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">
                      <i class="fas fa-leaf ml-2"></i>
                      בחירה מומלצת - מנוי מלא
                    </button>
                  </div>
                </div>
                
                <div class="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl text-center">
                  <h6 class="font-bold text-lg mb-2">יתרונות המנוי</h6>
                  <div class="grid md:grid-cols-3 gap-4 text-sm">
                    <div class="flex items-center gap-2 justify-center">
                      <i class="fas fa-calendar-check text-green-500"></i>
                      <span>תזמון קבוע ואמין</span>
                    </div>
                    <div class="flex items-center gap-2 justify-center">
                      <i class="fas fa-percentage text-blue-500"></i>
                      <span>הנחות על שירותים נוספים</span>
                    </div>
                    <div class="flex items-center gap-2 justify-center">
                      <i class="fas fa-phone text-purple-500"></i>
                      <span>ייעוץ וחדקה ללא עלות</span>
                    </div>
                  </div>
                </div>
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

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

            {/* Premium Complete Plan - New */}
            <div class="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg relative overflow-hidden border-2 border-purple-300">
              <div class="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 text-sm font-bold">חדש!</div>
              
              {/* Premium badge */}
              <div class="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center transform rotate-12">
                <i class="fas fa-gem text-white text-lg"></i>
              </div>
              
              <div class="text-center">
                <h4 class="text-xl font-bold mb-2 hebrew-title">מנוי פרימיום מושלם</h4>
                <div class="text-sm opacity-90 mb-3">בריכה + גינה במנוי אחד</div>
                <div class="text-3xl font-bold mb-2">₪2500</div>
                <div class="text-sm opacity-90 mb-4">לחודש</div>
                <div class="text-xs bg-white/20 rounded-full px-2 py-1 mb-4">ביקור שבועי מקצועי</div>
                
                <ul class="text-right space-y-1 mb-4 text-sm">
                  <li class="flex items-center gap-2">
                    <i class="fas fa-swimming-pool text-cyan-300"></i>
                    <span>תחזוקת בריכה מלאה שבועית</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-leaf text-green-300"></i>
                    <span>תחזוקת גינה מקצועית שבועית</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-flask text-yellow-300"></i>
                    <span>כל הכימיקלים והדשנים</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-tools text-orange-300"></i>
                    <span>כל הציוד והאביזרים</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-seedling text-green-400"></i>
                    <span>החלפת צמחים עונתית</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-shield-alt text-blue-300"></i>
                    <span>אחריות מלאה על הציוד</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-phone text-pink-300"></i>
                    <span>שירות חירום 24/7</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-crown text-yellow-400"></i>
                    <span>יועץ אישי מוקצה</span>
                  </li>
                </ul>
                
                <div class="bg-white/10 rounded-lg p-2 mb-4">
                  <div class="text-xs">
                    <strong>חסכו ₪1,300 בחודש!</strong><br />
                    במקום ₪3,800 (₪1,000 בריכה + ₪800 גינה + ₪2,000 תוספות)
                  </div>
                </div>
                
                <button class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg w-full font-bold transition-all transform hover:scale-105 shadow-lg">
                  <i class="fas fa-gem ml-2"></i>
                  בחירת המנוי המושלם
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

      {/* Authentication Modals */}
      <div id="login-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 hebrew-title">התחברות למערכת</h2>
              <button class="modal-close text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form id="login-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">אימייל</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  placeholder="הכניסו את האימייל שלכם"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">סיסמה</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  placeholder="הכניסו את הסיסמה שלכם"
                  required
                />
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <a href="#" class="text-blue-600 hover:text-blue-800 forgot-password-trigger">שכחתי סיסמה</a>
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="rounded" />
                  <span class="text-gray-600">זכור אותי</span>
                </label>
              </div>
              
              <button
                type="submit"
                class="w-full btn-water text-white py-3 rounded-xl font-medium text-lg"
              >
                <i class="fas fa-sign-in-alt ml-2"></i>
                התחברות
              </button>
              
              <div class="text-center">
                <span class="text-gray-600">אין לכם חשבון? </span>
                <a href="#" class="text-blue-600 hover:text-blue-800 font-medium register-trigger">הרשמה כאן</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <div id="register-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 hebrew-title">הרשמה למערכת</h2>
              <button class="modal-close text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form id="register-form" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 text-right">שם פרטי</label>
                  <input
                    type="text"
                    id="register-first-name"
                    name="firstName"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                    placeholder="שם פרטי"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 text-right">שם משפחה</label>
                  <input
                    type="text"
                    id="register-last-name"
                    name="lastName"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                    placeholder="שם משפחה"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">אימייל</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  placeholder="הכניסו את האימייל שלכם"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">טלפון</label>
                <input
                  type="tel"
                  id="register-phone"
                  name="phone"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  placeholder="052-123-4567"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">סיסמה</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  placeholder="לפחות 6 תווים"
                  minlength="6"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">אימות סיסמה</label>
                <input
                  type="password"
                  id="register-confirm-password"
                  name="confirmPassword"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  placeholder="הכניסו שוב את הסיסמה"
                  required
                />
              </div>
              
              <div class="flex items-center gap-2">
                <input type="checkbox" id="register-terms" name="terms" required class="rounded" />
                <label for="register-terms" class="text-sm text-gray-600 text-right">
                  אני מסכים/ה ל<a href="#" class="text-blue-600 hover:text-blue-800">תנאי השימוש</a> ו<a href="#" class="text-blue-600 hover:text-blue-800">מדיניות הפרטיות</a>
                </label>
              </div>
              
              <button
                type="submit"
                class="w-full btn-water text-white py-3 rounded-xl font-medium text-lg"
              >
                <i class="fas fa-user-plus ml-2"></i>
                הרשמה למערכת
              </button>
              
              <div class="text-center">
                <span class="text-gray-600">יש לכם כבר חשבון? </span>
                <a href="#" class="text-blue-600 hover:text-blue-800 font-medium login-trigger">התחברות כאן</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <div id="forgot-password-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 hebrew-title">שחזור סיסמה</h2>
              <button class="modal-close text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-key text-white text-2xl"></i>
              </div>
              <p class="text-gray-600">הכניסו את כתובת האימייל שלכם ונשלח לכם קישור לשחזור הסיסמה</p>
            </div>
            
            <form id="forgot-password-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">אימייל</label>
                <input
                  type="email"
                  id="forgot-password-email"
                  name="email"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  placeholder="הכניסו את האימייל שלכם"
                  required
                />
              </div>
              
              <button
                type="submit"
                class="w-full btn-water text-white py-3 rounded-xl font-medium text-lg"
              >
                <i class="fas fa-paper-plane ml-2"></i>
                שליחת קישור שחזור
              </button>
              
              <div class="text-center">
                <a href="#" class="text-blue-600 hover:text-blue-800 login-trigger">חזרה להתחברות</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* JavaScript for interactions */}
      <script src="/static/app.js"></script>
      <script src="/static/auth.js"></script>
    </div>
  )
}

// Routes
app.get('/', (c) => {
  return c.render(<App />)
})

// API Routes for backend functionality
app.get('/api/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Authentication API Routes
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, firstName, lastName, phone } = await c.req.json()
    
    // Validation
    if (!email || !password || !firstName || !lastName || !phone) {
      return c.json({ error: 'All fields are required' }, 400)
    }
    
    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400)
    }
    
    // TODO: Implement actual Supabase registration
    // For now, return mock success response
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      full_name: `${firstName} ${lastName}`,
      phone,
      created_at: new Date().toISOString()
    }
    
    return c.json({
      success: true,
      message: 'User registered successfully',
      user: mockUser
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    // Validation
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    // TODO: Implement actual Supabase authentication
    // For now, return mock success response
    const mockUser = {
      id: 'user_12345',
      email,
      full_name: 'משתמש לדוגמה',
      phone: '052-123-4567'
    }
    
    return c.json({
      success: true,
      message: 'Login successful',
      user: mockUser,
      session_token: 'mock_session_token_' + Date.now()
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post('/api/auth/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json()
    
    // Validation
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    // TODO: Implement actual Supabase password reset
    // For now, return mock success response
    return c.json({
      success: true,
      message: 'Password reset email sent successfully'
    })
    
  } catch (error) {
    console.error('Password reset error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post('/api/auth/logout', async (c) => {
  try {
    // TODO: Implement actual Supabase logout
    return c.json({
      success: true,
      message: 'Logout successful'
    })
    
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// User Profile API Routes
app.get('/api/user/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401)
    }
    
    // TODO: Verify session token with Supabase
    // For now, return mock user profile
    const mockProfile = {
      id: 'user_12345',
      email: 'user@example.com',
      full_name: 'משתמש לדוגמה',
      phone: '052-123-4567',
      address: 'רחוב הדוגמה 123, תל אביב',
      subscription_plan: 'monthly',
      subscription_status: 'active',
      properties: [
        {
          id: 'prop_1',
          name: 'בית ראשי',
          address: 'רחוב הדוגמה 123, תל אביב',
          pool_size: '8x4 מטר',
          garden_size: '150 מ״ר'
        }
      ],
      upcoming_appointments: [
        {
          id: 'app_1',
          service_type: 'pool_maintenance',
          scheduled_date: '2024-10-01T10:00:00Z',
          technician_name: 'דוד הטכנאי'
        }
      ]
    }
    
    return c.json({
      success: true,
      profile: mockProfile
    })
    
  } catch (error) {
    console.error('Profile fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.put('/api/user/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401)
    }
    
    const { full_name, phone, address } = await c.req.json()
    
    // Validation
    if (!full_name || !phone) {
      return c.json({ error: 'Name and phone are required' }, 400)
    }
    
    // TODO: Update user profile in Supabase
    // For now, return mock success response
    return c.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: 'user_12345',
        email: 'user@example.com',
        full_name,
        phone,
        address: address || '',
        updated_at: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/api/user/appointments', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401)
    }
    
    // TODO: Fetch user appointments from Supabase
    // For now, return mock appointments
    const mockAppointments = [
      {
        id: 'app_1',
        service_type: 'pool_maintenance',
        service_name: 'תחזוקת בריכה שוטפת',
        scheduled_date: '2024-10-01T10:00:00Z',
        status: 'confirmed',
        technician_name: 'דוד הטכנאי',
        technician_phone: '052-111-2222'
      },
      {
        id: 'app_2',
        service_type: 'garden_maintenance',
        service_name: 'גיזום וטיפוח גינה',
        scheduled_date: '2024-10-03T14:00:00Z',
        status: 'pending',
        technician_name: 'שרה הגננת',
        technician_phone: '052-333-4444'
      }
    ]
    
    return c.json({
      success: true,
      appointments: mockAppointments
    })
    
  } catch (error) {
    console.error('Appointments fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/api/user/subscriptions', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401)
    }
    
    // TODO: Fetch user subscriptions from Supabase
    // For now, return mock subscriptions
    const mockSubscriptions = [
      {
        id: 'sub_1',
        plan_name: 'מנוי חודשי',
        plan_type: 'monthly',
        price: 1000,
        status: 'active',
        next_billing_date: '2024-10-15T00:00:00Z',
        services: ['pool_maintenance'],
        visits_per_month: 4
      }
    ]
    
    return c.json({
      success: true,
      subscriptions: mockSubscriptions
    })
    
  } catch (error) {
    console.error('Subscriptions fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
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
      { id: 'vip', name: 'מנוי VIP', price: 15000, visits: 'weekly', period: 'year', premium: true },
      { 
        id: 'premium-complete', 
        name: 'מנוי פרימיום מושלם', 
        price: 2500, 
        visits: 'weekly', 
        period: 'month', 
        services: ['pool', 'garden'],
        features: [
          'תחזוקת בריכה מלאה שבועית',
          'תחזוקת גינה מקצועית שבועית', 
          'כל הכימיקלים והדשנים',
          'כל הציוד והאביזרים',
          'החלפת צמחים עונתית',
          'אחריות מלאה על הציוד',
          'שירות חירום 24/7',
          'יועץ אישי מוקצה'
        ],
        savings: 1300,
        new: true
      }
    ]
  })
})

export default app
