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

const getUserInformation = uid => {
  return new Promise((resolve, reject) => {
    let promises = [
      new Promise((resolve, reject) => {
        admin.database().ref(`users/${uid}/username`).once('value', snapshot => {
          if (snapshot.exists()) resolve({ username: snapshot.val() });
          else resolve();
        }).catch(error => reject(error));
      }),
      new Promise((resolve, reject) => {
        admin.auth().getUser(uid).then(userRecord => {
          return resolve({
            uid: userRecord.uid,
            displayName: userRecord.displayName,
            email: userRecord.email,
            photoURL: userRecord.photoURL
          });
        }).catch(error => reject(error));
      })
    ];
    Promise.all(promises).then(userData => {
      let users = {};
      userData.forEach(data => {
        for (let key in data) users[key] = data[key];
      });
      return resolve(users);
    }).catch(error => reject(error));
  });
}

exports.getTimeline = functions.https.onRequest((req, res) => {
  validateFirebaseIdToken(req, res, () => {
    admin.database().ref(`users/${req.user.uid}/following`).once('value', snapshot => {
      let following = [];
      let events = [];
      let promises = [];
      if (snapshot.numChildren() > 0) {
        snapshot.forEach(childSnapshot => {
          let uid = childSnapshot.key;
          following.push(uid);
        });
        promises.push(getUserInformation(req.user.uid));
        following.forEach(uid => promises.push(getUserInformation(uid)));
        Promise.all(promises).then(userData => {
          let eventPromises = [];
          userData.forEach(userData => {
            eventPromises.push(new Promise((resolve, reject) => {
              admin.database().ref(`timeline`).orderByChild('uid').startAt(userData.uid).limitToLast(5).once('value', snapshot => {
                if (snapshot.numChildren() > 0) {
                  snapshot.forEach(childSnapshot => {
                    events.push({
                      body: childSnapshot.child('body').val(),
                      id: childSnapshot.key,
                      time: childSnapshot.child('time').val(),
                      title: childSnapshot.child('title').val(),
                      uid: childSnapshot.child('uid').val()
                    });
                  });
                  return resolve();
                } else return resolve();
              });
            }));
          });
          return Promise.all(eventPromises).then(() => {
            let users = [];
            userData.forEach(data => {
              for (let key in data) {
                if (!users[data.uid]) users[data.uid] = {};
                users[data.uid][key] = data[key];
              }
            });
            events.forEach(event => {
              event.username = users[event.uid].displayName || users[event.uid].username;
              event.photoURL = users[event.uid].photoURL;
            });
            let sortedEvents = events.sort((a, b) => b.time - a.time);
            return res.status(200).send(sortedEvents);
          }).catch(error => res.status(500).send());
        }).catch(error => {
          console.error(`Error loading timeline for ${req.user.uid}:`, error);
          res.status(500).send();
        });
      } else {
        res.status(204).send();
      }
    });
  });
});

exports.getProfile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.query.uid) {
      let user = {};
      getUserInformation(req.query.uid)
        .then(user => res.status(200).json(user))
        .catch(error => {
          console.error(`Error fetching user profile for ${req.query.uid}:`, error);
          res.status(500).send();
        });
    } else {
      res.status(400).send();
    }
  });
});

exports.setUsername = functions.https.onRequest((req, res) => {
  validateFirebaseIdToken(req, res, () => {
    if (req.method === 'POST') {
      if (req.body.username) {
        admin.database().ref(`users/${req.user.uid}/username`).set(req.body.username);
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    } else {
      res.status(405).send();
    }
  });
});

exports.userCreatedTimelineEvent = functions.auth.user().onCreate(user => {
  let key = admin.database().ref('timeline').push().key;
  return admin.database().ref(`timeline/${key}`).set({
    body: '',
    time: new Date().getTime(),
    title: 'Created their account!',
    uid: user.uid
  });
});


exports.getGlobalTimeline = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    admin.database().ref('timeline').limitToLast(25).once('value', snapshot => {
      let events = [];
      let promises = [];
      snapshot.forEach(childSnapshot => {
        promises.push(getUserInformation(childSnapshot.child('uid').val()));
        events.push({
          body: childSnapshot.child('body').val(),
          id: childSnapshot.key,
          time: childSnapshot.child('time').val(),
          title: childSnapshot.child('title').val(),
          uid: childSnapshot.child('uid').val()
        });
      });
      Promise.all(promises).then(userData => {
        let users = [];
        userData.forEach(data => {
          for (let key in data) {
            if (!users[data.uid]) users[data.uid] = {};
            users[data.uid][key] = data[key];
          }
        });
        events.forEach(event => {
          event.username = users[event.uid].displayName || users[event.uid].username;
          event.photoURL = users[event.uid].photoURL;
        });
        let sortedEvents = events.sort((a, b) => b.time - a.time);
        return res.status(200).send(sortedEvents);
      }).catch(error => {
        console.error('Unable to load global timeline:', error);
        res.status(500).send();
      });
    });
  });
});

exports.followUser = functions.https.onRequest((req, res) => {
  validateFirebaseIdToken(req, res, () => {
    if (req.method === 'POST') {
      if (req.body.uid && req.body.following) {
        let following = req.body.following || null;
        if (following) {
          getUserInformation(req.body.uid).then(user => {
            admin.database().ref(`users/${req.user.uid}/following/${user.uid}`).set(following);
            let key = admin.database().ref('timeline').push().key;
            admin.database().ref(`timeline/${key}`).set({
              body: user.uid,
              time: new Date().getTime(),
              title: 'Followed a user!',
              uid: req.user.uid
            });
            return res.status(200).send();
          }).catch(error => {
            console.error(`Unable to ${following ? 'follow' : 'unfollow'} ${req.body.uid}:`, error);
            return res.status(500).send();
          });
        }
      } else {
        res.status(400).send();
      }
    } else {
      res.status(405).send();
    }
  });
});

exports.addTimelineEvent = functions.https.onRequest((req, res) => {
  validateFirebaseIdToken(req, res, () => {
    if (req.method === 'POST') {
      if (req.body.body && req.body.body.length) {
        console.log(req.body.body);
        let key = admin.database().ref('timeline').push().key;
        admin.database().ref(`timeline/${key}`).set({
          body: req.body.body,
          time: new Date().getTime(),
          title: 'Posted a message!',
          uid: req.user.uid
        });
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    } else {
      res.status(405).send();
    }
  });
});
