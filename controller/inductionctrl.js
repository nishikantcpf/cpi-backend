// userctrl.js

const asyncHandler = require('express-async-handler');
const conn = require('../config/dbConnect'); // Your database connection file
const { generateToken } = require('../config/jwtToken');
const InductionContent = require('../models/inductioncontmodel');
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
const  Quize  = require('../models/Question');
const Session = require('../models/Sessionmodel');
const nodemailer = require('nodemailer');
const Feedback = require('../models/feedback');
const Register = require('../models/resigtermodel');
const Userprogress = require('../models/userprogressmodel');
const score = require('../models/scoremodel');
const InvitationCode = require('../models/invitationCode');

// Controller methods



const create_content = asyncHandler(async(req,res)=>{
    try {
        const data = req.body;
        const userData = await InductionContent.create(data);
        res.send(userData)
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
});

const get_content = asyncHandler(async (req, res) => {
  try {
      const { s_no } = req.params;
      const getaUser = await InductionContent.find();
      res.json(getaUser)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});

// for part one and two
const get_content_part1 = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const getaUser = await InductionContent.findOne({ _id: id });
        res.json(getaUser)
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
});



// for deliting content
const deleteInductionContent = async (req, res) => {
  try {
      const id = req.params.id;
      const contentToDelete = await InductionContent.findById(id);
     
      if (!contentToDelete) {
          return res.status(404).json({ message: 'Induction content not found' });
      }
      const videodataToDelete= await Video.findOne({videoUrl:contentToDelete.video_link})
      

      // Extract video filename from the video_link field
      const videoFileName = path.basename(contentToDelete.video_link);
      const videoFilePath = path.join(__dirname, '..', 'uploads', 'videos', videoFileName);

      // Delete video file from the uploads/video folder
      fs.unlink(videoFilePath, (err) => {
          if (err && err.code !== 'ENOENT') {
              // If error occurs, but not because the file doesn't exist, return an error
              return res.status(500).json({ message: 'Error deleting video file', error: err.message });
          }

          // After video deletion, delete the document from the database
          contentToDelete.deleteOne();
          videodataToDelete.deleteOne();

          return res.status(200).json({ message: 'Induction content and video deleted successfully' });
      });
  } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDataPartById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
      const dataPart = await Quize.findOne({ name: id }); // Fetch the specific data part by ID
      if (!dataPart) {
          return res.status(404).json({ message: 'Data part not found' });
      }
      res.status(200).json(dataPart); // Send the specific data part back as JSON
  } catch (error) {
      res.status(500).json({ message: 'Error fetching data part', error });
  }
};
const getDataPartById_quize = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
      const dataPart = await Quize.findOne({ contentid: id }); // Fetch the specific data part by ID
      if (!dataPart) {
          return res.status(404).json({ message: 'Data part not found' });
      }
      res.status(200).json(dataPart); // Send the specific data part back as JSON
  } catch (error) {
      res.status(500).json({ message: 'Error fetching data part', error });
  }
};

// create meeting 

const meetingsession = async(req, res)=>{ 

  const data = req.body;

  try {
    const userData = await Session.create(data);
        res.send(userData)
  } catch (error) {
    res.status(500).json({ message: 'Error in creating data', error });
  }
}

// Get meeting session

const getmeetingsession = async(req, res) => {

  try {
    const userdata = await Session.find();
    res.send(userdata)
    
  } catch (error) {
    res.status(500).json({ message: 'Error in fetching data', error });
  }
}

// Get meeting session by id
const getmeetingsessionById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
      const dataPart = await Session.findById(id); // Fetch the specific data part by ID
    
      res.status(200).json(dataPart); // Send the specific data part back as JSON
  } catch (error) {
      res.status(500).json({ message: 'Error fetching data part', error });
  }
};

// 

// send email to user

// Email controller function to handle email sending
const sendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Create a transporter with email service credentials
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
      user: "koolrohit0211@gmail.com",
      pass: "wtbeaqvngetxfkwy",
    }
  });

  // Email options
  let mailOptions = {
    // from: 'noreply@cyberpeace.org', // Sender address
    to: to, // List of recipients
    subject: subject, // Subject of the email
    text: text, // Plain text body
    html: html, // HTML body (optional)
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + mailOptions.to);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
};



// otp send

const sendotp = async (req, res) => {
  function generateRandomPassword() {
    const password = Math.floor(1000 + Math.random() * 9000);
    return password;
  }
  
  const genrate = generateRandomPassword();
  // console.log(randomPassword);
  const { mail } = req.body;
  
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
      user: "koolrohit0211@gmail.com",
      pass: "wtbeaqvngetxfkwy",
    }
  });
  const massage = {
    from: "koolrohit0211@gmail.com",
    to: mail,
    subject: " Otp for cyberpeace ",
    text: "Dear applicant "
      + "\r\n" +

      "Your one time password is " + genrate,
   

  };
  transporter.sendMail(massage, (err, info) => {
    if (err) {
      // console.log(`error in sending mail`, err)
      return res.status(400).json({ massage: `error in sending mail`, err })

    } else {
      // console.log("sucessfully send the mail", info)
      return res.json({ message: genrate })
    }
  })
}

// Send feedback

const create_feedback = asyncHandler(async(req,res)=>{
  try {
      const data = req.body;
      const userData = await Feedback.create(data);
      res.send(userData)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});

const register_session = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
   // Find the user by their UID
   const user_register = await Register.findOne({ uid: data.uid });
   if (user_register) {
     // Check if the user has rescheduled less than 3 times
     if (user_register.rescheduleCount < 3) {
       // Increment the reschedule count
       user_register.rescheduleCount += 1;
       await user_register.save();
       return res.status(200).send("Session rescheduled successfully.");
     } else {
       // Deny if the user has reached the limit
       return res.status(403).send("You have reached the maximum limit of rescheduling (3 times).");
     }
   }

   const newUserData = {
    ...data,
    rescheduleCount: 0 // Reset reschedule count to 0 for new registration
  };

   // Delete any previous reschedule count data if applicable
   await Register.deleteOne({ uid: data.uid });
    
   const userData = await Register.create(newUserData);
   res.status(201).send(userData);
  
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


const userprogressadd = async (req, res) => {
  const { uid, chapterId, part, score } = req.body;

  try {
    let user = await Userprogress.findOne({ uid });

    if (!user) {
      user = await Userprogress.create({ uid });
    }

    // Check if the quiz is passed
    if (score > 3) {
      // Add chapter, part, and score to completedQuizzes if not already added
      const isQuizCompleted = user.completedQuizzes.some(
        (quiz) => quiz.chapterId === chapterId && quiz.part === part
      );

      if (!isQuizCompleted) {
        user.completedQuizzes.push({ chapterId, part, score });
      }

      // Unlock the specified part of the chapter
      const unlockCurrentPart = user.unlockedChapters.some(
        (ch) => ch.chapterId === chapterId && ch.part === part
      );

      if (!unlockCurrentPart) {
        user.unlockedChapters.push({ chapterId, part });
      }

     

      await user.save();
      res.json({ success: true, message: 'Quiz passed, chapter part unlocked!', scoreSaved: true });
    } else {
      res.json({ success: false, message: 'Quiz not passed, retry!', scoreSaved: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


async function userprogress(req, res) {
  try {
    const { uid } = req.body; // Assuming uid is passed as a parameter

    // Fetch user progress data and induction content
    const userProgress = await Userprogress.findOne({ uid });
    const inductionContent = await InductionContent.find();

    // Merge content and progress to mark locked/unlocked chapters
    const contentWithLockStatus = inductionContent.map((content) => {
        let isUnlocked;

        if (userProgress) {
         
            // Check if the chapter is unlocked based on user progress
            isUnlocked = userProgress.unlockedChapters.some(
              
                (unlocked) =>(unlocked.chapterId + 1=== content.s_no || unlocked.chapterId === content.s_no ) &&  unlocked.part === content.part
                
                
            );
           
        } else {
            // Default unlock for Part 1, Chapter 1
            isUnlocked = content.part === 1 && content.s_no === 1;
        }

        return { ...content.toObject(), isUnlocked };
    });

    res.json(contentWithLockStatus);
  } catch (error) {
    console.error('Error fetching user content:', error);
    res.status(500).json({ message: 'Error fetching content' });
  }
}

const quiz_completed = async (req, res) => {
  const { uid } = req.body;

  try {
    const user = await Userprogress.findOne({ uid }); // Retrieve user quiz progress

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    } else {
      const chapters = await InductionContent.find(); // Retrieve all chapters
      const userScore = await score.findOne({ uid }); // Retrieve final assessment score
      const final_assessment = !!userScore;

      const part1_quiz_completed = user.completedQuizzes.filter((value) => value.part === 1).length;
      const part2_quiz_completed = user.completedQuizzes.filter((value) => value.part === 2).length - 1; // Subtract 1 since chapterId starts from 0
      
      const total_part1_chapters = chapters.filter((value) => value.part === 1).length;
      const total_part2_chapters = chapters.filter((value) => value.part === 2).length;
      
      const part1_completed = total_part1_chapters === part1_quiz_completed;
      const part2_completed = total_part2_chapters === part2_quiz_completed;
      const session_attended = user.comptedOnlinesession

      res.json({ success: true, part1_completed, part2_completed, final_assessment,session_attended });
    }
  } catch (error) {
    console.error("Error in quiz_completed:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


const genrate_invitation_code = async (req, res) => {
  const { inviteCode, allowedEmails, contentid } = req.body;

  try {
      const existingCode = await InvitationCode.findOne({ code: inviteCode });
      if (existingCode) {
          return res.status(400).json({ message: "Invitation code already exists." });
      }

      const newInvitationCode = new InvitationCode({
          code: inviteCode,
          allowedEmails,
          isValid: true,
          contentid
      });

      await newInvitationCode.save();
      res.status(201).json({ message: "Invitation code created successfully!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create invitation code." });
      console.log(error)
  }
};


const skip_part2 =async (req,res)=>{
  const { email, inviteCode, uid } = req.body;

  try {
      // Find the invitation code document
      const invitation = await InvitationCode.findOne({ code: inviteCode, isValid: true });
      const sessionid =invitation.contentid;
     
      if (!invitation) {
          return res.status(400).json({ message: "Invalid or expired invitation code." });
      }

      // Check if the email is in the allowedEmails list
      if (!invitation.allowedEmails.includes(email)) {
          return res.status(403).json({ message: "Your email is not authorized for this code." });
      }

      // If valid, proceed to update user status or create user
      let user = await Userprogress.findOne({ uid });
      if (!user) {
         console.log('No user found')
      } else {
          user.comptedOnlinesession = true;
      }

      await user.save();
      res.status(200).json({ message: "Congratulations you have completed physical session!", sessionid });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
}




// Export all controller functions
module.exports = {
    create_content,
    get_content,
    get_content_part1,
    deleteInductionContent,
    getDataPartById,
    meetingsession,
    getmeetingsession,
    getmeetingsessionById,
    sendEmail,
    sendotp,
    create_feedback,
    register_session,
    userprogressadd,
    userprogress,
    getDataPartById_quize,
    quiz_completed,
    genrate_invitation_code,
    skip_part2
    
};
