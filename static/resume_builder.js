document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       GET ELEMENTS
    ========================================================= */

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const location = document.getElementById("location");
    const linkedin = document.getElementById("linkedin");
    const github = document.getElementById("github");
    const summary = document.getElementById("summary");
    const skills = document.getElementById("skills");

    const educationContainer =
        document.getElementById("educationContainer");

    const projectsContainer =
        document.getElementById("projectsContainer");

    const experienceContainer =
        document.getElementById("experienceContainer");

    const certificationContainer =
        document.getElementById("certificationContainer");


    /* =========================================================
       PERSONAL INFORMATION
    ========================================================= */

    const personalFields = [
        fullName,
        email,
        phone,
        location,
        linkedin,
        github,
        summary,
        skills
    ];


    personalFields.forEach(function (field) {

        if (field) {
            field.addEventListener("input", updatePreview);
        }

    });


    /* =========================================================
       ADD EDUCATION
    ========================================================= */

    const addEducationButton =
        document.getElementById("addEducation");

    if (addEducationButton) {

        addEducationButton.addEventListener("click", function () {

            const card = document.createElement("div");

            card.className = "dynamic-card education-item";

            card.innerHTML = `
                <div class="dynamic-card-header">
                    <strong>Education</strong>

                    <button
                        type="button"
                        class="remove-btn">
                        Remove
                    </button>
                </div>

                <div class="input-group">
                    <label>Degree</label>

                    <input
                        type="text"
                        class="education-degree"
                        placeholder="B.Tech in Computer Science">
                </div>

                <div class="input-group">
                    <label>College / University</label>

                    <input
                        type="text"
                        class="education-college"
                        placeholder="College Name">
                </div>

                <div class="input-group">
                    <label>Year</label>

                    <input
                        type="text"
                        class="education-year"
                        placeholder="2023 - 2027">
                </div>

                <div class="input-group">
                    <label>CGPA / Percentage</label>

                    <input
                        type="text"
                        class="education-score"
                        placeholder="8.5 CGPA">
                </div>
            `;

            educationContainer.appendChild(card);

            setupDynamicCard(card);

            updatePreview();

        });

    }


    /* =========================================================
       ADD PROJECT
    ========================================================= */

    const addProjectButton =
        document.getElementById("addProject");

    if (addProjectButton) {

        addProjectButton.addEventListener("click", function () {

            const card = document.createElement("div");

            card.className = "dynamic-card project-item";

            card.innerHTML = `
                <div class="dynamic-card-header">
                    <strong>Project</strong>

                    <button
                        type="button"
                        class="remove-btn">
                        Remove
                    </button>
                </div>

                <div class="input-group">
                    <label>Project Name</label>

                    <input
                        type="text"
                        class="project-name"
                        placeholder="Food Munch Restaurant">
                </div>

                <div class="input-group">
                    <label>Technologies</label>

                    <input
                        type="text"
                        class="project-tech"
                        placeholder="HTML, CSS, JavaScript, Flask">
                </div>

                <div class="input-group">
                    <label>Project Description</label>

                    <textarea
                        class="project-description"
                        rows="3"
                        placeholder="Describe your project..."></textarea>
                </div>
            `;

            projectsContainer.appendChild(card);

            setupDynamicCard(card);

            updatePreview();

        });

    }


    /* =========================================================
       ADD EXPERIENCE
    ========================================================= */

    const addExperienceButton =
        document.getElementById("addExperience");

    if (addExperienceButton) {

        addExperienceButton.addEventListener("click", function () {

            const card = document.createElement("div");

            card.className = "dynamic-card experience-item";

            card.innerHTML = `
                <div class="dynamic-card-header">
                    <strong>Experience / Internship</strong>

                    <button
                        type="button"
                        class="remove-btn">
                        Remove
                    </button>
                </div>

                <div class="input-group">
                    <label>Role</label>

                    <input
                        type="text"
                        class="experience-role"
                        placeholder="Python Intern">
                </div>

                <div class="input-group">
                    <label>Company</label>

                    <input
                        type="text"
                        class="experience-company"
                        placeholder="Company Name">
                </div>

                <div class="input-group">
                    <label>Duration</label>

                    <input
                        type="text"
                        class="experience-duration"
                        placeholder="June 2026 - August 2026">
                </div>

                <div class="input-group">
                    <label>Description</label>

                    <textarea
                        class="experience-description"
                        rows="3"
                        placeholder="Describe your work..."></textarea>
                </div>
            `;

            experienceContainer.appendChild(card);

            setupDynamicCard(card);

            updatePreview();

        });

    }


    /* =========================================================
       ADD CERTIFICATION
    ========================================================= */

    const addCertificationButton =
        document.getElementById("addCertification");

    if (addCertificationButton) {

        addCertificationButton.addEventListener(
            "click",
            function () {

                const card = document.createElement("div");

                card.className =
                    "dynamic-card certification-item";

                card.innerHTML = `
                    <div class="dynamic-card-header">
                        <strong>Certification</strong>

                        <button
                            type="button"
                            class="remove-btn">
                            Remove
                        </button>
                    </div>

                    <div class="input-group">
                        <label>Certification Name</label>

                        <input
                            type="text"
                            class="certification-name"
                            placeholder="Python Certification">
                    </div>

                    <div class="input-group">
                        <label>Organization</label>

                        <input
                            type="text"
                            class="certification-org"
                            placeholder="Infosys">
                    </div>

                    <div class="input-group">
                        <label>Year</label>

                        <input
                            type="text"
                            class="certification-year"
                            placeholder="2026">
                    </div>
                `;

                certificationContainer.appendChild(card);

                setupDynamicCard(card);

                updatePreview();

            }
        );

    }


    /* =========================================================
       DYNAMIC CARD EVENTS
    ========================================================= */

    function setupDynamicCard(card) {

        const inputs =
            card.querySelectorAll("input, textarea");

        inputs.forEach(function (input) {

            input.addEventListener(
                "input",
                updatePreview
            );

        });


        const removeButton =
            card.querySelector(".remove-btn");

        if (removeButton) {

            removeButton.addEventListener(
                "click",
                function () {

                    card.remove();

                    updatePreview();

                }
            );

        }

    }


    /* =========================================================
       UPDATE MAIN PREVIEW
    ========================================================= */

    function updatePreview() {

        const previewName =
            document.getElementById("previewName");

        const previewContact =
            document.getElementById("previewContact");

        const previewLinks =
            document.getElementById("previewLinks");

        const previewSummary =
            document.getElementById("previewSummary");

        const previewSkills =
            document.getElementById("previewSkills");

        const saveStatus =
            document.getElementById("saveStatus");


        /* NAME */

        if (previewName) {

            previewName.textContent =
                fullName.value.trim() || "Your Name";

        }


        /* CONTACT */

        let contact = [];

        if (email.value.trim()) {
            contact.push(email.value.trim());
        }

        if (phone.value.trim()) {
            contact.push(phone.value.trim());
        }

        if (location.value.trim()) {
            contact.push(location.value.trim());
        }


        if (previewContact) {

            previewContact.textContent =
                contact.length
                    ? contact.join(" | ")
                    : "email@example.com | +91 XXXXX XXXXX";

        }


        /* LINKS */

        let links = [];

        if (linkedin.value.trim()) {
            links.push(linkedin.value.trim());
        }

        if (github.value.trim()) {
            links.push(github.value.trim());
        }


        if (previewLinks) {

            previewLinks.textContent =
                links.length
                    ? links.join(" | ")
                    : "LinkedIn | GitHub";

        }


        /* SUMMARY */

        if (previewSummary) {

            previewSummary.textContent =
                summary.value.trim() ||
                "Your professional summary will appear here.";

        }


        /* SKILLS */

        if (previewSkills) {

            previewSkills.textContent =
                skills.value.trim() ||
                "Your skills will appear here.";

        }


        /* OTHER SECTIONS */

        updateEducationPreview();

        updateProjectPreview();

        updateExperiencePreview();

        updateCertificationPreview();


        if (saveStatus) {

            saveStatus.textContent =
                "Preview Updated";

        }

    }


    /* =========================================================
       EDUCATION PREVIEW
    ========================================================= */

    function updateEducationPreview() {

        const container =
            document.getElementById("previewEducation");

        if (!container) {
            return;
        }


        const items =
            document.querySelectorAll(".education-item");


        container.innerHTML = "";


        if (!items.length) {

            container.innerHTML = `
                <p class="empty-text">
                    Education details will appear here.
                </p>
            `;

            return;
        }


        items.forEach(function (item) {

            const degreeElement =
                item.querySelector(".education-degree");

            const collegeElement =
                item.querySelector(".education-college");

            const yearElement =
                item.querySelector(".education-year");

            const scoreElement =
                item.querySelector(".education-score");


            const degree =
                degreeElement
                    ? degreeElement.value.trim()
                    : "";

            const college =
                collegeElement
                    ? collegeElement.value.trim()
                    : "";

            const year =
                yearElement
                    ? yearElement.value.trim()
                    : "";

            const score =
                scoreElement
                    ? scoreElement.value.trim()
                    : "";


            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `
                <div class="preview-item-title">
                    ${escapeHTML(degree || "Degree")}
                </div>

                <div class="preview-item-subtitle">
                    ${escapeHTML(college || "College")}
                    ${year
                        ? " | " + escapeHTML(year)
                        : ""}
                    ${score
                        ? " | " + escapeHTML(score)
                        : ""}
                </div>
            `;


            container.appendChild(div);

        });

    }


    /* =========================================================
       PROJECT PREVIEW
    ========================================================= */

    function updateProjectPreview() {

        const container =
            document.getElementById("previewProjects");

        if (!container) {
            return;
        }


        const items =
            document.querySelectorAll(".project-item");


        container.innerHTML = "";


        if (!items.length) {

            container.innerHTML = `
                <p class="empty-text">
                    Projects will appear here.
                </p>
            `;

            return;
        }


        items.forEach(function (item) {

            const nameElement =
                item.querySelector(".project-name");

            const techElement =
                item.querySelector(".project-tech");

            const descriptionElement =
                item.querySelector(".project-description");


            const name =
                nameElement
                    ? nameElement.value.trim()
                    : "";

            const tech =
                techElement
                    ? techElement.value.trim()
                    : "";

            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";


            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `
                <div class="preview-item-title">
                    ${escapeHTML(name || "Project Name")}
                </div>

                <div class="preview-item-subtitle">
                    ${escapeHTML(tech || "Technologies")}
                </div>

                <div class="preview-item-description">
                    ${escapeHTML(
                        description ||
                        "Project description"
                    )}
                </div>
            `;


            container.appendChild(div);

        });

    }


    /* =========================================================
       EXPERIENCE PREVIEW
    ========================================================= */

    function updateExperiencePreview() {

        const container =
            document.getElementById("previewExperience");

        if (!container) {
            return;
        }


        const items =
            document.querySelectorAll(".experience-item");


        container.innerHTML = "";


        if (!items.length) {

            container.innerHTML = `
                <p class="empty-text">
                    Experience will appear here.
                </p>
            `;

            return;
        }


        items.forEach(function (item) {

            const roleElement =
                item.querySelector(".experience-role");

            const companyElement =
                item.querySelector(".experience-company");

            const durationElement =
                item.querySelector(".experience-duration");

            const descriptionElement =
                item.querySelector(".experience-description");


            const role =
                roleElement
                    ? roleElement.value.trim()
                    : "";

            const company =
                companyElement
                    ? companyElement.value.trim()
                    : "";

            const duration =
                durationElement
                    ? durationElement.value.trim()
                    : "";

            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";


            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `
                <div class="preview-item-title">
                    ${escapeHTML(role || "Role")}
                </div>

                <div class="preview-item-subtitle">
                    ${escapeHTML(company || "Company")}
                    ${duration
                        ? " | " + escapeHTML(duration)
                        : ""}
                </div>

                <div class="preview-item-description">
                    ${escapeHTML(
                        description ||
                        "Experience description"
                    )}
                </div>
            `;


            container.appendChild(div);

        });

    }


    /* =========================================================
       CERTIFICATION PREVIEW
    ========================================================= */

    function updateCertificationPreview() {

        const container =
            document.getElementById(
                "previewCertifications"
            );

        if (!container) {
            return;
        }


        const items =
            document.querySelectorAll(
                ".certification-item"
            );


        container.innerHTML = "";


        if (!items.length) {

            container.innerHTML = `
                <p class="empty-text">
                    Certifications will appear here.
                </p>
            `;

            return;
        }


        items.forEach(function (item) {

            const nameElement =
                item.querySelector(
                    ".certification-name"
                );

            const organizationElement =
                item.querySelector(
                    ".certification-org"
                );

            const yearElement =
                item.querySelector(
                    ".certification-year"
                );


            const name =
                nameElement
                    ? nameElement.value.trim()
                    : "";

            const organization =
                organizationElement
                    ? organizationElement.value.trim()
                    : "";

            const year =
                yearElement
                    ? yearElement.value.trim()
                    : "";


            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `
                <div class="preview-item-title">
                    ${escapeHTML(
                        name || "Certification"
                    )}
                </div>

                <div class="preview-item-subtitle">
                    ${escapeHTML(
                        organization || "Organization"
                    )}
                    ${year
                        ? " | " + escapeHTML(year)
                        : ""}
                </div>
            `;


            container.appendChild(div);

        });

    }


    /* =========================================================
       CLEAR RESUME
    ========================================================= */

    const clearButton =
        document.getElementById("clearResume");


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to clear the resume?"
                    );


                if (!confirmed) {
                    return;
                }


                personalFields.forEach(function (field) {

                    if (field) {
                        field.value = "";
                    }

                });


                if (educationContainer) {
                    educationContainer.innerHTML = "";
                }

                if (projectsContainer) {
                    projectsContainer.innerHTML = "";
                }

                if (experienceContainer) {
                    experienceContainer.innerHTML = "";
                }

                if (certificationContainer) {
                    certificationContainer.innerHTML = "";
                }


                updatePreview();

            }
        );

    }


    /* =========================================================
       LOAD EXTERNAL SCRIPT
    ========================================================= */

    function loadScript(src, checkFunction) {

        return new Promise(function (resolve, reject) {

            /*
             * Already loaded
             */
            if (checkFunction()) {
                resolve();
                return;
            }


            /*
             * Check if script is already loading
             */
            const existingScript =
                document.querySelector(
                    'script[src="' + src + '"]'
                );


            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    resolve,
                    { once: true }
                );

                existingScript.addEventListener(
                    "error",
                    reject,
                    { once: true }
                );

                return;
            }


            /*
             * Create script dynamically
             */
            const script =
                document.createElement("script");


            script.src = src;

            script.async = true;


            script.onload = function () {
                resolve();
            };


            script.onerror = function () {

                reject(
                    new Error(
                        "Could not load: " + src
                    )
                );

            };


            document.head.appendChild(script);

        });

    }


    /* =========================================================
       DOWNLOAD RESUME AS PDF
       ONLY #resumePreview WILL BE DOWNLOADED
    ========================================================= */

    async function downloadResumeAsPDF() {

        const resume =
            document.getElementById("resumePreview");


        if (!resume) {

            alert(
                "Resume preview not found."
            );

            return;
        }


        const downloadButton =
            document.getElementById(
                "downloadResume"
            );


        const originalText =
            downloadButton
                ? downloadButton.textContent
                : "";


        try {

            /*
             * Button loading state
             */

            if (downloadButton) {

                downloadButton.disabled = true;

                downloadButton.textContent =
                    "Creating PDF...";

            }


            /*
             * Load html2canvas
             */

            await loadScript(
                "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",

                function () {

                    return (
                        typeof window.html2canvas ===
                        "function"
                    );

                }
            );


            /*
             * Load jsPDF
             */

            await loadScript(
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",

                function () {

                    return (
                        window.jspdf &&
                        typeof window.jspdf.jsPDF ===
                        "function"
                    );

                }
            );


            /*
             * Capture ONLY resumePreview
             *
             * This is the important part.
             *
             * We DO NOT use:
             * window.print()
             *
             * We DO NOT capture:
             * document.body
             *
             * We ONLY capture:
             * #resumePreview
             */

            const canvas =
                await window.html2canvas(
                    resume,
                    {
                        scale: 2,

                        useCORS: true,

                        backgroundColor:
                            "#ffffff",

                        logging: false,

                        allowTaint: false
                    }
                );


            /*
             * Convert canvas to image
             */

            const imageData =
                canvas.toDataURL(
                    "image/jpeg",
                    0.95
                );


            /*
             * Create PDF
             */

            const jsPDF =
                window.jspdf.jsPDF;


            const pdf =
                new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                    compress: true
                });


            /*
             * A4 dimensions
             */

            const pageWidth = 210;
            const pageHeight = 297;

            const margin = 8;


            const pdfWidth =
                pageWidth - (margin * 2);

            const pdfHeight =
                pageHeight - (margin * 2);


            /*
             * Calculate image height
             */

            const imageHeight =
                (
                    canvas.height *
                    pdfWidth
                ) / canvas.width;


            /*
             * Multiple pages
             */

            let remainingHeight =
                imageHeight;

            let pageNumber = 0;


            while (remainingHeight > 0) {

                /*
                 * Add page after first page
                 */

                if (pageNumber > 0) {

                    pdf.addPage();

                }


                /*
                 * Move image upward
                 * for next PDF page.
                 */

                const yPosition =
                    margin -
                    (pageNumber * pdfHeight);


                pdf.addImage(
                    imageData,
                    "JPEG",

                    margin,
                    yPosition,

                    pdfWidth,
                    imageHeight,

                    undefined,
                    "FAST"
                );


                remainingHeight -=
                    pdfHeight;


                pageNumber++;

            }


            /*
             * Download PDF
             */

            pdf.save(
                "my_resume.pdf"
            );


        } catch (error) {

            console.error(
                "Resume PDF download error:",
                error
            );


            alert(
                "Resume could not be downloaded. " +
                "Please check your internet connection and try again."
            );


        } finally {

            /*
             * Restore button
             */

            if (downloadButton) {

                downloadButton.disabled = false;

                downloadButton.textContent =
                    originalText;

            }

        }

    }


    /* =========================================================
       DOWNLOAD BUTTON
       ONLY ONE EVENT LISTENER
    ========================================================= */

    const downloadButton =
        document.getElementById(
            "downloadResume"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            downloadResumeAsPDF
        );

    }


    /* =========================================================
       ESCAPE HTML
       SECURITY
    ========================================================= */

    function escapeHTML(value) {

        return String(value)

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


    /* =========================================================
       INITIAL PREVIEW
    ========================================================= */

    updatePreview();

});