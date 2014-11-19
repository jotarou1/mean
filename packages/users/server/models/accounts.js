'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Account Schema
 */
	
var AccountSchema = new Schema({
    city: { type: String, required: true },
    deletionFlag: { type: String, required: false },
    emergencyContactName: {  type: String, required: false },
    personalEmail: { type: String, required: true },
    primaryEmergencyPhoneNumber: { type: String, required: false },
    primaryPhoneNumber: {  type: String,  required: true },
    secondaryEmergencyPhoneNumber: {  type: String, required: true },
    secondaryPhoneNumber: { type: String, required: true },
    state: { type: String,  required: true },
    userCreatedDate: { type: String, default: Date.now },
    streetAddress: { type: String, required: true },
    userFirstName: { type: String, required: true },
    userID: { type: Schema.ObjectId,
        ref:'User',
        required: true },
    userLastName: { type: String, required: true },
    zip: { type: String, required: true }
});

/**
 * Validation 
 */

/**
 * Statics
 */
AccountSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Account',AccountSchema);

