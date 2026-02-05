const courseGrid = document.getElementById('courseGrid');
const creditTotal = document.getElementById('creditTotal');
const filterButtons = document.querySelectorAll('.filter-btn');
const courseModal = document.getElementById('courseModal');

const displayCourseDetails = (course) => {
    if (!courseModal) {
        return;
    }

    courseModal.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'modal-header';

    const heading = document.createElement('h2');
    heading.id = 'courseModalTitle';
    heading.textContent = `${course.subject} ${course.number}`;

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.textContent = 'x';
    closeButton.addEventListener('click', () => courseModal.close());

    header.append(heading, closeButton);

    const body = document.createElement('div');
    body.className = 'modal-body';

    const title = document.createElement('p');
    title.innerHTML = `<span class="modal-label">Title:</span> ${course.title}`;

    const credits = document.createElement('p');
    credits.innerHTML = `<span class="modal-label">Credits:</span> ${course.credits}`;

    const description = document.createElement('p');
    description.id = 'courseModalDescription';
    description.innerHTML = `<span class="modal-label">Description:</span> ${course.description}`;

    const certificate = document.createElement('p');
    certificate.innerHTML = `<span class="modal-label">Certificate:</span> ${course.certificate}`;

    const techLabel = document.createElement('p');
    techLabel.innerHTML = `<span class="modal-label">Technology stack:</span>`;

    const techList = document.createElement('ul');
    techList.className = 'modal-tech';
    course.technology.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        techList.appendChild(listItem);
    });

    body.append(title, credits, description, certificate, techLabel, techList);

    courseModal.append(header, body);
    courseModal.setAttribute('aria-labelledby', 'courseModalTitle');
    courseModal.setAttribute('aria-describedby', 'courseModalDescription');
    courseModal.showModal();
};

if (courseModal) {
    courseModal.addEventListener('click', (event) => {
        if (event.target === courseModal) {
            courseModal.close();
        }
    });
}

const getFilteredCourses = (filter) => {
    if (filter === 'all') {
        return courses;
    }

    const subject = filter.toUpperCase();
    return courses.filter((course) => course.subject === subject);
};

const updateCreditTotal = (courseList) => {
    if (!creditTotal) {
        return;
    }

    const total = courseList.reduce((sum, course) => sum + course.credits, 0);
    creditTotal.textContent = total;
};

const renderCourses = (courseList) => {
    if (!courseGrid) {
        return;
    }

    courseGrid.innerHTML = '';

    courseList.forEach((course) => {
        const card = document.createElement('article');
        card.className = `course-card${course.completed ? ' completed' : ''}`;

        const title = document.createElement('h3');
        title.textContent = `${course.subject} ${course.number}`;

        const name = document.createElement('p');
        name.className = 'course-meta';
        name.textContent = course.title;

        const credits = document.createElement('p');
        credits.className = 'course-meta';
        credits.textContent = `${course.credits} credits`;

        card.append(title, name, credits);
        card.addEventListener('click', () => displayCourseDetails(course));
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                displayCourseDetails(course);
            }
        });
        courseGrid.appendChild(card);
    });

    updateCreditTotal(courseList);
};

const setActiveButton = (filter) => {
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === filter;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive);
    });
};

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        const filteredCourses = getFilteredCourses(filter);
        setActiveButton(filter);
        renderCourses(filteredCourses);
    });
});

if (courseGrid) {
    setActiveButton('all');
    renderCourses(courses);
}
