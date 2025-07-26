import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources for medical professionals
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      dashboard: 'Dashboard',
      diagnosis: 'Differential Diagnosis',
      research: 'Medical Research',
      protocols: 'Protocols & Guidelines',
      patients: 'Patient Management',
      analytics: 'Analytics',
      profile: 'Profile',
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
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      
      // Home page
      heroTitle: 'Clinical AI Assistant',
      heroSubtitle: 'Real-time clinical intelligence for every practitioner. Advanced AI-powered tools for differential diagnosis, medical research, and clinical decision support.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      
      // Features
      features: 'Features',
      aiDiagnosis: 'AI-Powered Diagnosis',
      aiDiagnosisDesc: 'Advanced differential diagnosis with confidence scoring and evidence-based recommendations',
      medicalResearch: 'Medical Research',
      medicalResearchDesc: 'Access to 22+ million medical articles and latest research findings',
      clinicalProtocols: 'Clinical Protocols',
      clinicalProtocolsDesc: 'Comprehensive medical protocols, guidelines, and standard operating procedures',
      patientManagement: 'Patient Management',
      patientManagementDesc: 'Secure patient data management with AI-powered insights',
      
      // Authentication
      emailAddress: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      specialization: 'Medical Specialization',
      licenseNumber: 'Medical License Number',
      hospital: 'Hospital/Clinic',
      experience: 'Years of Experience',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signIn: 'Sign In',
      signUp: 'Sign Up',
      
      // Dashboard
      dashboardWelcome: 'Welcome to your clinical dashboard',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      startDiagnosis: 'Start Differential Diagnosis',
      searchResearch: 'Search Medical Research',
      viewProtocols: 'View Protocols',
      managePatients: 'Manage Patients',
      
      // Diagnosis
      differentialDiagnosis: 'Differential Diagnosis',
      enterCaseDetails: 'Enter case details',
      patientPresentation: 'Patient Presentation',
      clinicalFindings: 'Clinical Findings',
      diagnosticTests: 'Diagnostic Tests',
      generateDiagnosis: 'Generate Differential Diagnosis',
      confidence: 'Confidence',
      recommendations: 'Recommendations',
      icdCodes: 'ICD-10 Codes',
      
      // Research
      medicalResearchTitle: 'Medical Research',
      searchQuery: 'Search medical literature',
      recentFindings: 'Recent Findings',
      evidenceLevel: 'Evidence Level',
      publicationDate: 'Publication Date',
      authors: 'Authors',
      abstract: 'Abstract',
      
      // Protocols
      protocolsTitle: 'Medical Protocols & Guidelines',
      searchProtocols: 'Search protocols',
      category: 'Category',
      specialty: 'Specialty',
      lastUpdated: 'Last Updated',
      downloadProtocol: 'Download Protocol',
      
      // Patients
      patientManagementTitle: 'Patient Management',
      addPatient: 'Add Patient',
      patientId: 'Patient ID',
      patientName: 'Patient Name',
      age: 'Age',
      gender: 'Gender',
      lastVisit: 'Last Visit',
      condition: 'Condition',
      status: 'Status',
      
      // Analytics
      analyticsTitle: 'Clinical Analytics',
      diagnosticAccuracy: 'Diagnostic Accuracy',
      caseVolume: 'Case Volume',
      researchActivity: 'Research Activity',
      protocolUsage: 'Protocol Usage',
      
      // Profile
      personalInfo: 'Personal Information',
      professionalInfo: 'Professional Information',
      preferences: 'Preferences',
      certifications: 'Certifications',
      
      // Footer
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      copyright: '© 2024 My-AssisstAi. All rights reserved.',
      
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
      diagnosisGenerated: 'Differential diagnosis generated successfully!',
    }
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      dashboard: 'لوحة التحكم',
      diagnosis: 'التشخيص التفريقي',
      research: 'البحث الطبي',
      protocols: 'البروتوكولات والإرشادات',
      patients: 'إدارة المرضى',
      analytics: 'التحليلات',
      profile: 'الملف الشخصي',
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
      search: 'بحث',
      filter: 'تصفية',
      export: 'تصدير',
      
      // Home page
      heroTitle: 'المساعد الذكي السريري',
      heroSubtitle: 'ذكاء سريري في الوقت الفعلي لكل ممارس. أدوات متقدمة مدعومة بالذكاء الاصطناعي للتشخيص التفريقي والبحث الطبي ودعم القرار السريري.',
      getStarted: 'ابدأ الآن',
      learnMore: 'اعرف المزيد',
      
      // Features
      features: 'المميزات',
      aiDiagnosis: 'تشخيص مدعوم بالذكاء الاصطناعي',
      aiDiagnosisDesc: 'تشخيص تفريقي متقدم مع تقييم الثقة والتوصيات المبنية على الأدلة',
      medicalResearch: 'البحث الطبي',
      medicalResearchDesc: 'الوصول إلى أكثر من 22 مليون مقال طبي وأحدث النتائج البحثية',
      clinicalProtocols: 'البروتوكولات السريرية',
      clinicalProtocolsDesc: 'بروتوكولات طبية شاملة وإرشادات وإجراءات تشغيل معيارية',
      patientManagement: 'إدارة المرضى',
      patientManagementDesc: 'إدارة آمنة لبيانات المرضى مع رؤى مدعومة بالذكاء الاصطناعي',
      
      // Authentication
      emailAddress: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      specialization: 'التخصص الطبي',
      licenseNumber: 'رقم الترخيص الطبي',
      hospital: 'المستشفى/العيادة',
      experience: 'سنوات الخبرة',
      createAccount: 'إنشاء حساب',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      dontHaveAccount: 'ليس لديك حساب؟',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      
      // Dashboard
      dashboardWelcome: 'مرحباً بك في لوحة التحكم السريرية',
      recentActivity: 'النشاط الأخير',
      quickActions: 'إجراءات سريعة',
      startDiagnosis: 'بدء التشخيص التفريقي',
      searchResearch: 'البحث في الأدبيات الطبية',
      viewProtocols: 'عرض البروتوكولات',
      managePatients: 'إدارة المرضى',
      
      // Diagnosis
      differentialDiagnosis: 'التشخيص التفريقي',
      enterCaseDetails: 'أدخل تفاصيل الحالة',
      patientPresentation: 'عرض المريض',
      clinicalFindings: 'النتائج السريرية',
      diagnosticTests: 'الفحوصات التشخيصية',
      generateDiagnosis: 'إنتاج التشخيص التفريقي',
      confidence: 'مستوى الثقة',
      recommendations: 'التوصيات',
      icdCodes: 'أكواد ICD-10',
      
      // Research
      medicalResearchTitle: 'البحث الطبي',
      searchQuery: 'البحث في الأدبيات الطبية',
      recentFindings: 'النتائج الحديثة',
      evidenceLevel: 'مستوى الأدلة',
      publicationDate: 'تاريخ النشر',
      authors: 'المؤلفون',
      abstract: 'الملخص',
      
      // Protocols
      protocolsTitle: 'البروتوكولات والإرشادات الطبية',
      searchProtocols: 'البحث في البروتوكولات',
      category: 'الفئة',
      specialty: 'التخصص',
      lastUpdated: 'آخر تحديث',
      downloadProtocol: 'تحميل البروتوكول',
      
      // Patients
      patientManagementTitle: 'إدارة المرضى',
      addPatient: 'إضافة مريض',
      patientId: 'رقم المريض',
      patientName: 'اسم المريض',
      age: 'العمر',
      gender: 'الجنس',
      lastVisit: 'آخر زيارة',
      condition: 'الحالة',
      status: 'الحالة',
      
      // Analytics
      analyticsTitle: 'التحليلات السريرية',
      diagnosticAccuracy: 'دقة التشخيص',
      caseVolume: 'حجم الحالات',
      researchActivity: 'النشاط البحثي',
      protocolUsage: 'استخدام البروتوكولات',
      
      // Profile
      personalInfo: 'المعلومات الشخصية',
      professionalInfo: 'المعلومات المهنية',
      preferences: 'التفضيلات',
      certifications: 'الشهادات',
      
      // Footer
      aboutUs: 'من نحن',
      contactUs: 'اتصل بنا',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
      copyright: '© 2024 My-AssisstAi. جميع الحقوق محفوظة.',
      
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
      diagnosisGenerated: 'تم إنتاج التشخيص التفريقي بنجاح!',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language (English for medical professionals)
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

