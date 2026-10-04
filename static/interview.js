document.addEventListener("DOMContentLoaded", function () {

    console.log("========================================");
    console.log("AI INTERVIEW INITIALIZING");
    console.log("========================================");


    // =====================================================
    // ELEMENTS
    // =====================================================

    const startBtn =
        document.getElementById("startInterviewButton");

    const recordBtn =
        document.getElementById("recordButton");

    const stopBtn =
        document.getElementById("stopButton");

    const nextBtn =
        document.getElementById("nextQuestionButton");

    const questionNumber =
        document.getElementById("questionNumber");

    const questionText =
        document.getElementById("questionText");

    const questionCategory =
        document.getElementById("questionCategory");

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progressFill");

    const recordingStatus =
        document.getElementById("recordingStatus");

    const recordingTimer =
        document.getElementById("recordingTimer");

    const transcriptText =
        document.getElementById("transcriptText");

    const transcriptStatus =
        document.getElementById("transcriptStatus");

    const audioPreview =
        document.getElementById("audioPreview");

    const aiStatus =
        document.getElementById("aiStatus");

    const finalResult =
        document.getElementById("finalResult");

    const overallScore =
        document.getElementById("overallScore");

    const finalMessage =
        document.getElementById("finalInterviewMessage");

    const aiFeedback =
        document.getElementById("aiFeedback");

    const restartBtn =
        document.getElementById("restartInterviewButton");


    // =====================================================
    // ELEMENT CHECK
    // =====================================================

    console.log("Start button:", !!startBtn);
    console.log("Record button:", !!recordBtn);
    console.log("Stop button:", !!stopBtn);
    console.log("Next button:", !!nextBtn);
    console.log("Transcript:", !!transcriptText);
    console.log("Timer:", !!recordingTimer);
    console.log("Audio preview:", !!audioPreview);


    // =====================================================
    // QUESTIONS
    // =====================================================

    const defaultQuestions = [

        {
            category: "Introduction",
            question:
                "Hello! Good morning. Please introduce yourself and tell me about your education, skills, projects and career goals."
        },

        {
            category: "Resume",
            question:
                "Can you walk me through your resume and explain your important technical skills?"
        },

        {
            category: "Technical",
            question:
                "You have mentioned Python in your resume. Can you explain how you have used Python in your projects?"
        },

        {
            category: "Projects",
            question:
                "Can you explain one of your important projects and describe your role in developing it?"
        },

        {
            category: "Problem Solving",
            question:
                "Tell me about a technical challenge you faced in a project and how you solved it."
        },

        {
            category: "Technical",
            question:
                "Suppose your application works correctly on your computer but fails after deployment. How would you debug the problem?"
        },

        {
            category: "Skills",
            question:
                "Which technical skill are you currently improving and why did you choose to learn it?"
        },

        {
            category: "HR",
            question:
                "What are your strengths and how can they help you in your career?"
        },

        {
            category: "HR",
            question:
                "Where do you see yourself in the next three to five years?"
        },

        {
            category: "Final",
            question:
                "Why should a company consider you for an entry-level position?"
        }

    ];


    let questions = [...defaultQuestions];


    // =====================================================
    // STATE
    // =====================================================

    let currentQuestion = 0;

    let interviewStarted = false;

    let recording = false;

    let processing = false;

    let mediaRecorder = null;

    let audioStream = null;

    let audioChunks = [];

    let timerInterval = null;

    let recordingStartTime = 0;

    let recognizedAnswer = "";

    let interviewAnswers = [];

    let lastAudioURL = null;


    // =====================================================
    // HELPERS
    // =====================================================

    function setText(element, value) {

        if (element) {
            element.textContent =
                value ?? "";
        }

    }


    function setWidth(element, value) {

        if (element) {
            element.style.width = value;
        }

    }


    function wait(milliseconds) {

        return new Promise(function (resolve) {

            setTimeout(resolve, milliseconds);

        });

    }


    // =====================================================
    // STATUS
    // =====================================================

    function setStatus(message) {

        setText(
            recordingStatus,
            message
        );

        console.log(
            "STATUS:",
            message
        );

    }


    // =====================================================
    // UPDATE QUESTION
    // =====================================================

    function updateQuestion() {

        const q =
            questions[currentQuestion];

        if (!q) {
            return;
        }


        setText(
            questionNumber,
            currentQuestion + 1
        );


        setText(
            questionText,
            q.question
        );


        setText(
            questionCategory,
            q.category
        );


        const percentage =
            (
                (currentQuestion + 1) /
                questions.length
            ) * 100;


        setWidth(
            progressFill,
            `${percentage}%`
        );


        setText(
            progressText,
            `${currentQuestion + 1} / ${questions.length}`
        );

    }


    // =====================================================
    // SPEAK QUESTION
    // =====================================================

    function speakQuestion() {

        if (
            !("speechSynthesis" in window)
        ) {

            console.warn(
                "Speech synthesis is not supported."
            );

            return;
        }


        const q =
            questions[currentQuestion];

        if (!q) {
            return;
        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                q.question
            );


        speech.lang = "en-IN";

        speech.rate = 0.95;

        speech.pitch = 1;


        const voices =
            window.speechSynthesis
                .getVoices();


        const selectedVoice =
            voices.find(
                voice =>
                    voice.lang &&
                    voice.lang
                        .toLowerCase()
                        .includes("en-in")
            ) ||
            voices.find(
                voice =>
                    voice.lang &&
                    voice.lang
                        .toLowerCase()
                        .includes("en-us")
            ) ||
            voices.find(
                voice =>
                    voice.lang &&
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
            );


        if (selectedVoice) {

            speech.voice =
                selectedVoice;

        }


        speech.onstart =
            function () {

                if (aiStatus) {

                    aiStatus.textContent =
                        "AI is asking the question...";

                }


                setStatus(
                    "🔊 AI is asking the question..."
                );

            };


        speech.onend =
            function () {

                if (aiStatus) {

                    aiStatus.textContent =
                        "Ready for your answer";

                }


                setStatus(
                    "🎙️ Click Start Answer and speak."
                );

            };


        speech.onerror =
            function (event) {

                console.log(
                    "Speech synthesis error:",
                    event
                );

                setStatus(
                    "🎙️ Click Start Answer and speak."
                );

            };


        window.speechSynthesis.speak(
            speech
        );

    }


    // =====================================================
    // START INTERVIEW
    // =====================================================

    if (startBtn) {

        startBtn.addEventListener(
            "click",
            async function () {

                console.log(
                    "🚀 START INTERVIEW CLICKED"
                );


                interviewStarted = true;

                currentQuestion = 0;

                questions = [...defaultQuestions];

                interviewAnswers = [];

                recognizedAnswer = "";


                startBtn.disabled = true;

                startBtn.textContent =
                    "Interview Started ✓";


                if (recordBtn) {
                    recordBtn.disabled = false;
                }


                if (stopBtn) {
                    stopBtn.disabled = true;
                }


                if (nextBtn) {
                    nextBtn.disabled = true;
                }


                updateQuestion();


                setText(
                    transcriptText,
                    "Listen to the AI question, then start your answer."
                );


                setText(
                    transcriptStatus,
                    "Ready"
                );


                setText(
                    recordingTimer,
                    "00:00"
                );


                setStatus(
                    "🔊 Listen to the interview question."
                );


                if (finalResult) {
                    finalResult.hidden = true;
                }


                // -----------------------------------------
                // BACKEND START
                // -----------------------------------------

                try {

                    const response =
                        await fetch(
                            "/api/interview/start",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        question_number: 1,

                                        question:
                                            questions[0].question,

                                        category:
                                            questions[0].category

                                    })
                            }
                        );


                    if (!response.ok) {

                        console.log(
                            "Interview start API:",
                            response.status
                        );

                    }

                }
                catch (error) {

                    console.log(
                        "Start API unavailable:",
                        error
                    );

                }


                // -----------------------------------------
                // SPEAK FIRST QUESTION
                // -----------------------------------------

                setTimeout(
                    function () {

                        speakQuestion();

                    },
                    500
                );

            }
        );

    }


    // =====================================================
    // START ANSWER BUTTON
    // =====================================================

    if (recordBtn) {

        recordBtn.addEventListener(
            "click",
            async function () {

                console.log(
                    "🎙️ START ANSWER CLICKED"
                );


                if (!interviewStarted) {

                    alert(
                        "Please click Start Interview first."
                    );

                    return;
                }


                if (recording || processing) {
                    return;
                }


                await startRecording();

            }
        );

    }


    // =====================================================
    // START RECORDING
    // =====================================================

  async function startRecording() {

    try {

        console.log("================================");
        console.log("🎙️ STARTING AUDIO RECORDING");
        console.log("================================");

        // Stop AI question voice
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        // Check microphone support
        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {
            throw new Error(
                "Your browser does not support microphone recording."
            );
        }

        // Request microphone
        audioStream =
            await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1
                }
            });

        console.log("✅ MICROPHONE ACCESS GRANTED");

        // Check audio tracks
        const tracks = audioStream.getAudioTracks();

        console.log("🎤 AUDIO TRACKS:", tracks.length);

        if (tracks.length === 0) {
            throw new Error(
                "No microphone audio track was detected."
            );
        }

        console.log(
            "🎤 MICROPHONE:",
            tracks[0].label
        );

        // Reset previous recording
        audioChunks = [];
        recognizedAnswer = "";

        if (lastAudioURL) {
            URL.revokeObjectURL(lastAudioURL);
            lastAudioURL = null;
        }

        if (audioPreview) {
            audioPreview.pause();
            audioPreview.removeAttribute("src");
            audioPreview.hidden = true;
        }

        setText(
            transcriptText,
            "🎙️ Recording your answer..."
        );

        setText(
            transcriptStatus,
            "Recording..."
        );

        // -----------------------------------------
        // FORCE WEBM / OPUS
        // -----------------------------------------

        let mimeType = "audio/webm;codecs=opus";

        if (!MediaRecorder.isTypeSupported(mimeType)) {

            console.warn(
                "audio/webm;codecs=opus not supported"
            );

            mimeType = "audio/webm";

        }

        if (!MediaRecorder.isTypeSupported(mimeType)) {

            throw new Error(
                "Your browser cannot create a supported WebM audio recording."
            );

        }

        console.log(
            "🎧 SELECTED MIME:",
            mimeType
        );

        // -----------------------------------------
        // CREATE RECORDER
        // -----------------------------------------

        mediaRecorder =
            new MediaRecorder(
                audioStream,
                {
                    mimeType: mimeType,
                    audioBitsPerSecond: 128000
                }
            );

        console.log(
            "🎧 ACTUAL RECORDER MIME:",
            mediaRecorder.mimeType
        );

        // -----------------------------------------
        // START EVENT
        // -----------------------------------------

        mediaRecorder.onstart =
            function () {

                recording = true;
                processing = false;

                if (recordBtn) {
                    recordBtn.disabled = true;
                    recordBtn.classList.add("recording");
                }

                if (stopBtn) {
                    stopBtn.disabled = false;
                }

                if (nextBtn) {
                    nextBtn.disabled = true;
                }

                setStatus(
                    "🔴 Recording... Speak now."
                );

                setText(
                    transcriptStatus,
                    "Recording..."
                );

                setText(
                    transcriptText,
                    "🎙️ Recording your answer..."
                );

                startTimer();

                console.log(
                    "🔴 MEDIA RECORDER STARTED"
                );

            };

        // -----------------------------------------
        // AUDIO DATA
        // -----------------------------------------

        mediaRecorder.ondataavailable =
            function (event) {

                console.log(
                    "📦 AUDIO CHUNK:",
                    event.data ? event.data.size : 0
                );

                if (
                    event.data &&
                    event.data.size > 0
                ) {

                    audioChunks.push(
                        event.data
                    );

                }

            };

        // -----------------------------------------
        // RECORDER ERROR
        // -----------------------------------------

        mediaRecorder.onerror =
            function (event) {

                console.error(
                    "❌ MEDIA RECORDER ERROR:",
                    event
                );

                showError(
                    "Audio recording failed. Please try again."
                );

            };

        // -----------------------------------------
        // STOP
        // -----------------------------------------

        mediaRecorder.onstop =
            async function () {

                console.log(
                    "⏹ MEDIA RECORDER STOPPED"
                );

                recording = false;
                processing = true;

                clearTimer();

                if (stopBtn) {
                    stopBtn.disabled = true;
                }

                if (recordBtn) {
                    recordBtn.disabled = true;
                    recordBtn.classList.remove("recording");
                }

                setStatus(
                    "⏳ Processing your answer..."
                );

                setText(
                    transcriptStatus,
                    "Transcribing..."
                );

                setText(
                    transcriptText,
                    "🤖 AI is converting your voice to text..."
                );

                try {

                    await processRecording();

                }
                catch (error) {

                    console.error(
                        "❌ PROCESS RECORDING ERROR:",
                        error
                    );

                    showError(
                        error.message ||
                        "Unable to process your answer."
                    );

                }
                finally {

                    processing = false;

                    stopMicrophone();

                }

            };

        // -----------------------------------------
        // START RECORDING
        // -----------------------------------------

        mediaRecorder.start(250);

        console.log(
            "🎙️ RECORDING STARTED"
        );

    }
    catch (error) {

        console.error(
            "❌ START RECORDING ERROR:",
            error
        );

        showError(
            getMicrophoneError(error)
        );

    }

}


    // =====================================================
    // STOP RECORDING
    // =====================================================

    async function stopRecording() {

        if (!mediaRecorder) {
            return;
        }


        if (
            mediaRecorder.state !== "recording"
        ) {

            return;

        }


        setStatus(
            "⏳ Stopping recording..."
        );


        try {

            mediaRecorder.requestData();

        }
        catch (error) {

            console.log(
                "requestData skipped:",
                error
            );

        }


        mediaRecorder.stop();

    }


    // =====================================================
    // PROCESS RECORDING
    // =====================================================

   
async function processRecording() {

    console.log("================================");
    console.log("🎧 PROCESSING AUDIO");
    console.log("================================");

    if (!audioChunks || audioChunks.length === 0) {

        throw new Error(
            "No audio was recorded. Please try again."
        );

    }

    console.log(
        "AUDIO CHUNKS:",
        audioChunks.length
    );

    // -----------------------------------------
    // CREATE FINAL WEBM AUDIO
    // -----------------------------------------

    const audioBlob =
        new Blob(
            audioChunks,
            {
                type: "audio/webm"
            }
        );

    console.log(
        "AUDIO SIZE:",
        audioBlob.size
    );

    console.log(
        "AUDIO TYPE:",
        audioBlob.type
    );

    console.log(
        "QUESTION:",
        currentQuestion + 1
    );

    console.log("================================");

    // -----------------------------------------
    // CHECK AUDIO SIZE
    // -----------------------------------------

    if (audioBlob.size < 1000) {

        throw new Error(
            "Audio recording is empty or too short. Please speak for a few seconds."
        );

    }

    // -----------------------------------------
    // AUDIO PREVIEW
    // -----------------------------------------

    if (lastAudioURL) {

        URL.revokeObjectURL(
            lastAudioURL
        );

    }

    lastAudioURL =
        URL.createObjectURL(
            audioBlob
        );

    if (audioPreview) {

        audioPreview.hidden = false;
        audioPreview.controls = true;
        audioPreview.src = lastAudioURL;

        audioPreview.load();

        audioPreview.onloadedmetadata =
            function () {

                console.log(
                    "🎵 AUDIO DURATION:",
                    audioPreview.duration
                );

            };

        audioPreview.onerror =
            function (event) {

                console.error(
                    "❌ AUDIO PREVIEW ERROR:",
                    event
                );

            };

    }

    // -----------------------------------------
    // SEND TO FLASK
    // -----------------------------------------

    setStatus(
        "🤖 AI is transcribing your answer..."
    );

    setText(
        transcriptStatus,
        "Transcribing with Gemini..."
    );

    setText(
        transcriptText,
        "Please wait... Gemini is converting your voice to text."
    );

    const result =
        await uploadAnswer(
            audioBlob
        );

    console.log(
        "🤖 GEMINI TRANSCRIPTION RESPONSE:",
        result
    );

    // -----------------------------------------
    // GET TRANSCRIPT
    // -----------------------------------------

    const transcript =
        (
            result.transcript ||
            result.text ||
            result.answer ||
            ""
        ).trim();

    recognizedAnswer =
        transcript;

    // -----------------------------------------
    // DISPLAY TRANSCRIPT
    // -----------------------------------------

    if (recognizedAnswer) {

        setText(
            transcriptText,
            recognizedAnswer
        );

        setText(
            transcriptStatus,
            "Transcript ready ✓"
        );

        setStatus(
            "✅ Answer transcribed successfully."
        );

    }
    else {

        setText(
            transcriptText,
            "Gemini could not detect speech in this recording."
        );

        setText(
            transcriptStatus,
            "No speech detected"
        );

        setStatus(
            "⚠️ No speech detected."
        );

    }

    // -----------------------------------------
    // SAVE ANSWER
    // -----------------------------------------

    const currentQ =
        questions[currentQuestion];

    const answer = {

        question_number:
            currentQuestion + 1,

        question:
            currentQ
                ? currentQ.question
                : "",

        category:
            currentQ
                ? currentQ.category
                : "",

        transcript:
            recognizedAnswer,

        audio_size:
            audioBlob.size,

        created_at:
            new Date().toISOString()

    };

    interviewAnswers.push(
        answer
    );

    console.log(
        "ANSWER SAVED:",
        answer
    );

    // -----------------------------------------
    // AI EVALUATION
    // -----------------------------------------

    if (recognizedAnswer) {

        setStatus(
            "🤖 AI is evaluating your answer..."
        );

        setText(
            transcriptStatus,
            "AI Evaluation..."
        );

        await evaluateAnswer(
            recognizedAnswer
        );

    }

    // -----------------------------------------
    // ENABLE NEXT
    // -----------------------------------------

    if (nextBtn) {
        nextBtn.disabled = false;
    }

    if (recordBtn) {
        recordBtn.disabled = false;
    }

    setStatus(
        "✅ Answer recorded. Click Next Question."
    );

    setText(
        transcriptStatus,
        "Answer recorded ✓"
    );

}
    // =====================================================
    // UPLOAD ANSWER TO FLASK
    // =====================================================

    async function uploadAnswer(
        audioBlob
    ) {

        const formData =
            new FormData();


        // -----------------------------------------
        // FILE EXTENSION
        // -----------------------------------------

        let extension = "webm";


        if (
            audioBlob.type.includes("ogg")
        ) {

            extension = "ogg";

        }
        else if (
            audioBlob.type.includes("mp4")
        ) {

            extension = "mp4";

        }


        formData.append(
            "audio",
            audioBlob,
            `interview_answer.${extension}`
        );


        formData.append(
            "question_number",
            String(
                currentQuestion + 1
            )
        );


        const currentQ =
            questions[currentQuestion];


        if (currentQ) {

            formData.append(
                "question",
                currentQ.question
            );


            formData.append(
                "category",
                currentQ.category
            );

        }


        console.log("================================");
        console.log("UPLOADING AUDIO TO FLASK");
        console.log("Question:", currentQuestion + 1);
        console.log("Audio size:", audioBlob.size);
        console.log("Audio MIME:", audioBlob.type);
        console.log("================================");


        try {

            const response =
                await fetch(
                    "/api/interview/answer",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            let data = null;


            try {

                data =
                    await response.json();

            }
            catch (jsonError) {

                throw new Error(
                    `Server returned an invalid response. HTTP ${response.status}`
                );

            }


            console.log(
                "UPLOAD RESPONSE:",
                data
            );


            if (
                !response.ok ||
                !data.success
            ) {

                const serverError =
                    data.error ||
                    data.message ||
                    `Server error (${response.status})`;

                throw new Error(
                    serverError
                );

            }


            if (
                !data.transcript &&
                !data.text &&
                !data.answer
            ) {

                throw new Error(
                    "Gemini returned an empty transcript."
                );

            }


            return data;

        }
        catch (error) {

            console.error(
                "UPLOAD ERROR:",
                error
            );


            throw error;

        }

    }


    // =====================================================
    // AI EVALUATION
    // =====================================================

    async function evaluateAnswer(
        transcript
    ) {

        if (
            !transcript ||
            !transcript.trim()
        ) {

            return;

        }


        try {

            const q =
                questions[currentQuestion];


            if (!q) {
                return;
            }


            const response =
                await fetch(
                    "/api/interview/evaluate",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                question:
                                    q.question,

                                category:
                                    q.category,

                                answer:
                                    transcript,

                                question_number:
                                    currentQuestion + 1

                            })
                    }
                );


            if (!response.ok) {

                console.log(
                    "Evaluation API returned:",
                    response.status
                );

                return;

            }


            const data =
                await response.json();


            console.log(
                "AI EVALUATION:",
                data
            );


            updateEvaluationUI(
                data
            );

        }
        catch (error) {

            console.error(
                "EVALUATION ERROR:",
                error
            );

        }

    }


    // =====================================================
    // UPDATE EVALUATION UI
    // =====================================================

    function updateEvaluationUI(
        data
    ) {

        if (!data) {
            return;
        }


        const evaluation =
            data.evaluation ||
            data;


        setText(
            document.getElementById(
                "communicationScore"
            ),
            evaluation.communication ??
            evaluation.communication_score ??
            "--"
        );


        setText(
            document.getElementById(
                "technicalScore"
            ),
            evaluation.technical ??
            evaluation.technical_score ??
            "--"
        );


        setText(
            document.getElementById(
                "relevanceScore"
            ),
            evaluation.relevance ??
            evaluation.relevance_score ??
            "--"
        );


        setText(
            document.getElementById(
                "confidenceScore"
            ),
            evaluation.confidence ??
            evaluation.confidence_score ??
            "--"
        );


        setText(
            document.getElementById(
                "grammarScore"
            ),
            evaluation.grammar ??
            evaluation.grammar_score ??
            "--"
        );


        const feedback =
            evaluation.feedback ||
            evaluation.comment ||
            evaluation.improvement ||
            data.feedback ||
            "";


        if (
            feedback &&
            aiFeedback
        ) {

            aiFeedback.textContent =
                feedback;

        }


        console.log(
            "Evaluation UI updated."
        );

    }


    // =====================================================
    // NEXT QUESTION
    // =====================================================

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            async function () {

                if (
                    !interviewStarted
                ) {

                    return;

                }


                if (recording) {

                    alert(
                        "Please stop recording first."
                    );

                    return;

                }


                if (processing) {

                    alert(
                        "Please wait until your answer is processed."
                    );

                    return;

                }


                // -----------------------------------------
                // LAST QUESTION
                // -----------------------------------------

                if (
                    currentQuestion >=
                    questions.length - 1
                ) {

                    await finishInterview();

                    return;

                }


                // -----------------------------------------
                // SAVE PREVIOUS QUESTION DATA
                // -----------------------------------------

                const previousQuestion =
                    questions[currentQuestion];

                const previousAnswer =
                    recognizedAnswer;


                // -----------------------------------------
                // TEMP NEXT QUESTION INDEX
                // -----------------------------------------

                const nextQuestionIndex =
                    currentQuestion + 1;


                // -----------------------------------------
                // ASK BACKEND FOR NEXT QUESTION
                // -----------------------------------------

                setStatus(
                    "🤖 AI is preparing the next question..."
                );


                let generated =
                    null;


                try {

                    generated =
                        await getNextAIQuestion(
                            previousQuestion,
                            previousAnswer,
                            nextQuestionIndex
                        );

                }
                catch (error) {

                    console.log(
                        "Dynamic question failed:",
                        error
                    );

                }


                // -----------------------------------------
                // MOVE NEXT
                // -----------------------------------------

                currentQuestion =
                    nextQuestionIndex;


                recognizedAnswer =
                    "";


                if (nextBtn) {
                    nextBtn.disabled = true;
                }


                if (recordBtn) {
                    recordBtn.disabled = false;
                }


                updateQuestion();


                setText(
                    transcriptText,
                    "Listen to the next question."
                );


                setText(
                    transcriptStatus,
                    "Ready"
                );


                setText(
                    recordingTimer,
                    "00:00"
                );


                // -----------------------------------------
                // CLEAR AUDIO
                // -----------------------------------------

                if (audioPreview) {

                    try {

                        audioPreview.pause();

                    }
                    catch (_) {}


                    audioPreview.removeAttribute(
                        "src"
                    );


                    audioPreview.hidden =
                        true;

                }


                if (lastAudioURL) {

                    URL.revokeObjectURL(
                        lastAudioURL
                    );

                    lastAudioURL = null;

                }


                // -----------------------------------------
                // USE AI QUESTION
                // -----------------------------------------

                if (generated) {

                    questions[
                        currentQuestion
                    ] = generated;


                    updateQuestion();

                }


                setStatus(
                    "🔊 Listen to the next question."
                );


                // -----------------------------------------
                // SPEAK QUESTION
                // -----------------------------------------

                await wait(500);

                speakQuestion();

            }
        );

    }


    // =====================================================
    // AI NEXT QUESTION
    // =====================================================

    async function getNextAIQuestion(
        previousQuestion,
        previousAnswer,
        nextQuestionNumber
    ) {

        try {

            const response =
                await fetch(
                    "/api/interview/next-question",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                current_question:
                                    previousQuestion
                                        ? previousQuestion.question
                                        : "",

                                current_answer:
                                    previousAnswer || "",

                                question_number:
                                    nextQuestionNumber,

                                previous_answers:
                                    interviewAnswers

                            })
                    }
                );


            if (!response.ok) {

                console.log(
                    "Dynamic question API unavailable:",
                    response.status
                );

                return null;

            }


            const data =
                await response.json();


            console.log(
                "NEXT QUESTION API:",
                data
            );


            if (
                data.success &&
                data.question
            ) {

                return {

                    category:
                        data.category ||
                        "AI Interview",

                    question:
                        data.question

                };

            }

        }
        catch (error) {

            console.log(
                "AI next question error:",
                error
            );

        }


        return null;

    }


    // =====================================================
    // FINISH INTERVIEW
    // =====================================================

    async function finishInterview() {

        setStatus(
            "⏳ Preparing final AI interview report..."
        );


        setText(
            transcriptStatus,
            "Generating final report..."
        );


        if (recordBtn) {
            recordBtn.disabled = true;
        }


        if (nextBtn) {
            nextBtn.disabled = true;
        }


        try {

            const response =
                await fetch(
                    "/api/interview/finish",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                answers:
                                    interviewAnswers

                            })
                    }
                );


            const data =
                await response.json();


            console.log(
                "FINAL INTERVIEW RESULT:",
                data
            );


            if (
                data.success
            ) {

                showFinalResult(
                    data
                );

            }
            else {

                showFinalResult({

                    overall_score:
                        data.overall_score ??
                        "--",

                    message:
                        data.message ||
                        "Interview completed.",

                    feedback:
                        data.feedback ||
                        data.improvement ||
                        ""

                });

            }

        }
        catch (error) {

            console.error(
                "FINISH INTERVIEW ERROR:",
                error
            );


            showFinalResult({

                overall_score:
                    "--",

                message:
                    "Interview completed.",

                feedback:
                    "Your interview answers were recorded successfully."

            });

        }

    }


    // =====================================================
    // FINAL RESULT
    // =====================================================

    function showFinalResult(
        data
    ) {

        if (finalResult) {

            finalResult.hidden =
                false;

        }


        setText(
            overallScore,
            data.overall_score ??
            data.score ??
            "--"
        );


        setText(
            finalMessage,
            data.message ||
            "Interview completed successfully."
        );


        setText(
            aiFeedback,
            data.feedback ||
            data.improvement ||
            "Your interview has been completed."
        );


        setStatus(
            "🎉 Interview completed successfully."
        );


        if (recordBtn) {
            recordBtn.disabled = true;
        }


        if (stopBtn) {
            stopBtn.disabled = true;
        }


        if (nextBtn) {
            nextBtn.disabled = true;
        }


        if (questionText) {

            questionText.textContent =
                "Your AI interview has been completed. Your final evaluation is ready.";

        }


        window.scrollTo({

            top:
                document.body.scrollHeight,

            behavior:
                "smooth"

        });

    }


    // =====================================================
    // RESTART INTERVIEW
    // =====================================================

    if (restartBtn) {

        restartBtn.addEventListener(
            "click",
            function () {

                window.location.reload();

            }
        );

    }


    // =====================================================
    // RECORDING TIMER
    // =====================================================

    function startTimer() {

        clearTimer();


        recordingStartTime =
            Date.now();


        timerInterval =
            setInterval(
                function () {

                    const elapsed =
                        Math.floor(
                            (
                                Date.now() -
                                recordingStartTime
                            ) / 1000
                        );


                    const minutes =
                        String(
                            Math.floor(
                                elapsed / 60
                            )
                        ).padStart(
                            2,
                            "0"
                        );


                    const seconds =
                        String(
                            elapsed % 60
                        ).padStart(
                            2,
                            "0"
                        );


                    setText(
                        recordingTimer,
                        `${minutes}:${seconds}`
                    );

                },
                250
            );

    }


    function clearTimer() {

        if (timerInterval) {

            clearInterval(
                timerInterval
            );

            timerInterval = null;

        }

    }


    // =====================================================
    // STOP MICROPHONE
    // =====================================================

    function stopMicrophone() {

        if (!audioStream) {
            return;
        }


        audioStream
            .getTracks()
            .forEach(
                function (track) {

                    try {

                        track.stop();

                    }
                    catch (_) {}

                }
            );


        audioStream = null;

    }


    // =====================================================
    // ERROR
    // =====================================================

    function showError(
        message
    ) {

        console.error(
            "INTERVIEW ERROR:",
            message
        );


        recording = false;

        processing = false;


        clearTimer();


        stopMicrophone();


        if (recordBtn) {

            recordBtn.disabled =
                false;

        }


        if (stopBtn) {

            stopBtn.disabled =
                true;

        }


        if (nextBtn) {

            nextBtn.disabled =
                true;

        }


        setStatus(
            "❌ " + message
        );


        setText(
            transcriptStatus,
            "Error"
        );


        setText(
            transcriptText,
            message
        );

    }


    // =====================================================
    // MICROPHONE ERROR
    // =====================================================

    function getMicrophoneError(
        error
    ) {

        if (!error) {

            return (
                "Unable to access microphone."
            );

        }


        switch (
            error.name
        ) {

            case "NotAllowedError":

                return (
                    "Microphone permission denied. " +
                    "Please click Allow when Chrome asks for microphone access."
                );


            case "NotFoundError":

                return (
                    "No microphone was found. Please connect a microphone."
                );


            case "NotReadableError":

                return (
                    "Microphone is being used by another application."
                );


            case "SecurityError":

                return (
                    "Browser blocked microphone access."
                );


            case "AbortError":

                return (
                    "Microphone request was interrupted."
                );


            case "TypeError":

                return (
                    "Microphone access is not available in this browser."
                );


            default:

                return (
                    error.message ||
                    "Unable to access microphone."
                );

        }

    }


    // =====================================================
    // CLEANUP
    // =====================================================

    window.addEventListener(
        "beforeunload",
        function () {

            clearTimer();


            if (
                mediaRecorder &&
                mediaRecorder.state === "recording"
            ) {

                try {

                    mediaRecorder.stop();

                }
                catch (_) {}

            }


            stopMicrophone();


            if (lastAudioURL) {

                try {

                    URL.revokeObjectURL(
                        lastAudioURL
                    );

                }
                catch (_) {}

            }


            if (
                "speechSynthesis" in window
            ) {

                try {

                    window.speechSynthesis.cancel();

                }
                catch (_) {}

            }

        }
    );


    // =====================================================
    // INITIAL STATE
    // =====================================================

    if (recordBtn) {

        recordBtn.disabled =
            true;

    }


    if (stopBtn) {

        stopBtn.disabled =
            true;

    }


    if (nextBtn) {

        nextBtn.disabled =
            true;

    }


    setText(
        recordingTimer,
        "00:00"
    );


    setText(
        progressText,
        "1 / 10"
    );


    setWidth(
        progressFill,
        "10%"
    );


    setStatus(
        "Click Start Interview first."
    );


    setText(
        transcriptStatus,
        "Not started"
    );


    setText(
        transcriptText,
        "Start the interview to begin."
    );


    if (audioPreview) {

        audioPreview.hidden =
            true;

    }


    if (finalResult) {

        finalResult.hidden =
            true;

    }


    updateQuestion();


    // =====================================================
    // BROWSER SUPPORT LOG
    // =====================================================

    console.log(
        "========================================"
    );


    console.log(
        "✅ AI INTERVIEW READY"
    );


    console.log(
        "🎙️ Microphone:",
        navigator.mediaDevices
            ? "SUPPORTED"
            : "NOT SUPPORTED"
    );


    console.log(
        "🎤 Browser Speech Recognition:",
        "DISABLED - Gemini will transcribe audio"
    );


    console.log(
        "🔊 Speech Synthesis:",
        "speechSynthesis" in window
            ? "SUPPORTED"
            : "NOT SUPPORTED"
    );


    console.log(
        "🎧 MediaRecorder:",
        typeof MediaRecorder !==
        "undefined"
            ? "SUPPORTED"
            : "NOT SUPPORTED"
    );


    console.log(
        "🤖 Gemini Transcription:",
        "ENABLED THROUGH FLASK BACKEND"
    );


    console.log(
        "========================================"
    );

});