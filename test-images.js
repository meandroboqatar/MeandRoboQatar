const https = require('https');

https.get('https://meandrobo.com.qa/insights/ai-website-chatbot-leads-qatar', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const regex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
            console.log(match[1]);
        }
    });
});
