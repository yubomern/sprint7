const express = require('express')
const app = express();

// packages
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

app.use('/uploads', express.static('uploads'));
const methodOverride = require('method-override');
const sessionRoutes = require('./routes/session');
const { authcheck } = require("./middleware/auth");
const jwt = require("jsonwebtoken");

// connection to DB and cloudinary
const { connectDB } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');
const eventmeetRoutes = require('./routes/eventmeet');
// routes
const index = require('./routes');
const push = require('./routes/push');
const subscribe = require('./routes/subscribe');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payments');
const event = require(`./routes/event`);
const courseRoutes = require('./routes/coursev0');
const userv1Routes =require("./routes/userRoutes");
const ocrRoutes = require("./routes/ocr");
const refundRoutes = require("./routes/refund");
const uploadServiceRoutes = require("./routes/uploadServiceRoutes");


// middleware 
app.use(express.json()); // to parse json body
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



const { socketController } = require("./controllers/chatController");



  
app.use(
    cors({
        // origin: 'http://localhost:5173', // frontend link
        origin: "*",
        credentials: true,
        optionSuccessStatus: 200,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
)


const server = require("http").createServer(app);
// socket.io and then i added cors for cross origin to localhost only
const io = require("socket.io")(server, {
    cors: {
      origin: "*", //specific origin you want to give access to,
    },
  });
  
socketController(io);

app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



const keys = require('./config/keys');

const chaptersRoutes = require("./routes/chapters");
const CoursesRoutes  = require('./routes/lecture');
const moduleRoutes = require("./routes/module");
const meetRoutes  = require('./routes/meetRoutes');

const routes = require("./routes/ToDoRoute");
const uploadRoutes = require("./routes/uploadRoutes");
const  tag  =  require("./controllers/TagController");
const company  = require('./controllers/CompanyController')
const categoryRoutes = require('./routes/categoryRoutes');
const categoriesRoutes  = require('./controllers/categoriesController');
const refunduserRoutes  = require('./routes/userrefund');
const studentRoutes = require("./routes/student");
const adminRoutes = require("./routes/admin");
const helmet = require('helmet');
app.use('/api/instructors', require('./routes/instructorRoutes'));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")))
app.use("/api/v3/upload", express.static(path.join(__dirname, "/uploads")))
app.use("/api/v4/upload", express.static(path.join(__dirname, "/uploads")))
app.use('/api/sessions',sessionRoutes);





// Health
app.get('/health', (req, res) => res.json({ ok: true }));
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(uploadServiceRoutes);
const productRoutes = require('./controllers/CourseimageController');
const PORT = process.env.PORT || 4000;
app.set('io', io);

// Global middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));











// connections
connectDB();
cloudinaryConnect();

// mount route
app.use("/api/chat", socketController);

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/event', event);
app.use('/api/v1/tag', tag);
app.use('/api/v1/company', company);
app.use('/api/v1/categories', categoriesRoutes);
app.use("/api/v1/meet",eventmeetRoutes);
app.use("/api/v2/module", moduleRoutes);
app.use("/api/user", userv1Routes);
app.use('/api/v2/user' , refunduserRoutes);
app.use("/api/events", meetRoutes);
app.use("/api/v3/refund", refundRoutes);
app.use("/api/v3/ocr", ocrRoutes);

// Allow your frontend URL
app.use(cors({
    origin: 'http://localhost:5173',  // <-- frontend
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true,                // <-- if using cookies or auth headers
}));


app.use('/api/reclamations', require('./routes/reclamationRoutes'));
app.use('/api/follow', require('./routes/followRoutes'));
app.use('/api/posts', require('./routes/postUserRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));



app.use("/api/v1/todo",routes);

app.use('/api/categories', categoriesRoutes);
app.use('/lms',  (req,res) => {
    console.log("hello");
    res.send({
        "status" : "ok" ,
        "mesage" : "hello"
    });
});
app.use('/api/v1/events', event);
app.use("/students" ,  studentRoutes);
app.use("/courses", adminRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/module", moduleRoutes);
app.use("/api", refundRoutes);
app.use('/api/courses' ,  CoursesRoutes);
app.use(uploadRoutes);
app.use('/categories', categoryRoutes);
app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));
app.get('/ca', (req, res) => res.redirect('/categories'));
app.use('/products', productRoutes);
app.use('/', index);
app.use('/subscribe', subscribe);
app.use('/push', push);




const ratingRoutes = require('./routes/ratingRoutes');

const userdetail =require('./routes/userDetailRoutes');


app.use('/api/detail' ,   userdetail);

app.use('/api/ratings', ratingRoutes);

app.use('/api/reclam' , require('./routes/reclamationStudentRoutes'));

// === Route to check token ===
app.get("/check-token", authcheck, (req, res) => {
    // if auth passes, token is valid
    if(req.user) {
         console.table(req.user);
    }
    res.status(200).json({
        success: true,
        message: "Token is valid",
        user: req.user   // send decoded user info
    });
});

// Default Route
app.get('/default', (req, res) => {
    // console.log('Your server is up and running..!');
    res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.get('/prof', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'smartprof.html'));
});

app.get('/calc', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calc.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

/*
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
*/


// Socket events (simple: push notifications and comments)
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('joinUser', (userId) => {
    if (userId) socket.join(`user:${userId}`);
  });

  // optional debugging
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

server.listen(PORT, () => {
    console.log ("server chat  ");
    console.log(`Server Started on PORT ${PORT}`);
});