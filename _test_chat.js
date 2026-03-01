async function testChat() {
    const baseUrl = 'http://localhost:3000/api/chat';
    const sessionId = "test_sess_" + Date.now();
    let history = [];

    console.log("--- TEST 1: Missing Email ---");
    let res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'hi',
            stage: 'collect_email',
            sessionId,
            history
        })
    });
    let data = await res.json();
    console.log("Expected 'Before I can assist...'", data.reply);
    console.log("Stage:", data.stage, "(Expected: collect_email)\n");

    console.log("--- TEST 2: Valid Email ---");
    res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'test@meandrobo.com.qa',
            stage: 'collect_email',
            sessionId,
            history
        })
    });
    data = await res.json();
    console.log("Expected 'Great, thanks! Please provide your Qatar phone number...'", data.reply);
    console.log("Stage:", data.stage, "(Expected: collect_phone)\n");

    console.log("--- TEST 3: Invalid Phone ---");
    res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: '+44 123 4567 890',
            stage: 'collect_phone',
            sessionId,
            history
        })
    });
    data = await res.json();
    console.log("Expected 'Please provide a valid Qatar phone number...'", data.reply);
    console.log("Stage:", data.stage, "(Expected: collect_phone)\n");

    console.log("--- TEST 4: Valid Qatar Phone ---");
    res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: '+974 7755 8819',
            stage: 'collect_phone',
            sessionId,
            history
        })
    });
    data = await res.json();
    console.log("Expected 'Perfect, thank you! How can I help you today?'", data.reply);
    console.log("Stage:", data.stage, "(Expected: ready)\n");

    console.log("--- TEST 5: RAG Inquiry (Ready Stage) ---");
    res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'What is the MeandRobo Next-Gen ERP?',
            stage: 'ready',
            sessionId,
            history
        })
    });
    data = await res.json();
    console.log("Reply:", data.reply);
    console.log("Stage:", data.stage, "(Expected: ready)");
}

testChat().catch(console.error);
