import {mongoose, Types} from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
  },
}, {timestamps: true});

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', 'firstName lastName');
  next();
});

reviewSchema.post(/^find/, function(docs) {
  if (Array.isArray(docs)) {
      docs.forEach(doc => {
          if (doc.user) {
            const docObj = doc.toObject();
            const { firstName, lastName } = docObj.user;
              doc.user = `${firstName} ${lastName}`
          }
      });
  } else {
      if (docs.user) {
        const docObj = docs.toObject();
        const { firstName, lastName } = docObj.user;
        docs.user = `${firstName} ${lastName}`
      }
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
