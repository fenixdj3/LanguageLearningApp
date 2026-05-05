const env = {
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,

  sqliteDbName: process.env.EXPO_PUBLIC_SQLITE_DB_NAME || "LanguageLearning2.db",

  speakingIconUrl:
    process.env.EXPO_PUBLIC_SPEAKING_ICON_URL ||
    "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fspeaking.png?alt=media&token=dfadd67e-3a0e-44b8-bbfd-77baea6a1f4a",
  addCategoryIconUrl:
    process.env.EXPO_PUBLIC_ADD_CATEGORY_ICON_URL ||
    "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Faddcategory.png?alt=media&token=6b585a46-2e00-456c-ab5f-22b2b1ed7eab",
  updateIconUrl:
    process.env.EXPO_PUBLIC_UPDATE_ICON_URL ||
    "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fupdate.png?alt=media&token=cb26e5d1-5ecc-43d6-aa0b-61557779c451",
  crossIconUrl:
    process.env.EXPO_PUBLIC_CROSS_ICON_URL ||
    "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fcross.png?alt=media&token=f77a920e-ad2f-45bc-b59d-5000f7138474",
  trashIconUrl:
    process.env.EXPO_PUBLIC_TRASH_ICON_URL ||
    "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Ftrashcan.png?alt=media&token=290f2e15-e7fd-4ece-9872-53b4177418dd",
  playIconUrl:
    process.env.EXPO_PUBLIC_PLAY_ICON_URL ||
    "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fplay.png?alt=media&token=86dc396c-4d2f-4164-af41-e58be028ce05",
  categoryIconBaseUrl:
    process.env.EXPO_PUBLIC_CATEGORY_ICON_BASE_URL ||
    "https://storage.googleapis.com/languagelearningexpoapp.appspot.com/categoryIcon",
};

export default env;
