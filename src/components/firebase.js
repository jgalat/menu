import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import uniqid from 'uniqid';
import assert from 'assert';

const MENU_COLLECTION = 'menu';
const USER_COLLECTION = 'user';

const config = process.env.REACT_APP_FIREBASE_CONFIG;

class Firebase {
  constructor() {
    assert(config, 'Firebase configuration required');
    app.initializeApp(JSON.parse(config));
    this.auth = app.auth();
    this.db = app.firestore();
    this.provider = new app.auth.GoogleAuthProvider();
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    })
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async login() {
    const { user } = await this.auth.signInWithPopup(this.provider);
    await this.db.collection(USER_COLLECTION).doc(user.uid).set({
      userId: user.uid,
      displayName: user.displayName,
    }, { merge: true });
    return user;
  }

  logout() {
    return this.auth.signOut();
  }

  retrieveAllUsers(callback) {
    this.db.collection(USER_COLLECTION).get().then(result => {
      callback(result.docs.map(doc => doc.data()));
    });
  }

  async createNewOrder(menu) {
    if (!this.getCurrentUser()) {
      return null;
    }

    const uid = uniqid();
    const requests = {};
    await this.db.collection(MENU_COLLECTION).doc(uid).set({
      menu,
      requests,
    });

    return uid;
  }

  getStore(menuId, callback) {
    this.db.collection(MENU_COLLECTION).doc(menuId).get().then(result => {
        callback(result.data());
    });
  }

  subscribeToSnapshot(menuId, callback) {
    /* it returns the unsubscribe function */
    return this.db.collection(MENU_COLLECTION).doc(menuId).onSnapshot(snapshot => {
      callback(snapshot.data());
    });
  }

  submitRequest(menuId, request) {
    if (!this.getCurrentUser()) {
      return null;
    }

    const userId = this.getCurrentUser().uid;

    return this.db.collection(MENU_COLLECTION).doc(menuId).set({
      requests: {
        [userId]: request,
      },
    }, { merge: true });
  }
}

export default new Firebase();
