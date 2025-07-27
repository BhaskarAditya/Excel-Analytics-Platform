const express = require('express');
// const { Configuration, OpenAiApi } = require('openai');
// const OpenAI = require('openai');
const authMiddleware = require('../middlewares/auth.Middleware');
const ExcelRecord = require('../models/ExcelRecord');
const Insight = require('../models/Insight');
const { GoogleGenAI } = require('@google/genai')


const router = express.Router();
// const openai = new OpenAiApi(new Configuration({
//     apiKey: process.env.OPENAI_API_KEY
// }));

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/analyze', authMiddleware, async (req, res) => {
    try {
        const { recordId } = req.body;
        const record = await ExcelRecord.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: ' Excel Record is not found' });
        }

        const sampleData = JSON.stringify(record.data.slice(0, 20));

        // const prompt = `You are data analyst. Give 3 actionable insights based on the following data: ${sampleData}`;

        // const completion = await openai.responses.create({
        //     model: 'gpt-4o',
        // messages: [{ role: 'user', content: prompt }],
        //     input: prompt, 
        // temperature: 0.5,
        // });

        // const completion = await openai.chat.completions.create({
        //     model: 'gpt-3.5-turbo',
        //     messages: [{ role: 'user', content: prompt }]
        // });

        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                // contents: `You are data analyst. Give 3 actionable insights based on the following data: ${sampleData}`,
                contents: `You are a professional data analyst.

                            Given the following Excel data sample, provide:
                            1. Two smart, actionable insights from the data.
                            2. For each insight, suggest the most appropriate chart type (e.g., bar chart, line chart, pie chart, scatter plot etc.) and explain why that chart fits.
                            give in short detail

                            Here is the data sample:
                            ${sampleData}`,
            });
            console.log(response.text);

            return response.text;
        }

        const insights = await main();

        // const insights = completion.choices[0].message.content;
        // const insights = await main.choices[0].message.content;
        // const insights = completion.output_text;

        const saved = await Insight.create({
            user: req.user.id,
            recordId,
            insights,
            raw: record.data.length
        });

        res.status(201).json({ message: 'Insight generated successfully', insights, id: saved._id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generated insights' });
    }

});

module.exports = router;