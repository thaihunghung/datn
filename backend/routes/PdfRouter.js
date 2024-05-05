const express = require('express');
const router = express.Router();

router.post('/pdf', async (req, res) => {
    const { html } = req.body;
    try {
      const browser = await puppeteer.launch();

      const page = await browser.newPage();
      const htmlContent = `${html}`;
      await page.setContent(htmlContent);

      const outputPath = path.join(__dirname, '../public/pdf/output.pdf');
  
      const pdfOptions = {
        path: outputPath,
        format: 'A4',
        margin: {
          top: '2cm',
          bottom: '2cm',
        },
      };
      await page.pdf(pdfOptions);
      await browser.close();
      res.sendFile(outputPath);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;