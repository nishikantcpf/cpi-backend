const mongoose = require('mongoose');

const userprogressSchema = new mongoose.Schema(
    {
      
        uid: {
            type: String,
            required: true,
            unique:true
        },
        unlockedChapters: [
            {
                chapterId: { type: Number, required: true },
                part: { type: Number, required: true },
            }
          ],
          completedQuizzes: [
            {
              chapterId: { type: Number },
              part: { type: Number },
              score: { type: Number }  // Add score field
            }
          ],
          comptedOnlinesession:{
            type: Boolean, default: false
          },
          wishtotraniner:{
            type: Boolean, default: false
          },
          trainerapproved:{
            type: String , default: 'Not Approved'
          }

       
    },
    {
        timestamps: true,
    }
);

const Userprogress = mongoose.model('Userprogress', userprogressSchema);

module.exports = Userprogress;
