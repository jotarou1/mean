'use strict';


var mongoose = require('mongoose'),
    Vehicle = mongoose.model('Vehicle'),
    //_ = require('lodash'),
    ObjectId = mongoose.Types.ObjectId;
/*

exports.all = function (req,res) {
    Vehicle.find().exec(function (err, vehicles){
        if (err) {
            console.log('Error loading vehicles from database');
            console.log(err);
            res.status(500).json({error : 'Error loading vehicles from database'});
        }
        else {
            res.status(200).json(vehicles);
        }
    });
};


exports.show = function(req,res) {
    if (req.vehicle) {
        res.status(200).json(req.vehicle);
    }
    else {
        res.status(404).json({error : 'Requested vehicle ID not found in database'});
    }
};


exports.create = function(req,res) {
    var vehicle = new Vehicle(req.body);
    vehicle.save(function (err,vehicle) {
        if (err) {
            console.log('Error saving vehicle');
            console.log(err);
            res.status(500).json(err);
        }
        if (vehicle) {
            res.status(200).json(vehicle);
        }
    });
};

exports.vehicle = function(req,res,next,id) {
    Vehicle.findOne({ _id : id },function(err,vehicle) {
        if (err) {
            console.log('Error loading vehicle from database');
            console.log(err);
            res.status(500).json({error : 'Error loading vehicle from database'});
        }
        if (vehicle) {
            req.vehicle = vehicle;
            next();
        }
        else res.status(404).json({error : 'Requested vehicle ID not found in database'});
    });
};

exports.update = function(req,res) {
    if (req.vehicle) {
        var vehicle = req.vehicle;
        vehicle = _.extend(vehicle, req.body);
        console.log(vehicle);
        req.vehicle.save(function (err,vehicle) {
            if (err) {
                console.log('Error updating vehicle ' + vehicle.id);
                console.log(err);
                res.status(500).json({error : err});
            }
            if (vehicle) {
                res.status(200).json(vehicle);
            }
        });
    }

    else res.status(404);
};

exports.delete = function(req,res) {
    if (req.vehicle) {
        req.vehicle.remove(function (err,vehicle) {
            if (err) {
                console.log('Error occured deleting vehicle ' + req.vehicle._id);
                console.log(err);
                res.status(500).json(err);
            }
            if (vehicle) {
                res.status(200).json(vehicle);
            }
            else res.status(404);
        });
    }

    else res.status(404);
};

exports.findByUser = function(req,res,id) {
    Vehicle.find({userId : new ObjectId(id)}, function(err,vehicles){});
};
======= */
/**
 * Module dependencies.
 */
//var mongoose = require('mongoose'),
//Vehicle = mongoose.model('Vehicle');


/**
 * Create Vehicle
 */

exports.create = function(req,res) 
{
	var vehicle = new Vehicle(req.body); 
	vehicle.userId = req.user;
 
	vehicle.save(function(err,vehicle) {
        if (err)
        {
          console.log("Error creating vehicle");
          console.log(err);
          return res.json(500, { error: 'Error in creating new car' });
        }
        res.json(vehicle);
	});
};

/**
 * Update Vehicle
 */
 
exports.update = function(req, res) 
{
	var updatedCar = new Vehicle(req.body); 
	
    if (updatedCar._id !== undefined) 
	{ 
		//Mongodb does not like it when you try to update a doc by _id when the object still exists, so we have to delete the original
		var searchID = updatedCar._id; 
        delete updatedCar._id;
			
		
        Vehicle.update(searchID, updatedCar, function (err) { 
            if (err) 
			{ 
                console.log('Vehicle update failed: ' + err); 
                return res.json(500, { error: 'Failed to update vehicle' + err } ); 
            } 
        }); 
        res.send('Vehicle successfully updated. '); 
    } 
	else 
	{ //We're updating a non existant vehicle
		res.send('ERROR: Attempted to update non-existant vehicle');
	}
};


/**
 * Find user's garage
 */
exports.findByUser = function(req,res) {
    Vehicle.find({userId : new ObjectId(req.user._id)}, function(err,vehicles){
        if (err) {
            return res.status(500).json({ error : 'Error getting vehicles'});
        }
        console.log(vehicles);
        return res.status(200).json( vehicles ? vehicles : []);
    });
};


