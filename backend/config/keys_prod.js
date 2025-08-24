module.exports = {
    mongoURI: 'mongodb://localhost:27017/lmsuser', //
    privateKey: process.env.VAPID_PRIVATE_KEY,
    publicKey: process.env.VAPID_PUBLIC_KEY
}