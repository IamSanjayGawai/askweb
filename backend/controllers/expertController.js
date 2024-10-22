import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import expertModel from "../models/expertModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for expert Login 
const loginExpert = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await expertModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get expert appointments for expert panel
const appointmentsExpert = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for expert panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for expert panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all expert list for Frontend
const expertList = async (req, res) => {
    try {

        const experts = await expertModel.find({}).select(['-password', '-email'])
        res.json({ success: true, experts })
        console.log(experts)

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change expert availablity for Admin and expert Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await expertModel.findById(docId)
        await expertModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get expert profile for  expert Panel
const expertProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await expertModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update expert profile data from  Expert Panel
const updateExpertProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await expertModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for expert panel
const expertDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let Customers = []

        appointments.map((item) => {
            if (!Customers.includes(item.userId)) {
                Customers.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            Customers: Customers.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginExpert,
    appointmentsExpert,
    appointmentCancel,
    expertList,
    changeAvailablity,
    appointmentComplete,
    expertDashboard,
    expertProfile,
    updateExpertProfile
}