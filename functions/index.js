const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gittogether-6f7ce.firebaseio.com'
});

const validateFirebaseIdToken = (req, res, next) => {
  cors(req, res, () => {
    if (req.headers.authorization) {
      try {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        admin.auth().verifyIdToken(idToken).then(decodedUser => {
          req.user = decodedUser;
          return next();
        }).catch(error => {
          console.error(error);
          return res.status(403).send();
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
    admin.database().ref(`users/${req.user.uid}/following`).once('value', snapshot => {
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
              return admin.database().ref('events').orderByChild('user').startAt(uid).endAt(uid).startAt(0).limitToFirst(5).then('value', snapshot => {
                events.push({
                  body: snapshot.child('body').val(),
                  time: snapshot.child('time').val(),
                  title: snapshot.child('title').val(),
                  uid: userRecord.uid,
                  username: userRecord.displayName,
                  photoURL: userRecord.photoURL
                });
                return resolve();
              });
            }).catch(error => {
              console.error(`Error fetching user profile for ${uid}:`, error);
              return resolve();
            });
          }));
        });
        return Promise.all(promises, () => {
          let sortedEvents = events.sort((a, b) => a.time - b.time);
          return res.status(200).json(sortedEvents);
        });
      } else {
        res.status(204).send();
      }
    });
  });
});

exports.getProfile = functions.https.onRequest((req, res) => {
  if (req.query.uid) {
    admin.auth().getUser(req.query.uid).then(userRecord => {
      return res.status(200).json({
        uid: userRecord.uid,
        displayName: userRecord.displayName,
        email: userRecord.email,
        photoURL: userRecord.photoURL
      });
    }).catch(error => {
      console.error(`Error fetching user profile for ${req.query.uid}:`, error);
      return res.status(500).send();
    });
  } else {
    res.status(400).send();
  }
});
