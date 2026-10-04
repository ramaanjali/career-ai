/* =========================================================
   LEARNING HUB
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           COURSE DATA
        ===================================================== */

        const courses = [

            {
                id: "python",
                title: "Python Programming",
                category: "Software & IT",
                icon: "🐍",
                level: "Beginner",
                duration: "8 hours",
                lessons: 10,
                description:
                    "Learn Python from fundamentals to practical programming.",
                modules: [
                    {
                        title: "Introduction to Python",
                        lessons: [
                            {
                                id: "python-1",
                                title: "What is Python?",
                                content:
                                    "Python is a high-level, interpreted programming language known for its simple syntax and wide range of applications."
                            },
                            {
                                id: "python-2",
                                title: "Installing Python",
                                content:
                                    "Learn how to install Python and set up your development environment."
                            }
                        ]
                    },
                    {
                        title: "Python Fundamentals",
                        lessons: [
                            {
                                id: "python-3",
                                title: "Variables and Data Types",
                                content:
                                    "Learn strings, integers, floats, booleans and variables in Python."
                            },
                            {
                                id: "python-4",
                                title: "Conditions and Loops",
                                content:
                                    "Learn if statements, for loops and while loops."
                            }
                        ]
                    },
                    {
                        title: "Functions and OOP",
                        lessons: [
                            {
                                id: "python-5",
                                title: "Functions",
                                content:
                                    "Learn how to create reusable functions and pass arguments."
                            },
                            {
                                id: "python-6",
                                title: "Object Oriented Programming",
                                content:
                                    "Understand classes, objects, inheritance and encapsulation."
                            }
                        ]
                    }
                ]
            },


            {
                id: "javascript",
                title: "JavaScript Fundamentals",
                category: "Software & IT",
                icon: "🟨",
                level: "Beginner",
                duration: "7 hours",
                lessons: 9,
                description:
                    "Learn modern JavaScript for web development.",
                modules: [
                    {
                        title: "JavaScript Basics",
                        lessons: [
                            {
                                id: "js-1",
                                title: "Introduction to JavaScript",
                                content:
                                    "JavaScript is a programming language commonly used to make web pages interactive."
                            },
                            {
                                id: "js-2",
                                title: "Variables",
                                content:
                                    "Learn let, const and basic JavaScript data types."
                            }
                        ]
                    },
                    {
                        title: "Control Flow",
                        lessons: [
                            {
                                id: "js-3",
                                title: "Conditions",
                                content:
                                    "Learn if, else if and switch statements."
                            },
                            {
                                id: "js-4",
                                title: "Loops",
                                content:
                                    "Learn for, while and for...of loops."
                            }
                        ]
                    }
                ]
            },


            {
                id: "html-css",
                title: "HTML & CSS Web Design",
                category: "Software & IT",
                icon: "🌐",
                level: "Beginner",
                duration: "6 hours",
                lessons: 8,
                description:
                    "Build modern responsive websites using HTML and CSS.",
                modules: [
                    {
                        title: "HTML",
                        lessons: [
                            {
                                id: "html-1",
                                title: "HTML Basics",
                                content:
                                    "Learn the structure of an HTML document and common HTML elements."
                            },
                            {
                                id: "html-2",
                                title: "Forms and Tables",
                                content:
                                    "Learn how to create forms, inputs and tables."
                            }
                        ]
                    },
                    {
                        title: "CSS",
                        lessons: [
                            {
                                id: "css-1",
                                title: "CSS Fundamentals",
                                content:
                                    "Learn selectors, properties and values."
                            },
                            {
                                id: "css-2",
                                title: "Flexbox and Grid",
                                content:
                                    "Learn modern CSS layout systems."
                            }
                        ]
                    }
                ]
            },


            {
                id: "sql",
                title: "SQL & Databases",
                category: "Software & IT",
                icon: "🗄️",
                level: "Beginner",
                duration: "6 hours",
                lessons: 8,
                description:
                    "Learn databases, SQL queries and data manipulation.",
                modules: [
                    {
                        title: "Database Basics",
                        lessons: [
                            {
                                id: "sql-1",
                                title: "What is a Database?",
                                content:
                                    "Understand databases, tables, rows and columns."
                            },
                            {
                                id: "sql-2",
                                title: "SELECT Queries",
                                content:
                                    "Learn how to retrieve information using SELECT."
                            }
                        ]
                    }
                ]
            },


            {
                id: "data-analysis",
                title: "Data Analytics",
                category: "Software & IT",
                icon: "📈",
                level: "Intermediate",
                duration: "10 hours",
                lessons: 12,
                description:
                    "Learn data analysis using spreadsheets, SQL and Python.",
                modules: [
                    {
                        title: "Analytics Fundamentals",
                        lessons: [
                            {
                                id: "da-1",
                                title: "Introduction to Data Analytics",
                                content:
                                    "Understand what data analytics is and how organizations use data."
                            },
                            {
                                id: "da-2",
                                title: "Data Cleaning",
                                content:
                                    "Learn how to identify and handle missing and inconsistent data."
                            }
                        ]
                    }
                ]
            },


            {
                id: "machine-learning",
                title: "Machine Learning Fundamentals",
                category: "Software & IT",
                icon: "🤖",
                level: "Intermediate",
                duration: "12 hours",
                lessons: 14,
                description:
                    "Understand machine learning concepts and practical workflows.",
                modules: [
                    {
                        title: "ML Fundamentals",
                        lessons: [
                            {
                                id: "ml-1",
                                title: "What is Machine Learning?",
                                content:
                                    "Machine learning allows computers to learn patterns from data and make predictions."
                            },
                            {
                                id: "ml-2",
                                title: "Types of Machine Learning",
                                content:
                                    "Learn supervised, unsupervised and reinforcement learning."
                            }
                        ]
                    }
                ]
            },


            {
                id: "project-management",
                title: "Project Management",
                category: "Business & Management",
                icon: "📋",
                level: "Beginner",
                duration: "5 hours",
                lessons: 8,
                description:
                    "Learn planning, execution, communication and project tracking.",
                modules: [
                    {
                        title: "Project Fundamentals",
                        lessons: [
                            {
                                id: "pm-1",
                                title: "Introduction to Project Management",
                                content:
                                    "Understand project goals, stakeholders, scope and timelines."
                            },
                            {
                                id: "pm-2",
                                title: "Project Planning",
                                content:
                                    "Learn how to define tasks, resources and milestones."
                            }
                        ]
                    }
                ]
            },


            {
                id: "digital-marketing",
                title: "Digital Marketing",
                category: "Marketing",
                icon: "📣",
                level: "Beginner",
                duration: "7 hours",
                lessons: 10,
                description:
                    "Learn SEO, social media, content marketing and digital campaigns.",
                modules: [
                    {
                        title: "Marketing Fundamentals",
                        lessons: [
                            {
                                id: "dm-1",
                                title: "Introduction to Digital Marketing",
                                content:
                                    "Understand how businesses use digital channels to reach customers."
                            },
                            {
                                id: "dm-2",
                                title: "SEO Basics",
                                content:
                                    "Learn the fundamentals of search engine optimization."
                            }
                        ]
                    }
                ]
            },


            {
                id: "graphic-design",
                title: "Graphic Design Fundamentals",
                category: "Creative",
                icon: "🎨",
                level: "Beginner",
                duration: "6 hours",
                lessons: 8,
                description:
                    "Learn design principles, typography, color and visual communication.",
                modules: [
                    {
                        title: "Design Basics",
                        lessons: [
                            {
                                id: "gd-1",
                                title: "Design Principles",
                                content:
                                    "Learn balance, contrast, alignment, hierarchy and repetition."
                            },
                            {
                                id: "gd-2",
                                title: "Typography",
                                content:
                                    "Understand fonts, readability and typography hierarchy."
                            }
                        ]
                    }
                ]
            },


            {
                id: "accounting",
                title: "Accounting Basics",
                category: "Finance & Accounting",
                icon: "💰",
                level: "Beginner",
                duration: "6 hours",
                lessons: 9,
                description:
                    "Understand accounting fundamentals, financial statements and transactions.",
                modules: [
                    {
                        title: "Accounting Fundamentals",
                        lessons: [
                            {
                                id: "acc-1",
                                title: "Introduction to Accounting",
                                content:
                                    "Learn the purpose of accounting and basic accounting terminology."
                            },
                            {
                                id: "acc-2",
                                title: "Financial Statements",
                                content:
                                    "Understand balance sheets, income statements and cash flow."
                            }
                        ]
                    }
                ]
            },


            {
                id: "healthcare-management",
                title: "Healthcare Management",
                category: "Healthcare",
                icon: "🏥",
                level: "Beginner",
                duration: "5 hours",
                lessons: 7,
                description:
                    "Learn fundamentals of healthcare administration and management.",
                modules: [
                    {
                        title: "Healthcare Administration",
                        lessons: [
                            {
                                id: "hc-1",
                                title: "Healthcare Management Introduction",
                                content:
                                    "Understand healthcare organizations, administration and management."
                            },
                            {
                                id: "hc-2",
                                title: "Healthcare Operations",
                                content:
                                    "Learn basic healthcare operational processes."
                            }
                        ]
                    }
                ]
            },


            {
                id: "communication",
                title: "Professional Communication",
                category: "Career Skills",
                icon: "🗣️",
                level: "Beginner",
                duration: "4 hours",
                lessons: 7,
                description:
                    "Improve workplace communication, presentation and professional writing.",
                modules: [
                    {
                        title: "Communication Skills",
                        lessons: [
                            {
                                id: "com-1",
                                title: "Effective Communication",
                                content:
                                    "Learn how to communicate clearly and professionally."
                            },
                            {
                                id: "com-2",
                                title: "Professional Emails",
                                content:
                                    "Learn how to write clear and professional workplace emails."
                            }
                        ]
                    }
                ]
            },


            {
                id: "public-speaking",
                title: "Public Speaking",
                category: "Career Skills",
                icon: "🎤",
                level: "Beginner",
                duration: "4 hours",
                lessons: 6,
                description:
                    "Build confidence and learn practical public speaking techniques.",
                modules: [
                    {
                        title: "Speaking Fundamentals",
                        lessons: [
                            {
                                id: "ps-1",
                                title: "Building Confidence",
                                content:
                                    "Learn techniques for reducing nervousness and speaking with confidence."
                            },
                            {
                                id: "ps-2",
                                title: "Presentation Structure",
                                content:
                                    "Learn how to organize an effective presentation."
                            }
                        ]
                    }
                ]
            }

        ];



        /* =====================================================
           ELEMENTS
        ===================================================== */

        const courseGrid =
            document.getElementById("courseGrid");

        const courseSearch =
            document.getElementById("courseSearch");

        const courseHeading =
            document.getElementById("courseHeading");

        const courseCount =
            document.getElementById("courseCount");

        const noCourses =
            document.getElementById("noCourses");

        const continueSection =
            document.getElementById("continueSection");

        const continueContainer =
            document.getElementById("continueContainer");



        let selectedCategory = "All";



        /* =====================================================
           STORAGE
        ===================================================== */

        function getProgress(course) {

            const completed =
                getCompletedLessons(course);

            const total =
                getAllLessons(course).length;

            if (!total) {
                return 0;
            }

            return Math.round(
                (completed.length / total) * 100
            );
        }


        function getCompletedLessons(course) {

            const key =
                "careerai_completed_" + course.id;

            try {

                return JSON.parse(
                    localStorage.getItem(key)
                ) || [];

            } catch (error) {

                return [];

            }

        }



        function getAllLessons(course) {

            const lessons = [];

            course.modules.forEach(
                module => {

                    module.lessons.forEach(
                        lesson => {

                            lessons.push(lesson);

                        }
                    );

                }
            );

            return lessons;
        }



        /* =====================================================
           COURSE CARD
        ===================================================== */

        function createCourseCard(course) {

            const progress =
                getProgress(course);

            const card =
                document.createElement("article");

            card.className =
                "course-card";


            card.innerHTML = `

                <div class="course-cover">

                    <div class="course-icon">
                        ${course.icon}
                    </div>

                    <span class="course-category">
                        ${course.category}
                    </span>

                </div>


                <div class="course-body">

                    <h3>
                        ${course.title}
                    </h3>

                    <p>
                        ${course.description}
                    </p>


                    <div class="course-meta">

                        <span>
                            📊 ${course.level}
                        </span>

                        <span>
                            ⏱ ${course.duration}
                        </span>

                        <span>
                            📖 ${course.lessons} lessons
                        </span>

                    </div>


                    <div class="course-progress">

                        <div class="progress-top">

                            <span>
                                Progress
                            </span>

                            <span>
                                ${progress}%
                            </span>

                        </div>

                        <div class="progress-bar">

                            <div
                                class="progress-fill"
                                style="width:${progress}%"
                            ></div>

                        </div>

                    </div>


                    <button
                        class="course-button"
                        data-course="${course.id}"
                    >
                        ${
                            progress > 0
                                ? "Continue Course"
                                : "Start Course"
                        }
                    </button>

                </div>
            `;


            return card;
        }



        /* =====================================================
           RENDER COURSES
        ===================================================== */

        function renderCourses() {

            const search =
                courseSearch.value
                    .trim()
                    .toLowerCase();


            let filtered =
                courses.filter(course => {

                    const matchesCategory =
                        selectedCategory === "All" ||
                        course.category === selectedCategory;


                    const matchesSearch =
                        !search ||
                        course.title
                            .toLowerCase()
                            .includes(search) ||
                        course.description
                            .toLowerCase()
                            .includes(search) ||
                        course.category
                            .toLowerCase()
                            .includes(search);


                    return (
                        matchesCategory &&
                        matchesSearch
                    );

                });


            courseGrid.innerHTML = "";


            courseHeading.textContent =
                selectedCategory === "All"
                    ? "All Courses"
                    : selectedCategory;


            courseCount.textContent =
                `${filtered.length} courses`;


            if (filtered.length === 0) {

                noCourses.style.display =
                    "block";

                return;

            }


            noCourses.style.display =
                "none";


            filtered.forEach(
                course => {

                    courseGrid.appendChild(
                        createCourseCard(course)
                    );

                }
            );

        }



        /* =====================================================
           CATEGORY FILTER
        ===================================================== */

        document
            .querySelectorAll(".category-card")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".category-card"
                            )
                            .forEach(btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            });


                        this.classList.add(
                            "active"
                        );


                        selectedCategory =
                            this.dataset.category;


                        renderCourses();

                    }
                );

            });



        /* =====================================================
           SEARCH
        ===================================================== */

        courseSearch.addEventListener(
            "input",
            renderCourses
        );



        /* =====================================================
           OPEN COURSE
        ===================================================== */

        courseGrid.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".course-button"
                    );


                if (!button) {
                    return;
                }


                const courseId =
                    button.dataset.course;


                window.location.href =
                    "/learning-hub/course/" +
                    courseId;

            }
        );



        /* =====================================================
           CONTINUE LEARNING
        ===================================================== */

        function renderContinueLearning() {

            const activeCourses =
                courses.filter(
                    course =>
                        getProgress(course) > 0 &&
                        getProgress(course) < 100
                );


            if (activeCourses.length === 0) {

                continueSection.style.display =
                    "none";

                return;

            }


            continueSection.style.display =
                "block";


            continueContainer.innerHTML =
                "";


            activeCourses
                .slice(0, 3)
                .forEach(course => {

                    const progress =
                        getProgress(course);


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "continue-card";


                    card.innerHTML = `

                        <div class="continue-icon">
                            ${course.icon}
                        </div>

                        <div class="continue-info">

                            <h3>
                                ${course.title}
                            </h3>

                            <p>
                                ${progress}% completed
                            </p>

                        </div>

                        <button
                            class="continue-button"
                            data-course="${course.id}"
                        >
                            Continue
                        </button>

                    `;


                    continueContainer
                        .appendChild(card);

                });

        }



        continueContainer.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".continue-button"
                    );


                if (!button) {
                    return;
                }


                window.location.href =
                    "/learning-hub/course/" +
                    button.dataset.course;

            }
        );



        /* =====================================================
           GLOBAL ACCESS
           Course detail page uses same data
        ===================================================== */

        window.CareerAICourses =
            courses;



        /* =====================================================
           INITIAL RENDER
        ===================================================== */

        renderCourses();

        renderContinueLearning();

    }
);