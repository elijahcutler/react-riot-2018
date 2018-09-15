const cors = require('cors')();
const functions = require('firebase-functions');
const admin = require('firbase-admin');

admin.initializeApp(firebase.config().firebase);

const validateFirebaseIdToken = (req, res, next) => {
  cors(req, res, () => {
    if (req.headers.authorization) {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      admin.auth().verifyIdToken(idToken).then(decodedUser => {
        req.user = decodedUser;
        next();
      }).catch(err => {
        res.status(403).send('Unauthorized');
      });
    } else {
      res.status(403).send('Unauthorized');
    }
  });
};

exports.getTimeline = functions.https.onRequest((req, res) => {
  validateFirebaseIdToken((req, res) => {
    firebase.database.ref(`users/${req.user.uid}/following`).once('value', snapshot => {
      let following = [];
      let events = [];
      let promises = [];
      snapshot.forEach(childSnapshot => {
        let uid = childSnapshot.val();
        following.push(uid);
      });
      following.forEach(uid => {
        promises.push(new Promise((resolve, reject) => {
          firebase.database.ref('events').orderByChild('user').startAt(uid).endAt(uid).startAt(0).limitToFirst(5).then('value', snapshot => {
            resolve();
          });
        }));
      });
    });
  });
});
