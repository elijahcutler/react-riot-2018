const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp(functions.config().firebase);

const validateFirebaseIdToken = (req, res, next) => {
  cors(req, res, () => {
    if (req.headers.authorization) {
      try {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        admin.auth().verifyIdToken(idToken).then(decodedUser => {
          req.user = decodedUser;
          next();
        }).catch(err => {
          res.status(403).send();
        });
      } catch (error) {
        console.error(error);
        res.status(401).send();
      }
    } else {
      res.status(403).send();
    }
  });
};

exports.getTimeline = functions.https.onRequest((req, res) => {
  validateFirebaseIdToken(req, res, () => {
    firebase.database.ref(`users/${req.user.uid}/following`).once('value', snapshot => {
      let following = [];
      let events = [];
      let promises = [];
      if (snapshot.numChildren() > 0) {
        snapshot.forEach(childSnapshot => {
          let uid = childSnapshot.val();
          following.push(uid);
        });
        following.forEach(uid => {
          promises.push(new Promise((resolve, reject) => {
            admin.auth().getUser(uid).then(userRecord => {
              firebase.database.ref('events').orderByChild('user').startAt(uid).endAt(uid).startAt(0).limitToFirst(5).then('value', snapshot => {
                events.push({
                  body: snapshot.child('body').val(),
                  time: snapshot.child('time').val(),
                  title: snapshot.child('title').val(),
                  uid: userRecord.uid,
                  username: userRecord.displayName,
                  photoURL: userRecord.photoURL
                });
                resolve();
              });
            }).catch(error => {
              console.error(`Error fetching user profile for ${uid}:`, error);
              resolve();
            });
          }));
        });
        Promise.all(promises, () => {
          let sortedEvents = events.sort((a, b) => a.time - b.time);
          res.status(200).json(sortedEvents);
        });
      } else {
        res.status(204).send();
      }
    });
  });
});
