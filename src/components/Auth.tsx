// Authentication Components for Water & Nature Pool Management System
// Hebrew RTL Login, Register, and Password Recovery

import { supabase, AuthService } from '../lib/supabase'

export function LoginForm() {
  return (
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" id="login-modal">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 water-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-user text-white text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold hebrew-title text-gray-800">התחברות</h3>
          <p class="text-gray-600 mt-2">התחברו לחשבון שלכם</p>
        </div>

        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input 
              type="email" 
              name="email"
              required 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="הכניסו את כתובת האימייל"
              dir="ltr"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">סיסמה</label>
            <input 
              type="password" 
              name="password"
              required 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="הכניסו את הסיסמה"
              dir="ltr"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="rounded border-gray-300" />
              <span>זכור אותי</span>
            </label>
            <button type="button" id="forgot-password-btn" class="text-blue-600 hover:text-blue-800">
              שכחת סיסמה?
            </button>
          </div>

          <button type="submit" class="w-full btn-water text-white py-3 rounded-xl font-bold text-lg">
            <i class="fas fa-sign-in-alt ml-2"></i>
            התחבר
          </button>

          <div class="text-center pt-4 border-t border-gray-200">
            <p class="text-gray-600">
              עדיין אין לכם חשבון? 
              <button type="button" id="show-register-btn" class="text-blue-600 hover:text-blue-800 font-medium mr-1">
                הרשמה
              </button>
            </p>
          </div>
        </form>

        <button class="absolute top-4 left-4 text-gray-400 hover:text-gray-600" onclick="closeAuthModal()">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  )
}

export function RegisterForm() {
  return (
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" id="register-modal">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 nature-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold hebrew-title text-gray-800">הרשמה</h3>
          <p class="text-gray-600 mt-2">צרו חשבון חדש</p>
        </div>

        <form id="register-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
            <input 
              type="text" 
              name="fullName"
              required 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="הכניסו את השם המלא"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
            <input 
              type="tel" 
              name="phone"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="052-123-4567"
              dir="ltr"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">אימייל *</label>
            <input 
              type="email" 
              name="email"
              required 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">סיסמה *</label>
            <input 
              type="password" 
              name="password"
              required 
              minlength="6"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="לפחות 6 תווים"
              dir="ltr"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">אימות סיסמה *</label>
            <input 
              type="password" 
              name="confirmPassword"
              required 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="הכניסו את הסיסמה שוב"
              dir="ltr"
            />
          </div>

          <div class="flex items-start gap-3">
            <input type="checkbox" name="terms" required class="mt-1 rounded border-gray-300" />
            <label class="text-sm text-gray-600">
              אני מסכים/ה ל
              <a href="#" class="text-blue-600 hover:text-blue-800">תנאי השימוש</a>
              ול
              <a href="#" class="text-blue-600 hover:text-blue-800">מדיניות הפרטיות</a>
            </label>
          </div>

          <button type="submit" class="w-full btn-nature text-white py-3 rounded-xl font-bold text-lg">
            <i class="fas fa-user-plus ml-2"></i>
            הרשמה
          </button>

          <div class="text-center pt-4 border-t border-gray-200">
            <p class="text-gray-600">
              כבר יש לכם חשבון? 
              <button type="button" id="show-login-btn" class="text-blue-600 hover:text-blue-800 font-medium mr-1">
                התחברות
              </button>
            </p>
          </div>
        </form>

        <button class="absolute top-4 left-4 text-gray-400 hover:text-gray-600" onclick="closeAuthModal()">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  )
}

export function ForgotPasswordForm() {
  return (
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" id="forgot-password-modal">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-key text-white text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold hebrew-title text-gray-800">איפוס סיסמה</h3>
          <p class="text-gray-600 mt-2">הכניסו את כתובת האימייל לאיפוס הסיסמה</p>
        </div>

        <form id="forgot-password-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input 
              type="email" 
              name="email"
              required 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
              placeholder="הכניסו את כתובת האימייל"
              dir="ltr"
            />
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex gap-3">
              <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
              <div class="text-sm text-blue-800">
                נשלח לכם קישור לאיפוס סיסמה לכתובת האימייל. אנא בדקו גם בתיקיית הספאם.
              </div>
            </div>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl font-bold text-lg">
            <i class="fas fa-paper-plane ml-2"></i>
            שלח קישור לאיפוס
          </button>

          <div class="text-center pt-4 border-t border-gray-200">
            <button type="button" id="back-to-login-btn" class="text-blue-600 hover:text-blue-800 font-medium">
              <i class="fas fa-arrow-right ml-1"></i>
              חזרה להתחברות
            </button>
          </div>
        </form>

        <button class="absolute top-4 left-4 text-gray-400 hover:text-gray-600" onclick="closeAuthModal()">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  )
}

export function UserMenu() {
  return (
    <div class="relative" id="user-menu">
      <button class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors" id="user-menu-button">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <i class="fas fa-user text-white text-sm"></i>
        </div>
        <span class="font-medium text-gray-800 hidden md:block" id="user-name">שם המשתמש</span>
        <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
      </button>

      <div class="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 hidden" id="user-menu-dropdown">
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
          <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <i class="fas fa-cog text-gray-500"></i>
            <span>הגדרות</span>
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
  )
}