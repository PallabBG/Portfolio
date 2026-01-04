require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://pallab-banerjee.netlify.app"
  ],
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model('User', {
  email:String,
  password:String
});

const Site = mongoose.model('Site', {
  data:Object
});


// LOGIN
app.post('/api/auth/login', async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.sendStatus(401);
  const ok = await bcrypt.compare(req.body.password, user.password);
  if(!ok) return res.sendStatus(401);
  res.json({token: jwt.sign({id:user._id}, process.env.JWT)});
});

// PUBLIC DATA
app.get('/site-data.json', async (req, res) => {
  let doc = await Site.findOne();

  if (!doc) {
    doc = await Site.create({
      data: {
        hero: {
          badge: '',
          firstName: '',
          lastName: '',
          title: '',
          subtitle: '',
          extra: '',
          semester: '',
          resume: ''
        },
        about: {},
        skills: [],
        projects: [],
        experience: [],   // ✅ ADD THIS
        education: [],
        certificates: [],
        socials: [],
        contact: {},
        footerYear: {},
      }

    });
  }

  res.json(doc.data);
});


// AUTH
function auth(req,res,next){
  try{
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT);
    next();
  }catch{ res.sendStatus(401); }
}

// UPDATE DATA
app.put('/api/site', authMiddleware, async (req, res) => {
  let site = await Site.findOne();

  if (!site) {
    site = new Site({ data: {} });
  }

  site.data = {
    hero: req.body.hero ?? site.data.hero ?? {},
    about: req.body.about ?? site.data.about ?? {},
    skills: req.body.skills ?? site.data.skills ?? [],
    projects: req.body.projects ?? site.data.projects ?? [],
    experience: req.body.experience ?? site.data.experience ?? [],
    education: req.body.education ?? site.data.education ?? [],
    certificates: req.body.certificates ?? site.data.certificates ?? [],
    socials: req.body.socials ?? site.data.socials ?? [],
    contact: req.body.contact ?? site.data.contact ?? {},   // ✅ FIX
    footerYear: req.body.footerYear ?? site.data.footerYear ?? {}
  };


  await site.save();
  res.json({ success: true });
});
app.get('/api/site', async (req, res) => {
  try {
    const site = await Site.findOne();
    res.json(site?.data || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to load site data' });
  }
});



app.listen(4000, () => {
  console.log('✅ Backend running at http://localhost:4000');
});

