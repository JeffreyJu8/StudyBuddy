const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authenticateToken = require("../util/jwt");
const { promptifyExams } = require("../util/geminiPrompt");
const examsService = require('../service/examsService');
const logger = require("../util/logger");

const ai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);


// taking the exam
// router.post('/:examid', authenticateToken, async (req, res) => {

// })


// creating the exam
router.post('/create-exam', authenticateToken, async (req, res) => {
    // logger.info("calling create exam");
    try{
        const userId = req.user.id;
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const userPrompt = req.body.prompt;

        if (!userPrompt) {
            logger.warn("Prompt is required for exam generation.");
            return res.status(400).json({ error: "Prompt is required." });
        }

        console.log(userPrompt);

        let newUserPrompt = promptifyExams(userPrompt);
        const result = await model.generateContent(newUserPrompt);
        const response = await result.response;
        const text = response.text();

        logger.info(`Examss generated for user: ${userId}`);
        res.json({ reply: text });
    }catch(err){
        logger.error("Gemini error:", err);
        res.status(500).json({ err: "Failed to generate exam from Gemini" });
    }
})

router.post('/save', authenticateToken, async (req, res) => {
    try{
        const userId = req.user.id;
        const examSetName = req.body.name;
        const exam = req.body.exam;

        const response = await examsService.saveExams(userId, examSetName, exam);

        if(!response){
            res.status(400).json("Failed to receive response");
        }

        res.status(200).json({Message: "Exam saved"});
    }catch(err){
        console.error(err);
        res.status(500).json({ err: "Failed to save exam from Gemini" });
    }
})

module.exports = router;