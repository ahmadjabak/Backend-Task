const express = require("express");
const router = express.Router();
const Students = require("../models/student");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
//get students with pagination.
router.get("/:limit?", async (req, res) => {
    try {
        const limit = req.params.limit;
        if (limit) {
            const student = await Students.find({})
                .sort({ createdAt: -1 })
                .limit(limit);
            return res.json(student);
        }
        const student = await Students.find();
        return res.json(student);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

//get students by id.
router.get("/onestudent/:id",auth, async (req, res) => {
    try {
        const student = await Students.findOne({ id: req.params.id });
        res.json(student);
    } catch (err) {
        console.log(err);
    }
});

//create one student.
router.post("/addstudent",
    check("id", "id should be provided").not().isEmpty(),
    check("firstName", "First name should be provided").not().isEmpty(),
    check("lastName", "Last name should be provided").not().isEmpty(),
    check("dateOfBirth", "date of birth should be provided").not().isEmpty(),
    check("address", "address should be provided").not().isEmpty(),
    check("phoneNumber", "phone number should be provided").not().isEmpty(),
    check("countryCode", "country code should be provided").not().isEmpty(),
    async (req, res) => {
        //check all fields are not empty.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { id, firstName, lastName, dateOfBirth, address, phoneNumber, countryCode } = req.body;
        //check if id exists.
        try {
            const uniqueId = await Students.findOne({
                id: req.body.id,
            });
            if (uniqueId) {
                message = "id Already Exists";
                return res.status(403).json(message);
            }
        } catch (err) {
            console.log(err.message);
        }

        try {
            const student = new Students({
                id, 
                firstName, 
                lastName, 
                dateOfBirth, 
                address, 
                phoneNumber, 
                countryCode
            });
            await student.save();
            message = "Student Added Successfully";
            return res.json(message);
        } catch (err) {
            return res.status(403).json(err.message);
        }
    });

//update students.
    router.put('/editstudent/:id',async (req, res) => {
        Students.findOneAndUpdate(({ id: req.params.id }), {
            $set: {
                id: req.query.id,
                firstName: req.query.firstname,
                lastName: req.query.lastname,
                dateOfBirth: req.query.dateOfBirth,
                address: req.query.addres,
                phoneNumber: req.query.phoneNumber,
                countryCode:req.query.countryCode
            }
        }, 
        { new: true }, (err, val) => {
            if (val != null) {
                Students.find((err, val) => {
                    res.send(val)
                })
            } else {
                res.status(404).send({ status: 404, error: true, message: 'the data  does not exist' })
            }
        })
    
    });

    //delete student

    router.delete('/deletestudent/:id', async(req, res) => {
        try{
            const deleteStudent = await Students.findOne({
                id: req.params.id,
            });
            await deleteStudent.remove()
            message = "Student Deleted Successfully";
            return res.json(message);
} catch (err) {
    return res.status(403).json(err.message);
}
    }
   
    )

module.exports = router;