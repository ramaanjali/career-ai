"use strict";


/* =========================================================
   CAREER AI ASSISTANT
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           DOM
        ====================================================== */

        const messagesContainer =
            document.getElementById(
                "messagesContainer"
            );

        const welcomeScreen =
            document.getElementById(
                "welcomeScreen"
            );

        const chatForm =
            document.getElementById(
                "chatForm"
            );

        const messageInput =
            document.getElementById(
                "messageInput"
            );

        const sendButton =
            document.getElementById(
                "sendButton"
            );

        const typingIndicator =
            document.getElementById(
                "typingIndicator"
            );

        const newChatButton =
            document.getElementById(
                "newChatButton"
            );

        const clearChatButton =
            document.getElementById(
                "clearChatButton"
            );

        const chatSearch =
            document.getElementById(
                "chatSearch"
            );

        const chatList =
            document.getElementById(
                "chatList"
            );

        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );

        const sidebar =
            document.getElementById(
                "assistantSidebar"
            );


        /* =====================================================
           STATE
        ====================================================== */

        let chatId =
            localStorage.getItem(
                "careerAI_chat_id"
            ) || "";


        let messages = [];


        let sending = false;


        let chats = [];


        /* =====================================================
           AVATAR PATHS
        ====================================================== */

        const AI_AVATAR =
            "/static/images/ai-robot.png";


        const USER_AVATAR =
            "/static/images/user-girl.png";


        /* =====================================================
           LOAD LOCAL CHAT HISTORY
        ====================================================== */

        function loadLocalChats() {

            try {

                const saved =
                    localStorage.getItem(
                        "careerAI_chats"
                    );


                if (saved) {

                    chats =
                        JSON.parse(saved);

                }

            }

            catch (error) {

                console.error(
                    "CHAT HISTORY LOAD ERROR:",
                    error
                );

                chats = [];

            }


            renderChatList();

        }


        /* =====================================================
           SAVE LOCAL CHATS
        ====================================================== */

        function saveLocalChats() {

            try {

                localStorage.setItem(
                    "careerAI_chats",
                    JSON.stringify(chats)
                );

            }

            catch (error) {

                console.error(
                    "CHAT HISTORY SAVE ERROR:",
                    error
                );

            }

        }


        /* =====================================================
           CREATE CHAT ID
        ====================================================== */

        function createLocalChatId() {

            return (
                "chat_" +
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .slice(2, 8)
            );

        }


        /* =====================================================
           RENDER CHAT LIST
        ====================================================== */

       function renderChatList(filter = "") {

    if (!chatList) {
        return;
    }

    chatList.innerHTML = "";

    const search = filter
        .trim()
        .toLowerCase();

    const filtered = chats.filter(function (chat) {

        return (
            !search ||
            (chat.title || "")
                .toLowerCase()
                .includes(search)
        );

    });


    if (filtered.length === 0) {

        chatList.innerHTML = `
            <div class="chat-empty">
                No previous chats
            </div>
        `;

        return;
    }


    filtered
        .slice()
        .reverse()
        .forEach(function (chat) {

            /* =========================================
               CHAT ITEM
            ========================================= */

            const item =
                document.createElement("div");

            item.className = "chat-item";


            if (chat.id === chatId) {

                item.classList.add("active");

            }


            /* =========================================
               OPEN CHAT BUTTON
            ========================================= */

            const openButton =
                document.createElement("button");

            openButton.type = "button";

            openButton.className =
                "chat-open-button";


            openButton.innerHTML = `

                <div class="chat-item-icon">
                    💬
                </div>

                <div class="chat-item-text">

                    <div class="chat-item-title">
                        ${escapeHTML(
                            chat.title || "New Chat"
                        )}
                    </div>

                    <div class="chat-item-date">
                        ${formatDate(
                            chat.updatedAt
                        )}
                    </div>

                </div>

            `;


            openButton.addEventListener(
                "click",
                function () {

                    loadChat(chat.id);

                }
            );


            /* =========================================
               DELETE BUTTON
            ========================================= */

            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className =
                "chat-delete-button";

            deleteButton.title =
                "Delete chat";

            deleteButton.innerHTML =
                "🗑";


            deleteButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    deleteChat(
                        chat.id
                    );

                }
            );


            /* =========================================
               ADD
            ========================================= */

            item.appendChild(
                openButton
            );

            item.appendChild(
                deleteButton
            );

            chatList.appendChild(
                item
            );

        });

}

        /* =====================================================
           FORMAT DATE
        ====================================================== */

        function formatDate(
            value
        ) {

            if (!value) {

                return "Today";

            }


            const date =
                new Date(value);


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return "Today";

            }


            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short"
                }
            );

        }


        /* =====================================================
           CREATE NEW CHAT
        ====================================================== */

        function createNewChat() {

    console.log(
        "NEW CHAT CLICKED"
    );


    /* =========================================
       CREATE NEW ID
    ========================================= */

    chatId =
        createLocalChatId();


    /* =========================================
       CLEAR CURRENT MESSAGES
    ========================================= */

    messages = [];


    /* =========================================
       SAVE NEW CHAT ID
    ========================================= */

    localStorage.setItem(
        "careerAI_chat_id",
        chatId
    );


    /* =========================================
       IMPORTANT:
       REBUILD CHAT AREA
    ========================================= */

    if (messagesContainer) {

        messagesContainer.innerHTML = "";

    }


    /* =========================================
       CREATE WELCOME SCREEN AGAIN
    ========================================= */

    const newWelcome =
        document.createElement("div");

    newWelcome.id =
        "welcomeScreen";

    newWelcome.className =
        "welcome-screen";


    newWelcome.innerHTML = `

        <div class="welcome-avatar">

            ✦

        </div>


        <h2>
            How can I help you today?
        </h2>


        <p>
            Ask me anything about careers,
            resumes, interviews, coding,
            projects, learning or general questions.
        </p>


        <div class="quick-prompts">


            <button
                class="quick-prompt"
                data-prompt="Review my resume and tell me how I can improve it."
            >

                <span class="prompt-icon">
                    📄
                </span>

                <span>

                    <strong>
                        Improve my resume
                    </strong>

                    <small>
                        Get resume improvement suggestions
                    </small>

                </span>

            </button>


            <button
                class="quick-prompt"
                data-prompt="Create a roadmap for becoming a full stack developer."
            >

                <span class="prompt-icon">
                    🚀
                </span>

                <span>

                    <strong>
                        Career roadmap
                    </strong>

                    <small>
                        Create a step-by-step career plan
                    </small>

                </span>

            </button>


            <button
                class="quick-prompt"
                data-prompt="Give me 10 important JavaScript interview questions with answers."
            >

                <span class="prompt-icon">
                    💻
                </span>

                <span>

                    <strong>
                        Interview preparation
                    </strong>

                    <small>
                        Practice important interview questions
                    </small>

                </span>

            </button>


            <button
                class="quick-prompt"
                data-prompt="Explain machine learning in a simple way with an example."
            >

                <span class="prompt-icon">
                    🧠
                </span>

                <span>

                    <strong>
                        Explain AI
                    </strong>

                    <small>
                        Learn AI concepts simply
                    </small>

                </span>

            </button>


        </div>

    `;


    messagesContainer.appendChild(
        newWelcome
    );


    /* =========================================
       QUICK PROMPTS FOR NEW WELCOME
    ========================================= */

    newWelcome
        .querySelectorAll(
            ".quick-prompt"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const prompt =
                        button.dataset.prompt;


                    messageInput.value =
                        prompt;


                    autoResize();


                    sendMessage(
                        prompt
                    );

                }
            );

        });


    /* =========================================
       UPDATE SIDEBAR
    ========================================= */

    renderChatList();


    /* =========================================
       FOCUS INPUT
    ========================================= */

    messageInput.focus();


    console.log(
        "NEW CHAT CREATED:",
        chatId
    );

}







       async function deleteChat(
    id
) {

    const chat =
        chats.find(function (item) {

            return item.id === id;

        });


    if (!chat) {

        return;

    }


    const confirmed =
        window.confirm(
            `Delete "${chat.title || "New Chat"}"?`
        );


    if (!confirmed) {

        return;

    }


    console.log(
        "Deleting chat:",
        id
    );


    /* =========================================
       REMOVE FROM LOCAL HISTORY
    ========================================= */

    chats =
        chats.filter(function (item) {

            return item.id !== id;

        });


    saveLocalChats();


    /* =========================================
       IF CURRENT CHAT WAS DELETED
    ========================================= */

    if (chatId === id) {

        messages = [];


        chatId =
            createLocalChatId();


        localStorage.setItem(
            "careerAI_chat_id",
            chatId
        );


        if (messagesContainer) {

            messagesContainer.innerHTML =
                "";

        }


        const newWelcome =
            document.createElement(
                "div"
            );


        newWelcome.id =
            "welcomeScreen";

        newWelcome.className =
            "welcome-screen";


        newWelcome.innerHTML = `

            <div class="welcome-avatar">
                ✦
            </div>

            <h2>
                How can I help you today?
            </h2>

            <p>
                Ask me anything about careers,
                resumes, interviews, coding,
                projects, learning or general questions.
            </p>

            <div class="quick-prompts">

                <button
                    class="quick-prompt"
                    data-prompt="Review my resume and tell me how I can improve it."
                >
                    📄 Improve my resume
                </button>

                <button
                    class="quick-prompt"
                    data-prompt="Create a roadmap for becoming a full stack developer."
                >
                    🚀 Career roadmap
                </button>

                <button
                    class="quick-prompt"
                    data-prompt="Give me 10 important JavaScript interview questions with answers."
                >
                    💻 Interview preparation
                </button>

                <button
                    class="quick-prompt"
                    data-prompt="Explain machine learning in a simple way with an example."
                >
                    🧠 Explain AI
                </button>

            </div>

        `;


        messagesContainer.appendChild(
            newWelcome
        );


        newWelcome
            .querySelectorAll(
                ".quick-prompt"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const prompt =
                            button.dataset.prompt;


                        messageInput.value =
                            prompt;


                        autoResize();


                        sendMessage(
                            prompt
                        );

                    }
                );

            });


        messageInput.focus();

    }


    renderChatList();

}
       
        /* =====================================================
           LOAD CHAT
        ====================================================== */

        function loadChat(
            id
        ) {

            const chat =
                chats.find(
                    function (item) {

                        return item.id === id;

                    }
                );


            if (!chat) {

                return;

            }


            chatId = id;


            messages =
                Array.isArray(
                    chat.messages
                )
                    ? chat.messages
                    : [];


            localStorage.setItem(
                "careerAI_chat_id",
                chatId
            );


            hideWelcome(
                messages.length > 0
            );


            renderMessages();


            renderChatList();


            scrollToBottom();

        }


        /* =====================================================
           SAVE CURRENT CHAT
        ====================================================== */

        function saveCurrentChat() {

            if (
                !chatId ||
                messages.length === 0
            ) {

                return;

            }


            const firstUser =
                messages.find(
                    function (message) {

                        return (
                            message.role ===
                            "user"
                        );

                    }
                );


            let title =
                firstUser
                    ? firstUser.content
                    : "New Chat";


            title =
                title
                    .replace(/\s+/g, " ")
                    .trim();


            if (
                title.length > 34
            ) {

                title =
                    title.slice(
                        0,
                        34
                    ) + "...";

            }


            const existingIndex =
                chats.findIndex(
                    function (chat) {

                        return (
                            chat.id ===
                            chatId
                        );

                    }
                );


            const data = {

                id: chatId,

                title: title || "New Chat",

                messages: messages,

                updatedAt:
                    new Date().toISOString()

            };


            if (
                existingIndex >= 0
            ) {

                chats[
                    existingIndex
                ] = data;

            }

            else {

                chats.push(
                    data
                );

            }


            saveLocalChats();

            renderChatList();

        }


        /* =====================================================
           SHOW WELCOME
        ====================================================== */

        function showWelcome() {

            if (!welcomeScreen) {

                return;

            }


            welcomeScreen.style.display =
                "flex";

        }


        /* =====================================================
           HIDE WELCOME
        ====================================================== */

        function hideWelcome(
            hide = true
        ) {

            if (!welcomeScreen) {

                return;

            }


            welcomeScreen.style.display =
                hide
                    ? "none"
                    : "flex";

        }


        /* =====================================================
           RENDER ALL MESSAGES
        ====================================================== */

        function renderMessages() {

            if (!messagesContainer) {

                return;

            }


            messagesContainer.innerHTML =
                "";


            if (
                messages.length === 0
            ) {

                showWelcome();

                return;

            }


            hideWelcome(true);


            messages.forEach(
                function (message) {

                    renderMessage(
                        message.role,
                        message.content,
                        false
                    );

                }
            );


            scrollToBottom();

        }


        /* =====================================================
           RENDER MESSAGE
        ====================================================== */

        function renderMessage(
            role,
            content,
            scroll = true
        ) {

            if (!messagesContainer) {

                return null;

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "message-row " +
                (
                    role === "user"
                        ? "user"
                        : "assistant"
                );


            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "message-avatar " +
                (
                    role === "user"
                        ? "user-avatar"
                        : "ai-avatar"
                );


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                role === "user"
                    ? USER_AVATAR
                    : AI_AVATAR;


            image.alt =
                role === "user"
                    ? "You"
                    : "AI Assistant";


            image.onerror =
                function () {

                    avatar.innerHTML =
                        role === "user"
                            ? "👩"
                            : "🤖";

                };


            avatar.appendChild(
                image
            );


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "message-content-wrapper";


            const contentBox =
                document.createElement(
                    "div"
                );


            contentBox.className =
                "message-content";


            if (
                role === "assistant"
            ) {

                contentBox.innerHTML =
                    renderMarkdown(
                        content
                    );

            }

            else {

                contentBox.textContent =
                    content;

            }


            wrapper.appendChild(
                contentBox
            );


            if (
                role === "assistant"
            ) {

                const actions =
                    document.createElement(
                        "div"
                    );


                actions.className =
                    "message-actions";


                const copyButton =
                    document.createElement(
                        "button"
                    );


                copyButton.type =
                    "button";


                copyButton.className =
                    "copy-message";


                copyButton.textContent =
                    "📋 Copy";


                copyButton.addEventListener(
                    "click",
                    async function () {

                        try {

                            await navigator.clipboard.writeText(
                                content
                            );


                            copyButton.textContent =
                                "✓ Copied";


                            setTimeout(
                                function () {

                                    copyButton.textContent =
                                        "📋 Copy";

                                },
                                1200
                            );

                        }

                        catch (error) {

                            console.error(
                                "COPY ERROR:",
                                error
                            );

                        }

                    }
                );


                actions.appendChild(
                    copyButton
                );


                wrapper.appendChild(
                    actions
                );

            }


            /*
             * User:
             * content -> avatar
             *
             * AI:
             * avatar -> content
             */

            if (
                role === "user"
            ) {

                row.appendChild(
                    wrapper
                );

                row.appendChild(
                    avatar
                );

            }

            else {

                row.appendChild(
                    avatar
                );

                row.appendChild(
                    wrapper
                );

            }


            messagesContainer.appendChild(
                row
            );


            if (scroll) {

                scrollToBottom();

            }


            return contentBox;

        }


        /* =====================================================
           MARKDOWN
        ====================================================== */

        function renderMarkdown(
            text
        ) {

            if (!text) {

                return "";

            }


            try {

                if (
                    window.marked
                ) {

                    const html =
                        marked.parse(
                            String(text)
                        );


                    if (
                        window.DOMPurify
                    ) {

                        return DOMPurify.sanitize(
                            html
                        );

                    }


                    return html;

                }

            }

            catch (error) {

                console.error(
                    "MARKDOWN ERROR:",
                    error
                );

            }


            return escapeHTML(
                String(text)
            ).replace(
                /\n/g,
                "<br>"
            );

        }


        /* =====================================================
           ESCAPE HTML
        ====================================================== */

        function escapeHTML(
            value
        ) {

            return String(
                value ?? ""
            )
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );

        }


        /* =====================================================
           SEND MESSAGE
        ====================================================== */

        async function sendMessage(
            rawMessage
        ) {

            const question =
                String(
                    rawMessage || ""
                ).trim();


            if (
                !question ||
                sending
            ) {

                return;

            }


            sending = true;


            setSendingState(
                true
            );


            hideWelcome(true);


            /*
             * USER MESSAGE
             */

            messages.push({

                role: "user",

                content: question

            });


            renderMessage(
                "user",
                question
            );


            saveCurrentChat();


            /*
             * SHOW THINKING
             */

            showTyping(
                true
            );


            /*
             * FORM DATA
             */

            const formData =
                new FormData();


            formData.append(
                "question",
                question
            );


            if (chatId) {

                formData.append(
                    "chat_id",
                    chatId
                );

            }


            try {

                console.log(
                    "Sending AI request:",
                    question
                );


                const response =
                    await fetch(
                        "/smart-ask",
                        {

                            method: "POST",

                            body: formData,

                            headers: {

                                "Accept":
                                    "application/json"

                            }

                        }
                    );


                let data;


                try {

                    data =
                        await response.json();

                }

                catch (jsonError) {

                    throw new Error(
                        "AI server returned an invalid response."
                    );

                }


                console.log(
                    "AI RESPONSE:",
                    data
                );


                if (
                    !response.ok ||
                    data.success === false
                ) {

                    throw new Error(
                        data.error ||
                        data.message ||
                        "AI request failed."
                    );

                }


                /*
                 * UPDATE SERVER CHAT ID
                 */

                if (
                    data.chat_id
                ) {

                    chatId =
                        data.chat_id;


                    localStorage.setItem(
                        "careerAI_chat_id",
                        chatId
                    );

                }


                /*
                 * IMAGE RESPONSE
                 */

                if (
                    data.type ===
                    "image"
                ) {

                    const answer =
                        data.answer ||
                        "I generated the requested image.";


                    messages.push({

                        role: "assistant",

                        content:
                            answer

                    });


                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "message-row assistant";


                    row.innerHTML = `

                        <div class="message-avatar ai-avatar">

                            <img
                                src="${AI_AVATAR}"
                                alt="AI Assistant"
                                onerror="this.parentElement.innerHTML='🤖';"
                            >

                        </div>

                        <div class="message-content-wrapper">

                            <div class="message-content">

                                ${renderMarkdown(
                                    answer
                                )}

                                ${
                                    data.image_url
                                        ? `
                                            <img
                                                class="ai-generated-image"
                                                src="${escapeHTML(
                                                    data.image_url
                                                )}"
                                                alt="AI generated image"
                                            >
                                          `
                                        : ""
                                }

                            </div>

                        </div>

                    `;


                    messagesContainer.appendChild(
                        row
                    );


                    scrollToBottom();

                    saveCurrentChat();

                    return;

                }


                /*
                 * TEXT RESPONSE
                 */

                const answer =
                    data.answer ||
                    data.response ||
                    data.message ||
                    "";


                if (!answer) {

                    throw new Error(
                        "AI returned an empty answer."
                    );

                }


                /*
                 * CREATE AI MESSAGE
                 */

                messages.push({

                    role: "assistant",

                    content:
                        answer

                });


                renderMessage(
                    "assistant",
                    answer
                );


                saveCurrentChat();

            }

            catch (error) {

                console.error(
                    "AI CHAT ERROR:",
                    error
                );


                const errorText =
                    error.message ||
                    "Something went wrong while connecting to CareerAI.";


                messages.push({

                    role: "assistant",

                    content:
                        errorText,

                    error: true

                });


                const contentBox =
                    renderMessage(
                        "assistant",
                        errorText
                    );


                if (contentBox) {

                    contentBox.classList.add(
                        "ai-error"
                    );

                }


                saveCurrentChat();

            }

            finally {

                showTyping(
                    false
                );


                setSendingState(
                    false
                );


                sending = false;


                messageInput.focus();

            }

        }


        /* =====================================================
           TYPING
        ====================================================== */

        function showTyping(
            show
        ) {

            if (!typingIndicator) {

                return;

            }


            typingIndicator.hidden =
                !show;


            if (show) {

                scrollToBottom();

            }

        }


        /* =====================================================
           SEND STATE
        ====================================================== */

        function setSendingState(
            value
        ) {

            if (sendButton) {

                sendButton.disabled =
                    value;

            }


            if (messageInput) {

                messageInput.disabled =
                    value;

            }

        }


        /* =====================================================
           SCROLL
        ====================================================== */

        function scrollToBottom() {

            if (!messagesContainer) {

                return;

            }


            requestAnimationFrame(
                function () {

                    messagesContainer.scrollTop =
                        messagesContainer.scrollHeight;

                }
            );

        }


        /* =====================================================
           CLEAR CHAT
        ====================================================== */

        function clearCurrentChat() {

            if (
                !messages.length
            ) {

                return;

            }


            const confirmed =
                window.confirm(
                    "Clear this conversation?"
                );


            if (!confirmed) {

                return;

            }


            messages = [];


            const index =
                chats.findIndex(
                    function (chat) {

                        return (
                            chat.id ===
                            chatId
                        );

                    }
                );


            if (
                index >= 0
            ) {

                chats.splice(
                    index,
                    1
                );

            }


            saveLocalChats();


            localStorage.removeItem(
                "careerAI_chat_id"
            );


            chatId =
                createLocalChatId();


            localStorage.setItem(
                "careerAI_chat_id",
                chatId
            );


            messagesContainer.innerHTML =
                "";


            messagesContainer.appendChild(
                welcomeScreen
            );


            showWelcome();


            renderChatList();


            messageInput.focus();

        }


        /* =====================================================
           QUICK PROMPTS
        ====================================================== */

        document
            .querySelectorAll(
                ".quick-prompt"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const prompt =
                                button.dataset.prompt;


                            if (
                                !prompt
                            ) {

                                return;

                            }


                            messageInput.value =
                                prompt;


                            autoResize();


                            sendMessage(
                                prompt
                            );

                        }
                    );

                }
            );


        /* =====================================================
           FORM SUBMIT
        ====================================================== */

        if (chatForm) {

            chatForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const message =
                        messageInput.value.trim();


                    if (!message) {

                        return;

                    }


                    messageInput.value =
                        "";


                    autoResize();


                    sendMessage(
                        message
                    );

                }
            );

        }


        /* =====================================================
           ENTER KEY
        ====================================================== */

        if (messageInput) {

            messageInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();


                        if (
                            !sending
                        ) {

                            chatForm.requestSubmit();

                        }

                    }

                }
            );


            messageInput.addEventListener(
                "input",
                autoResize
            );

        }


        /* =====================================================
           AUTO RESIZE TEXTAREA
        ====================================================== */

        function autoResize() {

            if (!messageInput) {

                return;

            }


            messageInput.style.height =
                "auto";


            messageInput.style.height =
                Math.min(
                    messageInput.scrollHeight,
                    150
                ) + "px";

        }


        /* =====================================================
           NEW CHAT
        ====================================================== */

        if (newChatButton) {

            newChatButton.addEventListener(
                "click",
                function () {

                    createNewChat();

                }
            );

        }


        /* =====================================================
           CLEAR
        ====================================================== */

        if (clearChatButton) {

            clearChatButton.addEventListener(
                "click",
                function () {

                    clearCurrentChat();

                }
            );

        }


        /* =====================================================
           SEARCH
        ====================================================== */

        if (chatSearch) {

            chatSearch.addEventListener(
                "input",
                function () {

                    renderChatList(
                        chatSearch.value
                    );

                }
            );

        }


        /* =====================================================
           MOBILE MENU
        ====================================================== */

        if (mobileMenuButton) {

            mobileMenuButton.addEventListener(
                "click",
                function () {

                    sidebar.classList.toggle(
                        "open"
                    );

                }
            );

        }


        /* =====================================================
           CLOSE MOBILE SIDEBAR
        ====================================================== */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    window.innerWidth > 850
                ) {

                    return;

                }


                if (
                    !sidebar.classList.contains(
                        "open"
                    )
                ) {

                    return;

                }


                if (
                    sidebar.contains(
                        event.target
                    ) ||
                    mobileMenuButton.contains(
                        event.target
                    )
                ) {

                    return;

                }


                sidebar.classList.remove(
                    "open"
                );

            }
        );


        /* =====================================================
           INITIALIZE
        ====================================================== */

        loadLocalChats();


        if (chatId) {

            const existingChat =
                chats.find(
                    function (chat) {

                        return (
                            chat.id ===
                            chatId
                        );

                    }
                );


            if (
                existingChat
            ) {

                messages =
                    existingChat.messages ||
                    [];


                renderMessages();

            }

            else {

                showWelcome();

            }

        }

        else {

            chatId =
                createLocalChatId();


            localStorage.setItem(
                "careerAI_chat_id",
                chatId
            );


            showWelcome();

        }


        messageInput.focus();


        console.log(
            "================================"
        );

        console.log(
            "CareerAI Assistant Ready"
        );

        console.log(
            "Backend: /smart-ask"
        );

        console.log(
            "Chat ID:",
            chatId
        );

        console.log(
            "================================"
        );


    }
);