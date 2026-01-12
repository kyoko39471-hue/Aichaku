import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAD3y3HNjlsSO7xykkqLWqofxU5U_6hW_Y",
  authDomain: "aichaku-924d0.firebaseapp.com",
  projectId: "aichaku-924d0",
  storageBucket: "aichaku-924d0.firebasestorage.app",
  messagingSenderId: "745993610184",
  appId: "1:745993610184:web:97ea4b13fef74d43d396fd"
};

// 1. 必须先初始化 App
const app = initializeApp(firebaseConfig);

// 2. 初始化 Auth
export const auth = getAuth(app);

// 3. 初始化 Firestore 并开启“现代版”离线持久化
// 这种写法会自动处理多标签页同步，且不会被划掉
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
