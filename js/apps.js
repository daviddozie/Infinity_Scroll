let pageNumber = 1;
const pageSize = 10;
let userWrapper = document.querySelector('.user-wrapper');
let isLoadPage = true;

const renderUser = (user) => {
    let {
        name: { first, last },
        location: { country },
        email,
        picture: { medium: userImage }
    } = user;

    htmlStr =
        `   <div class="d-flex justify-content-between align-items-center user-item p-3 mb-2 text-center flex-wrap">
        <img src="${userImage}" alt="">
        <p class="user-cred">${first} ${last}</p>
        <p class="user-cred">${country}</p>
        <p class="user-cred">${email}</p>
        </div>
    `;
    userWrapper.insertAdjacentHTML("beforeend", htmlStr)
}

async function getRandomUsers(pageNumber, pageSize) {
    let url = `https://randomuser.me/api/?page=${pageNumber}&results=${pageSize}&seed=abc`;

    const resp = await fetch(url);
    const data = await resp.json();
    return data;
}

const getLastUserEle = () => document.querySelector('.user-wrapper > .user-item:last-child');

const loadUsers = (pageNumber, pageSize) => {
    getRandomUsers(pageNumber, pageSize)
        .then((data) => {
            data && data.results && data.results.forEach((user) => renderUser(user))
            if (isLoadPage) {
                observeLastUser();
                isLoadPage = false;
            }
        })
        .catch((error) => {
            console.error('Error loading users:', error);
        });
}

const loadMoreUsers = () => {
    loadUsers(++pageNumber, pageSize);
};

const infScrollCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadMoreUsers();
            observer.unobserve(entry.target);
            observeLastUser();
        }
    });
};

const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

const observeLastUser = () => {
    const lastUserElement = getLastUserEle();
    if (lastUserElement) {
        infScrollObserver.observe(lastUserElement);
    } else {
        console.error('Last user element not found.');
    }
}

loadUsers(pageNumber, pageSize);
observeLastUser();