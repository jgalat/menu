import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import uniqid from 'uniqid';
import assert from 'assert';

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
    return await this.auth.signInWithPopup(this.provider);
  }

  logout() {
    return this.auth.signOut();
  }

  async createNewOrder(menu) {
    if (!this.getCurrentUser()) {
      return null;
    }

    const uid = uniqid();
    const requests = {};
    await this.db.collection('menu').doc(uid).set({
      menu,
      requests,
    });

    return uid;
  }

  getStore(uid, callback) {
    this.db.collection('menu').doc(uid).get().then(result => {
        callback(result.data());
    });
  }

  subscribeToSnapshot(uid, callback) {
    /* it returns the unsubscribe function */
    return this.db.collection('menu').doc(uid).onSnapshot(snapshot => {
      callback(snapshot.data());
    });
  }

  submitRequest(uid, request) {
    if (!this.getCurrentUser()) {
      return null;
    }

    const userId = this.getCurrentUser().uid;

    return this.db.collection('menu').doc(uid).set({
      requests: {
        [userId]: request,
      },
    }, { merge: true });
  }
}

export default new Firebase();
