const courseGrid = document.getElementById('courseGrid');
const creditTotal = document.getElementById('creditTotal');
const filterButtons = document.querySelectorAll('.filter-btn');

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
