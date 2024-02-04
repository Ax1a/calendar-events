import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCV1Bm8cjyr44is2vWu8yK_0iM53V0SbsU',
  authDomain: 'calendar-events-dfd69.firebaseapp.com',
  projectId: 'calendar-events-dfd69',
  storageBucket: 'calendar-events-dfd69.appspot.com',
  messagingSenderId: '857952515709',
  appId: '1:857952515709:web:29dd0a275d271457236314',
  measurementId: 'G-4Y2T42J0DD',
  databaseURL: "https://calendar-events-dfd69-default-rtdb.asia-southeast1.firebasedatabase.app",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const database = getDatabase(app)

