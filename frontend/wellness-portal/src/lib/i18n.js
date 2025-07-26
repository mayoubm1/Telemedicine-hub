import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      dashboard: 'Dashboard',
      chat: 'AI Chat',
      records: 'Medical Records',
      profile: 'Profile',
      symptomChecker: 'Symptom Checker',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      
      // Common
      welcome: 'Welcome',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      
      // Home page
      heroTitle: 'Your AI-Powered Wellness Assistant',
      heroSubtitle: 'Get personalized, reliable health advice anytime, anywhere. Designed for rural Egypt and underserved communities.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      
      // Features
      features: 'Features',
      aiPowered: 'AI-Powered',
      aiPoweredDesc: 'Advanced AI trained on medical knowledge to provide accurate health guidance',
      available247: '24/7 Available',
      available247Desc: 'Access health advice anytime, anywhere, even in remote areas',
      securePrivate: 'Secure & Private',
      securePrivateDesc: 'Your health data is protected with enterprise-grade security',
      multiLanguage: 'Arabic & English',
      multiLanguageDesc: 'Full support for both Arabic and English languages',
      
      // Authentication
      emailAddress: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signIn: 'Sign In',
      signUp: 'Sign Up',
      
      // Dashboard
      dashboardWelcome: 'Welcome to your wellness dashboard',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      startChat: 'Start AI Chat',
      checkSymptoms: 'Check Symptoms',
      viewRecords: 'View Records',
      updateProfile: 'Update Profile',
      
      // Chat
      chatWithAI: 'Chat with AI Assistant',
      typeMessage: 'Type your message...',
      send: 'Send',
      aiThinking: 'AI is thinking...',
      
      // Medical Records
      medicalRecords: 'Medical Records',
      addRecord: 'Add Record',
      recordType: 'Record Type',
      consultation: 'Consultation',
      labResult: 'Lab Result',
      prescription: 'Prescription',
      diagnosis: 'Diagnosis',
      symptoms: 'Symptoms',
      treatment: 'Treatment',
      medications: 'Medications',
      
      // Symptom Checker
      symptomCheckerTitle: 'Symptom Checker',
      describeSymptoms: 'Describe your symptoms',
      analyzeSymptoms: 'Analyze Symptoms',
      urgencyLevel: 'Urgency Level',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      emergency: 'Emergency',
      recommendations: 'Recommendations',
      
      // Profile
      personalInfo: 'Personal Information',
      medicalInfo: 'Medical Information',
      preferences: 'Preferences',
      allergies: 'Allergies',
      chronicConditions: 'Chronic Conditions',
      currentMedications: 'Current Medications',
      emergencyContact: 'Emergency Contact',
      
      // Footer
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      copyright: '© 2024 My-wellnessAi. All rights reserved.',
      
      // Error messages
      invalidEmail: 'Please enter a valid email address',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordsNotMatch: 'Passwords do not match',
      requiredField: 'This field is required',
      loginFailed: 'Login failed. Please check your credentials.',
      registrationFailed: 'Registration failed. Please try again.',
      
      // Success messages
      loginSuccess: 'Login successful!',
      registrationSuccess: 'Registration successful!',
      profileUpdated: 'Profile updated successfully!',
      recordAdded: 'Medical record added successfully!',
    }
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      dashboard: 'لوحة التحكم',
      chat: 'محادثة الذكي الاصطناعي',
      records: 'السجلات الطبية',
      profile: 'الملف الشخصي',
      symptomChecker: 'فحص الأعراض',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
      
      // Common
      welcome: 'مرحباً',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      cancel: 'إلغاء',
      save: 'حفظ',
      submit: 'إرسال',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      
      // Home page
      heroTitle: 'مساعدك الصحي المدعوم بالذكاء الاصطناعي',
      heroSubtitle: 'احصل على نصائح صحية موثوقة ومخصصة في أي وقت وأي مكان. مصمم للمناطق الريفية في مصر والمجتمعات المحرومة.',
      getStarted: 'ابدأ الآن',
      learnMore: 'اعرف المزيد',
      
      // Features
      features: 'المميزات',
      aiPowered: 'مدعوم بالذكاء الاصطناعي',
      aiPoweredDesc: 'ذكاء اصطناعي متقدم مدرب على المعرفة الطبية لتقديم إرشادات صحية دقيقة',
      available247: 'متاح 24/7',
      available247Desc: 'احصل على المشورة الصحية في أي وقت وأي مكان، حتى في المناطق النائية',
      securePrivate: 'آمن وخاص',
      securePrivateDesc: 'بياناتك الصحية محمية بأمان على مستوى المؤسسات',
      multiLanguage: 'العربية والإنجليزية',
      multiLanguageDesc: 'دعم كامل للغتين العربية والإنجليزية',
      
      // Authentication
      emailAddress: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      phoneNumber: 'رقم الهاتف',
      dateOfBirth: 'تاريخ الميلاد',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      other: 'آخر',
      createAccount: 'إنشاء حساب',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      dontHaveAccount: 'ليس لديك حساب؟',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      
      // Dashboard
      dashboardWelcome: 'مرحباً بك في لوحة تحكم الصحة',
      recentActivity: 'النشاط الأخير',
      quickActions: 'إجراءات سريعة',
      startChat: 'بدء محادثة الذكي الاصطناعي',
      checkSymptoms: 'فحص الأعراض',
      viewRecords: 'عرض السجلات',
      updateProfile: 'تحديث الملف الشخصي',
      
      // Chat
      chatWithAI: 'محادثة مع المساعد الذكي',
      typeMessage: 'اكتب رسالتك...',
      send: 'إرسال',
      aiThinking: 'الذكي الاصطناعي يفكر...',
      
      // Medical Records
      medicalRecords: 'السجلات الطبية',
      addRecord: 'إضافة سجل',
      recordType: 'نوع السجل',
      consultation: 'استشارة',
      labResult: 'نتيجة مختبر',
      prescription: 'وصفة طبية',
      diagnosis: 'تشخيص',
      symptoms: 'الأعراض',
      treatment: 'العلاج',
      medications: 'الأدوية',
      
      // Symptom Checker
      symptomCheckerTitle: 'فحص الأعراض',
      describeSymptoms: 'صف أعراضك',
      analyzeSymptoms: 'تحليل الأعراض',
      urgencyLevel: 'مستوى الإلحاح',
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      emergency: 'طارئ',
      recommendations: 'التوصيات',
      
      // Profile
      personalInfo: 'المعلومات الشخصية',
      medicalInfo: 'المعلومات الطبية',
      preferences: 'التفضيلات',
      allergies: 'الحساسية',
      chronicConditions: 'الحالات المزمنة',
      currentMedications: 'الأدوية الحالية',
      emergencyContact: 'جهة الاتصال في حالات الطوارئ',
      
      // Footer
      aboutUs: 'من نحن',
      contactUs: 'اتصل بنا',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
      copyright: '© 2024 My-wellnessAi. جميع الحقوق محفوظة.',
      
      // Error messages
      invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      passwordsNotMatch: 'كلمات المرور غير متطابقة',
      requiredField: 'هذا الحقل مطلوب',
      loginFailed: 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.',
      registrationFailed: 'فشل التسجيل. يرجى المحاولة مرة أخرى.',
      
      // Success messages
      loginSuccess: 'تم تسجيل الدخول بنجاح!',
      registrationSuccess: 'تم التسجيل بنجاح!',
      profileUpdated: 'تم تحديث الملف الشخصي بنجاح!',
      recordAdded: 'تم إضافة السجل الطبي بنجاح!',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Default language (Arabic for Egypt)
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  })

export default i18n

