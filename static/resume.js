// ==========================================================
// RESUME AI ANALYSIS - COMPLETE UPDATED VERSION
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================================
    // GET HTML ELEMENTS
    // ======================================================

    const form = document.getElementById("resumeUploadForm");
    const fileInput = document.getElementById("resumeFile");
    const button = document.getElementById("analyzeBtn");

    if (!form || !fileInput || !button) {
        console.log("Resume upload elements not found.");
        return;
    }


    // ======================================================
    // FORM SUBMIT
    // ======================================================

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!fileInput.files || fileInput.files.length === 0) {
            alert("Please select your resume PDF.");
            return;
        }

        const file = fileInput.files[0];

        if (!file.name.toLowerCase().endsWith(".pdf")) {
            alert("Please upload a PDF resume.");
            return;
        }

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("Resume file must be smaller than 10 MB.");
            return;
        }

        const originalButtonText = button.innerHTML;

        button.disabled = true;

        button.innerHTML = `
            <span class="resume-loading-spinner"></span>
            AI is analyzing your resume...
        `;

        showResumeLoading();

        const formData = new FormData();
        formData.append("resume", file);

        try {

            console.log("Uploading resume...");
            console.log("File:", file.name);
            console.log("Size:", file.size, "bytes");

            const response = await fetch(
                "/api/analyze-resume",
                {
                    method: "POST",
                    body: formData
                }
            );

            let result;

            try {
                result = await response.json();
            } catch (jsonError) {
                throw new Error(
                    "Server returned an invalid response."
                );
            }

            console.log("Resume API response:", result);

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error ||
                    result.message ||
                    "Resume analysis failed."
                );
            }

            if (
                !result.analysis ||
                typeof result.analysis !== "object"
            ) {
                throw new Error(
                    "AI analysis data was not received."
                );
            }

            window.resumeAnalysis = result.analysis;

            console.log("====================================");
            console.log("RESUME ANALYSIS SUCCESS");
            console.log("====================================");

            console.log(
                "Candidate:",
                result.analysis.candidate_name
            );

            console.log(
                "Skills:",
                result.analysis.skills
            );

            console.log(
                "Skill Gaps:",
                result.analysis.skill_gaps
            );

            console.log(
                "Career Roles:",
                result.analysis.career_roles
            );

            console.log(
                "Roadmap:",
                result.analysis.roadmap
            );

            displayResumeAnalysis(result.analysis);

            hideResumeLoading();

            showResumeSuccess(
                "Resume analyzed successfully!"
            );

        } catch (error) {

            console.error(
                "===================================="
            );

            console.error(
                "RESUME ANALYSIS ERROR"
            );

            console.error(error);

            console.error(
                "===================================="
            );

            hideResumeLoading();

            showResumeError(
                error.message ||
                "Unable to analyze your resume."
            );

        } finally {

            button.disabled = false;
            button.innerHTML = originalButtonText;

        }

    });


    // ==========================================================
    // DISPLAY RESUME ANALYSIS
    // ==========================================================

    function displayResumeAnalysis(analysis) {

        if (!analysis) {
            return;
        }

        console.log("Displaying resume analysis...");


        // ======================================================
        // NORMALIZE DATA
        // ======================================================

        const candidateName =
            analysis.candidate_name || "Candidate";

        const email =
            analysis.email || "";

        const phone =
            analysis.phone || "";

        const summary =
            analysis.summary || "";

        const resumeScore =
            analysis.resume_score ??
            analysis.score ??
            "";

        const skills =
            Array.isArray(analysis.skills)
                ? analysis.skills
                : [];

        const programmingLanguages =
            Array.isArray(analysis.programming_languages)
                ? analysis.programming_languages
                : [];

        const frameworks =
            Array.isArray(analysis.frameworks)
                ? analysis.frameworks
                : [];

        const databases =
            Array.isArray(analysis.databases)
                ? analysis.databases
                : [];

        const tools =
            Array.isArray(analysis.tools)
                ? analysis.tools
                : [];

        const certifications =
            Array.isArray(analysis.certifications)
                ? analysis.certifications
                : [];

        const education =
            Array.isArray(analysis.education)
                ? analysis.education
                : [];

        const projects =
            Array.isArray(analysis.projects)
                ? analysis.projects
                : [];

        const experience =
            Array.isArray(analysis.experience)
                ? analysis.experience
                : [];

        const internships =
            Array.isArray(analysis.internships)
                ? analysis.internships
                : [];

        const skillGaps =
            Array.isArray(analysis.skill_gaps)
                ? analysis.skill_gaps
                : [];

        const careerRoles =
            Array.isArray(analysis.career_roles)
                ? analysis.career_roles
                : [];

        const roadmap =
            Array.isArray(analysis.roadmap)
                ? analysis.roadmap
                : [];


        // ======================================================
        // SHOW ANALYSIS PANEL
        // ======================================================

        const panel =
            document.querySelector(".analysis-panel") ||
            document.getElementById("analysisPanel");

        if (panel) {

            panel.classList.add("show");

            panel.classList.remove(
                "resume-analyzing"
            );

            panel.style.display = "block";
        }


        // ======================================================
        // BASIC INFORMATION
        // ======================================================

        updateElement(
            [
                "#candidateName",
                ".candidate-name",
                "[data-field='candidate-name']"
            ],
            candidateName
        );

        updateElement(
            [
                "#candidateEmail",
                ".candidate-email",
                "[data-field='email']"
            ],
            email
        );

        updateElement(
            [
                "#candidatePhone",
                ".candidate-phone",
                "[data-field='phone']"
            ],
            phone
        );

        updateElement(
            [
                "#resumeSummary",
                ".resume-summary",
                "[data-field='summary']"
            ],
            summary
        );


        // ======================================================
        // RESUME SCORE
        // ======================================================

        updateElement(
            [
                "#resumeScore",
                "[data-field='resume-score']"
            ],
            resumeScore !== ""
                ? String(resumeScore)
                : "--"
        );


        // ======================================================
        // SKILLS COUNT
        // ======================================================

        updateElement(
            [
                "#skillsCount",
                "[data-field='skills-count']"
            ],
            String(skills.length)
        );


        // ======================================================
        // CAREER MATCH COUNT
        // ======================================================

        updateElement(
            [
                "#careerMatches",
                "[data-field='career-matches']"
            ],
            String(careerRoles.length)
        );


        // ======================================================
        // CURRENT SKILLS
        // ======================================================

        renderSkillList(
            skills,
            [
                "#detectedSkills",
                ".detected-skills",
                ".skill-list",
                "#skillList"
            ]
        );


        // ======================================================
        // PROGRAMMING LANGUAGES
        // ======================================================

        renderSkillList(
            programmingLanguages,
            [
                "#programmingLanguages",
                ".programming-languages",
                "[data-section='programming-languages']"
            ]
        );


        // ======================================================
        // FRAMEWORKS
        // ======================================================

        renderSkillList(
            frameworks,
            [
                "#frameworks",
                ".frameworks",
                "[data-section='frameworks']"
            ]
        );


        // ======================================================
        // DATABASES
        // ======================================================

        renderSkillList(
            databases,
            [
                "#databases",
                ".databases",
                "[data-section='databases']"
            ]
        );


        // ======================================================
        // TOOLS
        // ======================================================

        renderSkillList(
            tools,
            [
                "#tools",
                ".tools",
                "[data-section='tools']"
            ]
        );


        // ======================================================
        // CERTIFICATIONS
        // ======================================================

        renderList(
            certifications,
            [
                "#certifications",
                ".certifications",
                "[data-section='certifications']"
            ]
        );


        // ======================================================
        // EDUCATION
        // ======================================================

        renderEducation(education);


        // ======================================================
        // PROJECTS
        // ======================================================

        renderProjects(projects);


        // ======================================================
        // EXPERIENCE
        // ======================================================

        renderExperience(experience);


        // ======================================================
        // INTERNSHIPS
        // ======================================================

        renderInternships(internships);


        // ======================================================
        // SKILLS TO LEARN
        // ======================================================

        renderSkillGaps(skillGaps);


        // ======================================================
        // CAREER ROLES
        // ======================================================

        renderCareerRoles(careerRoles);


        // ======================================================
        // CAREER ROADMAP
        // ======================================================

        renderRoadmap(roadmap);


        // ======================================================
        // SCROLL TO RESULT
        // ======================================================

        if (panel) {

            setTimeout(function () {

                panel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 300);
        }

    }


    // ==========================================================
    // UPDATE ELEMENT
    // ==========================================================

    function updateElement(selectors, value) {

        for (let i = 0; i < selectors.length; i++) {

            const element =
                document.querySelector(selectors[i]);

            if (element) {

                element.textContent =
                    value !== undefined &&
                    value !== null
                        ? value
                        : "";

                return true;
            }
        }

        return false;
    }


    // ==========================================================
    // RENDER SKILLS
    // ==========================================================

    function renderSkillList(
        skills,
        selectors
    ) {

        let container = null;

        for (let i = 0; i < selectors.length; i++) {

            container =
                document.querySelector(
                    selectors[i]
                );

            if (container) {
                break;
            }
        }

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !Array.isArray(skills) ||
            skills.length === 0
        ) {

            const empty =
                document.createElement("span");

            empty.textContent =
                "No skills detected";

            empty.className =
                "resume-empty-data";

            container.appendChild(empty);

            return;
        }

        skills.forEach(function (skill) {

            if (
                skill === null ||
                skill === undefined
            ) {
                return;
            }

            let skillText = "";

            if (typeof skill === "string") {
                skillText = skill;
            } else if (typeof skill === "object") {

                skillText =
                    skill.name ||
                    skill.skill ||
                    skill.title ||
                    "";

            }

            if (!skillText) {
                return;
            }

            const item =
                document.createElement("span");

            item.className =
                "resume-skill-tag";

            item.textContent =
                skillText;

            container.appendChild(item);

        });

    }


    // ==========================================================
    // RENDER SIMPLE LIST
    // ==========================================================

    function renderList(
        items,
        selectors
    ) {

        let container = null;

        for (let i = 0; i < selectors.length; i++) {

            container =
                document.querySelector(
                    selectors[i]
                );

            if (container) {
                break;
            }
        }

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            container.innerHTML = `
                <div class="resume-empty-data">
                    No information detected.
                </div>
            `;

            return;
        }

        items.forEach(function (item) {

            if (!item) {
                return;
            }

            const element =
                document.createElement("div");

            element.className =
                "resume-list-item";

            if (typeof item === "string") {

                element.textContent = item;

            } else {

                element.textContent =
                    item.name ||
                    item.title ||
                    item.certification ||
                    JSON.stringify(item);
            }

            container.appendChild(element);

        });

    }


    // ==========================================================
    // RENDER EDUCATION
    // ==========================================================

    function renderEducation(education) {

        const container =
            document.querySelector("#educationList") ||
            document.querySelector(".education-list");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !Array.isArray(education) ||
            education.length === 0
        ) {

            container.innerHTML = `
                <div class="resume-empty-data">
                    No education information detected.
                </div>
            `;

            return;
        }

        education.forEach(function (item) {

            item = item || {};

            const card =
                document.createElement("div");

            card.className =
                "resume-education-item";

            const degree =
                item.degree || "";

            const field =
                item.field || "";

            const institution =
                item.institution || "";

            const year =
                item.year || "";

            card.innerHTML = `
                <div class="resume-item-title">
                    ${escapeHTML(degree)}
                </div>

                <div class="resume-item-subtitle">
                    ${escapeHTML(field)}
                </div>

                <div class="resume-item-meta">
                    ${escapeHTML(institution)}
                    ${
                        year
                            ? " • " + escapeHTML(year)
                            : ""
                    }
                </div>
            `;

            container.appendChild(card);

        });

    }


    // ==========================================================
    // RENDER PROJECTS
    // ==========================================================

    function renderProjects(projects) {

        const container =
            document.querySelector("#projectsList") ||
            document.querySelector(".projects-list");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !Array.isArray(projects) ||
            projects.length === 0
        ) {

            container.innerHTML = `
                <div class="resume-empty-data">
                    No projects detected.
                </div>
            `;

            return;
        }

        projects.forEach(function (project) {

            project = project || {};

            const card =
                document.createElement("div");

            card.className =
                "resume-project-item";

            const name =
                project.name ||
                project.title ||
                "Project";

            const description =
                project.description ||
                "";

            const technologies =
                Array.isArray(project.technologies)
                    ? project.technologies
                    : [];

            card.innerHTML = `
                <div class="resume-item-title">
                    ${escapeHTML(name)}
                </div>

                <div class="resume-item-description">
                    ${escapeHTML(description)}
                </div>

                <div class="resume-project-technologies">
                    ${technologies
                        .map(function (tech) {

                            return `
                                <span class="resume-skill-tag">
                                    ${escapeHTML(String(tech))}
                                </span>
                            `;

                        })
                        .join("")
                    }
                </div>
            `;

            container.appendChild(card);

        });

    }


    // ==========================================================
    // RENDER EXPERIENCE
    // ==========================================================

    function renderExperience(experience) {

        const container =
            document.querySelector("#experienceList") ||
            document.querySelector(".experience-list");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !Array.isArray(experience) ||
            experience.length === 0
        ) {

            container.innerHTML = `
                <div class="resume-empty-data">
                    No professional experience detected.
                </div>
            `;

            return;
        }

        experience.forEach(function (item) {

            item = item || {};

            const card =
                document.createElement("div");

            card.className =
                "resume-experience-item";

            card.innerHTML = `
                <div class="resume-item-title">
                    ${escapeHTML(item.role || "")}
                </div>

                <div class="resume-item-subtitle">
                    ${escapeHTML(item.company || "")}
                </div>

                <div class="resume-item-meta">
                    ${escapeHTML(item.duration || "")}
                </div>

                <div class="resume-item-description">
                    ${escapeHTML(item.description || "")}
                </div>
            `;

            container.appendChild(card);

        });

    }


    // ==========================================================
    // RENDER INTERNSHIPS
    // ==========================================================

    function renderInternships(internships) {

        const container =
            document.querySelector("#internshipsList") ||
            document.querySelector(".internships-list");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !Array.isArray(internships) ||
            internships.length === 0
        ) {

            container.innerHTML = `
                <div class="resume-empty-data">
                    No internships detected.
                </div>
            `;

            return;
        }

        internships.forEach(function (item) {

            item = item || {};

            const card =
                document.createElement("div");

            card.className =
                "resume-internship-item";

            card.innerHTML = `
                <div class="resume-item-title">
                    ${escapeHTML(item.role || "")}
                </div>

                <div class="resume-item-subtitle">
                    ${escapeHTML(item.company || "")}
                </div>

                <div class="resume-item-meta">
                    ${escapeHTML(item.duration || "")}
                </div>

                ${
                    item.description
                        ? `
                            <div class="resume-item-description">
                                ${escapeHTML(item.description)}
                            </div>
                        `
                        : ""
                }
            `;

            container.appendChild(card);

        });

    }


    // ==========================================================
    // SHOW LOADING
    // ==========================================================

    function showResumeLoading() {

        const panel =
            document.querySelector(".analysis-panel") ||
            document.getElementById("analysisPanel");

        if (!panel) {
            return;
        }

        panel.classList.add(
            "show",
            "resume-analyzing"
        );

        panel.style.display = "flex";

        const loading =
            document.querySelector(
                ".resume-analysis-loading"
            );

        if (loading) {
            loading.style.display = "flex";
        }

        updateProgress(10);

    }


    // ==========================================================
    // HIDE LOADING
    // ==========================================================

    function hideResumeLoading() {

        const panel =
            document.querySelector(".analysis-panel") ||
            document.getElementById("analysisPanel");

        if (panel) {

            panel.classList.remove(
                "resume-analyzing"
            );

            panel.classList.add("show");

            panel.style.display = "block";
        }

        const loading =
            document.querySelector(
                ".resume-analysis-loading"
            );

        if (loading) {
            loading.style.display = "none";
        }

        updateProgress(100);

    }


    // ==========================================================
    // PROGRESS
    // ==========================================================

    function updateProgress(value) {

        const bar =
            document.getElementById("progressBar");

        const text =
            document.getElementById("progressText");

        if (bar) {
            bar.style.width =
                Math.min(100, value) + "%";
        }

        if (text) {
            text.textContent =
                Math.min(100, value) + "%";
        }

    }


    // ==========================================================
    // SUCCESS MESSAGE
    // ==========================================================

    function showResumeSuccess(message) {

        let box =
            document.querySelector(
                ".resume-status-message"
            );

        if (!box) {

            box =
                document.createElement("div");

            box.className =
                "resume-status-message";

            form.parentNode.insertBefore(
                box,
                form
            );
        }

        box.className =
            "resume-status-message success";

        box.textContent =
            "✓ " + message;

        setTimeout(function () {

            if (box && box.parentNode) {
                box.remove();
            }

        }, 4000);

    }


    // ==========================================================
    // ERROR MESSAGE
    // ==========================================================

    function showResumeError(message) {

        let box =
            document.querySelector(
                ".resume-status-message"
            );

        if (!box) {

            box =
                document.createElement("div");

            box.className =
                "resume-status-message";

            form.parentNode.insertBefore(
                box,
                form
            );
        }

        box.className =
            "resume-status-message error";

        box.textContent =
            "✕ " + message;

    }


    // ==========================================================
    // ESCAPE HTML
    // ==========================================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

    }

});


// ==========================================================
// SKILLS TO LEARN
// ==========================================================

function renderSkillGaps(skillGaps) {

    const container =
        document.getElementById("skillGap");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(skillGaps) ||
        skillGaps.length === 0
    ) {

        container.innerHTML = `
            <div class="resume-empty-data">
                No skill gaps returned by AI.
            </div>
        `;

        return;
    }

    skillGaps.forEach(function (item) {

        item = item || {};

        const card =
            document.createElement("div");

        card.className =
            "skill-gap-item";

        const skill =
            typeof item === "string"
                ? item
                : (
                    item.skill ||
                    item.name ||
                    item.title ||
                    "Skill"
                );

        const reason =
            typeof item === "object"
                ? (
                    item.reason ||
                    item.description ||
                    ""
                )
                : "";

        const priority =
            typeof item === "object"
                ? (
                    item.priority ||
                    ""
                )
                : "";

        card.innerHTML = `
            <div class="skill-gap-title">
                ${escapeHTMLGlobal(skill)}
            </div>

            ${
                reason
                    ? `
                        <div class="skill-gap-reason">
                            ${escapeHTMLGlobal(reason)}
                        </div>
                    `
                    : ""
            }

            ${
                priority
                    ? `
                        <span class="skill-gap-priority">
                            ${escapeHTMLGlobal(priority)}
                        </span>
                    `
                    : ""
            }
        `;

        container.appendChild(card);

    });

}


// ==========================================================
// CAREER ROLES
// ==========================================================

function renderCareerRoles(roles) {

    const container =
        document.getElementById("careerRoles");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(roles) ||
        roles.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-large">

                <div>🎯</div>

                <h3>
                    No career roles returned
                </h3>

                <p>
                    AI did not return career recommendations.
                </p>

            </div>
        `;

        return;
    }

    roles.forEach(function (item, index) {

        item = item || {};

        const card =
            document.createElement("div");

        card.className =
            "career-role-card";

        const role =
            typeof item === "string"
                ? item
                : (
                    item.role ||
                    item.title ||
                    item.name ||
                    "Career Role"
                );

        const reason =
            typeof item === "object"
                ? (
                    item.reason ||
                    item.description ||
                    ""
                )
                : "";

        let match =
            typeof item === "object"
                ? (
                    item.match ??
                    item.match_score ??
                    item.score ??
                    ""
                )
                : "";

        if (
            typeof match === "number" &&
            match <= 1
        ) {
            match = Math.round(match * 100);
        }

        card.innerHTML = `

            <div class="career-role-icon">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="career-role-body">

                <span>AI MATCH</span>

                <h3>
                    ${escapeHTMLGlobal(role)}
                </h3>

                ${
                    reason
                        ? `
                            <p>
                                ${escapeHTMLGlobal(reason)}
                            </p>
                        `
                        : ""
                }

                ${
                    match !== ""
                        ? `
                            <div class="career-match">
                                Match:
                                ${escapeHTMLGlobal(String(match))}
                                ${
                                    /^\d+(\.\d+)?$/.test(
                                        String(match)
                                    )
                                        ? "%"
                                        : ""
                                }
                            </div>
                        `
                        : ""
                }

            </div>
        `;

        container.appendChild(card);

    });

}


// ==========================================================
// CAREER ROADMAP
// ==========================================================

function renderRoadmap(roadmap) {

    const container =
        document.querySelector(".roadmap");

    if (!container) {
        return;
    }

    if (
        !Array.isArray(roadmap) ||
        roadmap.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-large">

                <div>🚀</div>

                <h3>
                    No roadmap returned
                </h3>

                <p>
                    AI did not return a career roadmap.
                </p>

            </div>
        `;

        return;
    }

    container.innerHTML =
        `<div class="roadmap-line"></div>`;


    roadmap.forEach(function (item, index) {

        item = item || {};

        const card =
            document.createElement("div");

        card.className =
            "roadmap-card";

        const phase =
            item.phase ||
            `PHASE ${index + 1}`;

        const title =
            item.title ||
            item.focus ||
            item.goal ||
            "Career Development";

        const duration =
            item.duration ||
            "";

        const skills =
            Array.isArray(item.skills)
                ? item.skills
                : [];

        const projects =
            Array.isArray(item.projects)
                ? item.projects
                : [];

        const actions =
            Array.isArray(item.actions)
                ? item.actions
                : [];

        card.innerHTML = `

            <div class="roadmap-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div>

                <span>
                    ${escapeHTMLGlobal(phase)}
                </span>

                <h3>
                    ${escapeHTMLGlobal(title)}
                </h3>

                ${
                    duration
                        ? `
                            <p>
                                <strong>Duration:</strong>
                                ${escapeHTMLGlobal(duration)}
                            </p>
                        `
                        : ""
                }

                ${
                    skills.length
                        ? `
                            <p>
                                <strong>Skills:</strong>
                                ${skills
                                    .map(function (skill) {
                                        return escapeHTMLGlobal(
                                            String(skill)
                                        );
                                    })
                                    .join(", ")
                                }
                            </p>
                        `
                        : ""
                }

                ${
                    projects.length
                        ? `
                            <p>
                                <strong>Projects:</strong>
                                ${projects
                                    .map(function (project) {
                                        return escapeHTMLGlobal(
                                            String(project)
                                        );
                                    })
                                    .join(", ")
                                }
                            </p>
                        `
                        : ""
                }

                ${
                    actions.length
                        ? `
                            <div class="roadmap-actions">
                                <strong>Actions:</strong>
                                <ul>
                                    ${actions
                                        .map(function (action) {
                                            return `
                                                <li>
                                                    ${escapeHTMLGlobal(
                                                        String(action)
                                                    )}
                                                </li>
                                            `;
                                        })
                                        .join("")
                                    }
                                </ul>
                            </div>
                        `
                        : ""
                }

            </div>
        `;

        container.appendChild(card);

    });

}


// ==========================================================
// GLOBAL HTML ESCAPE
// ==========================================================

function escapeHTMLGlobal(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}


// ==========================================================
// LIVE JOB SEARCH
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchButton =
            document.getElementById(
                "searchJobsBtn"
            );

        if (!searchButton) {
            return;
        }

        searchButton.addEventListener(
            "click",
            searchLiveJobs
        );

    }
);


// ==========================================================
// SEARCH LIVE JOBS
// ==========================================================

async function searchLiveJobs() {

    const container =
        document.getElementById(
            "jobsContainer"
        );

    const button =
        document.getElementById(
            "searchJobsBtn"
        );

    if (!container) {
        return;
    }

    const analysis =
        window.resumeAnalysis || {};

    const roles =
        Array.isArray(analysis.career_roles)
            ? analysis.career_roles
            : [];

    let role = "";

    if (roles.length > 0) {

        const first =
            roles[0];

        role =
            typeof first === "string"
                ? first
                : (
                    first.role ||
                    first.title ||
                    first.name ||
                    ""
                );
    }


    // Try to find job input fields
    const roleInput =
        document.querySelector(
            "#jobRole"
        ) ||
        document.querySelector(
            "[name='jobRole']"
        );

    const locationInput =
        document.querySelector(
            "#jobLocation"
        ) ||
        document.querySelector(
            "[name='jobLocation']"
        );

    const daysInput =
        document.querySelector(
            "#jobDays"
        ) ||
        document.querySelector(
            "[name='jobDays']"
        );


    if (
        roleInput &&
        roleInput.value.trim()
    ) {
        role = roleInput.value.trim();
    }


    const location =
        locationInput
            ? locationInput.value.trim()
            : "";


    const days =
        daysInput
            ? daysInput.value
            : "7";


    if (!role) {

        container.innerHTML = `
            <div class="empty-large">

                <div>💼</div>

                <h3>
                    No career role available
                </h3>

                <p>
                    Analyze your resume first or enter a job role.
                </p>

            </div>
        `;

        return;
    }


    button.disabled = true;

    button.textContent =
        "Searching...";


    container.innerHTML = `
        <div class="empty-large">

            <div>🔎</div>

            <h3>
                Finding live jobs...
            </h3>

            <p>
                Searching current job listings.
            </p>

        </div>
    `;


    try {

        const params =
            new URLSearchParams();

        params.set(
            "role",
            role
        );

        if (location) {

            params.set(
                "location",
                location
            );

        }

        params.set(
            "days",
            days
        );


        const response =
            await fetch(
                "/api/jobs?" +
                params.toString()
            );


        let result;

        try {

            result =
                await response.json();

        } catch (error) {

            throw new Error(
                "Invalid jobs API response."
            );

        }


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                result.message ||
                "Unable to load live jobs."
            );

        }


        const jobs =
            Array.isArray(result.jobs)
                ? result.jobs
                : [];


        renderJobs(
            jobs
        );


        const count =
            document.getElementById(
                "jobMatches"
            );

        if (count) {

            count.textContent =
                String(jobs.length);

        }

    } catch (error) {

        console.error(
            "Live jobs error:",
            error
        );

        container.innerHTML = `
            <div class="empty-large">

                <div>⚠️</div>

                <h3>
                    Jobs could not be loaded
                </h3>

                <p>
                    ${escapeHTMLGlobal(
                        error.message ||
                        "Please try again."
                    )}
                </p>

            </div>
        `;

    } finally {

        button.disabled = false;

        button.textContent =
            "Find Jobs →";

    }

}


// ==========================================================
// RENDER JOBS
// ==========================================================

function renderJobs(jobs) {

    const container =
        document.getElementById(
            "jobsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(jobs) ||
        jobs.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-large">

                <div>🔎</div>

                <h3>
                    No jobs found
                </h3>

                <p>
                    Try another role or location.
                </p>

            </div>
        `;

        return;
    }


    jobs.forEach(function (job) {

        job = job || {};

        const card =
            document.createElement("article");

        card.className =
            "job-card";


        const title =
            job.title ||
            job.name ||
            "Job Opportunity";

        const company =
            job.company ||
            job.company_name ||
            (
                job.company &&
                job.company.display_name
            ) ||
            "Company";


        const location =
            job.location ||
            job.location_name ||
            (
                job.location &&
                job.location.display_name
            ) ||
            "Location not specified";


        const salary =
            job.salary ||
            (
                job.salary_min ||
                job.salary_max
                    ? (
                        String(
                            job.salary_min || ""
                        ) +
                        " - " +
                        String(
                            job.salary_max || ""
                        )
                    )
                    : ""
            );


        const description =
            job.description ||
            "";


        const url =
            job.url ||
            job.redirect_url ||
            job.apply_url ||
            "#";


        card.innerHTML = `

            <div class="job-card-header">

                <div>

                    <span class="job-source">
                        LIVE JOB
                    </span>

                    <h3>
                        ${escapeHTMLGlobal(title)}
                    </h3>

                </div>

            </div>


            <div class="job-company">

                ${escapeHTMLGlobal(company)}

            </div>


            <div class="job-location">

                📍
                ${escapeHTMLGlobal(location)}

            </div>


            ${
                salary
                    ? `
                        <div class="job-salary">
                            💰
                            ${escapeHTMLGlobal(
                                String(salary)
                            )}
                        </div>
                    `
                    : ""
            }


            ${
                description
                    ? `
                        <p class="job-description">
                            ${escapeHTMLGlobal(
                                description
                            )}
                        </p>
                    `
                    : ""
            }


            ${
                url !== "#"
                    ? `
                        <a
                            class="job-apply-btn"
                            href="${escapeHTMLGlobal(url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Job →
                        </a>
                    `
                    : ""
            }

        `;


        container.appendChild(card);

    });

}


// ============================================================
// LIVE JOB SEARCH
// ============================================================

async function searchLiveJobs() {

    const roleInput =
        document.getElementById("jobRole");

    const locationInput =
        document.getElementById("jobLocation");

    const daysInput =
        document.getElementById("jobDays");

    const container =
        document.getElementById("jobsContainer");


    if (!container) {
        return;
    }


    let role =
        roleInput
            ? roleInput.value.trim()
            : "";

    let location =
        locationInput
            ? locationInput.value.trim()
            : "";

    let days =
        daysInput
            ? daysInput.value
            : "3";


    // --------------------------------------------------------
    // If role empty, use AI career recommendation
    // --------------------------------------------------------

    if (!role) {

        const analysis =
            window.resumeAnalysis;

        if (
            analysis &&
            Array.isArray(analysis.career_roles) &&
            analysis.career_roles.length > 0
        ) {

            const firstRole =
                analysis.career_roles[0];

            if (typeof firstRole === "string") {

                role = firstRole;

            } else {

                role =
                    firstRole.role ||
                    firstRole.title ||
                    "";
            }
        }
    }


    if (!role) {

        role = "software developer";
    }


    // --------------------------------------------------------
    // Loading UI
    // --------------------------------------------------------

    container.innerHTML = `

        <div class="empty-large">

            <div>⏳</div>

            <h3>
                Finding live jobs...
            </h3>

            <p>
                Searching current job listings for
                <strong>${escapeHTMLGlobal(role)}</strong>
            </p>

        </div>

    `;


    // --------------------------------------------------------
    // Build API URL
    // --------------------------------------------------------

    const params =
        new URLSearchParams({

            role: role,

            location: location,

            days: days

        });


    try {

        const response =
            await fetch(
                `/api/jobs?${params.toString()}`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Unable to load jobs."
            );
        }


        renderLiveJobs(
            data.jobs || []
        );


    } catch (error) {

        console.error(
            "LIVE JOB SEARCH ERROR:",
            error
        );


        container.innerHTML = `

            <div class="empty-large">

                <div>⚠️</div>

                <h3>
                    Jobs could not be loaded
                </h3>

                <p>
                    ${escapeHTMLGlobal(
                        error.message
                    )}
                </p>

            </div>

        `;
    }
}


document.addEventListener(
    "DOMContentLoaded",
    function() {

        const searchButton =
            document.getElementById(
                "searchJobsBtn"
            );

        if (!searchButton) {
            return;
        }

        searchButton.addEventListener(
            "click",
            function() {

                searchLiveJobs();

            }
        );

    }
);


function escapeHTMLGlobal(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttributeGlobal(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#039;");

}

// ==========================================================
// LIVE JOBS - RENDER JOB CARDS
// ==========================================================

function renderLiveJobs(jobs) {

    const container =
        document.getElementById("jobsContainer");

    if (!container) {
        console.error("jobsContainer not found");
        return;
    }

    // No jobs
    if (!Array.isArray(jobs) || jobs.length === 0) {

        container.innerHTML = `
            <div class="empty-large">

                <div>🔎</div>

                <h3>No matching jobs found</h3>

                <p>
                    Try another role or location.
                </p>

            </div>
        `;

        return;
    }


    // Clear old jobs
    container.innerHTML = "";


    // Create job cards
    jobs.forEach(function(job) {

        const card =
            document.createElement("article");

        card.className =
            "live-job-card";


        const title =
            job.title ||
            "Job Opportunity";


        const company =
            job.company ||
            "Company not specified";


        const location =
            job.location ||
            "Location not specified";


        const description =
            job.description ||
            "No description available.";


        const salary =
            job.salary ||
            "Salary not specified";


        const applyURL =
            job.apply_url ||
            "#";


        card.innerHTML = `

            <div class="job-card-top">

                <div class="job-company-icon">
                    💼
                </div>

                <div>

                    <span class="job-live-badge">
                        LIVE
                    </span>

                    <h3>
                        ${escapeHTMLGlobal(title)}
                    </h3>

                    <p class="job-company">
                        ${escapeHTMLGlobal(company)}
                    </p>

                </div>

            </div>


            <div class="job-details">

                <span>
                    📍 ${escapeHTMLGlobal(location)}
                </span>

                <span>
                    💰 ${escapeHTMLGlobal(salary)}
                </span>

                ${
                    job.contract_time
                        ? `
                            <span>
                                🕒 ${escapeHTMLGlobal(
                                    job.contract_time
                                )}
                            </span>
                          `
                        : ""
                }

            </div>


            <p class="job-description">

                ${escapeHTMLGlobal(
                    description.substring(0, 220)
                )}

                ${
                    description.length > 220
                        ? "..."
                        : ""
                }

            </p>


            <div class="job-card-footer">

                <small>
                    Current job listing
                </small>

                ${
                    applyURL !== "#"
                        ? `
                            <a
                                href="${escapeAttributeGlobal(applyURL)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="job-apply-btn"
                            >
                                Apply Now →
                            </a>
                          `
                        : `
                            <button
                                class="job-apply-btn"
                                disabled
                            >
                                Apply unavailable
                            </button>
                          `
                }

            </div>

        `;


        container.appendChild(card);

    });

}