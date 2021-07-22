const Schema = require('../config/db');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const FIELDS = {
    TITLE: 'title',
    FIRST_NAME: 'firstName',
    MIDDLE_NAME: 'middleName',
    LAST_NAME: 'lastName',
    GENDER: 'gender',
    CONTACT: 'contact',
    DELIVERY_ADD: 'deliveryAddress',
    EMAIL: 'email',
    USERNAME: 'username',
    PASSWORD: 'password',
    USER_TYPE: 'userType',
    EMPLOYEE_ID: 'employeeId',
    CREATED_ON: 'createdOn',
    UPDATED_BY: 'updatedBy',
    UPDATED_ON: 'updatedOn'
};

const SCHEMA = {
    [FIELDS.TITLE]: { type: String, enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'] },
    [FIELDS.FIRST_NAME]: { type: String, required: true },
    [FIELDS.MIDDLE_NAME]: { type: String },
    [FIELDS.LAST_NAME]: { type: String, required: true },
    [FIELDS.GENDER]: { type: String, enum: [ 'Male', 'Female', 'Other' ] },
    [FIELDS.CONTACT]: { type: Number, required: true, unique: true, validate: {
        validator: function(v) {
            return /\d{10}/.test(v)
        },
        message: props => `${props.value} is not a valid phone number!`
    }},
    [FIELDS.DELIVERY_ADD]: { type: String, required: true },
    [FIELDS.EMAIL]: { type: String, required: true, unique: true },
    [FIELDS.USERNAME]: { type: String, required: true, unique: true },
    [FIELDS.PASSWORD]: { type: String, required: true },
    [FIELDS.USER_TYPE]: { type: String, enum: [ 'admin', 'user' ], required: true, default: 'user' },
    [FIELDS.EMPLOYEE_ID]: { type: String },
    [FIELDS.CREATED_ON]: { type: Date, default: Date.now },
    [FIELDS.UPDATED_BY]:  { type: Schema.Types.ObjectId, ref: 'User' },
    [FIELDS.UPDATED_ON]: { type: Date },
};

const userSchema = new Schema(SCHEMA);


//Password encryption
userSchema.pre('save', async function(next) {
    await bcrypt.hash(this.password, 10)
    .then(hash => {
        this.password = hash;
        next();
    })
    .catch(err => {
        return next(err);
    })
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

module.exports = {
    USER_FIELDS: FIELDS,
    USER_MODEL: mongoose.model('User', userSchema)
};