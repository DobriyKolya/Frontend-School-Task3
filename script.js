const postList = document.querySelector('.post-list');
const loadButton = document.querySelector('.load-button');
const loadingIndicator = document.querySelector('.loading');

let currentPage = 1;
let isLoading = false;
let currentPostNumber = 1;

const loadPosts = async () => {
    try {
        isLoading = true;
        const response = await fetch(`https://dummyjson.com/posts?page=${currentPage}&limit=5`);
        const responseData = await response.json();

        const posts = responseData.posts;

        if (posts && Array.isArray(posts)) {
            posts.forEach(post => {
                const postItem = document.createElement('li');
                postItem.classList.add('post');
                postItem.innerHTML = `
                    <h2 class="post-title">Post ${currentPostNumber}</h2>
                    <p class="post-text">${post.body}</p>
                `;
                postList.appendChild(postItem);
                currentPostNumber++; // Увеличиваем номер текущего поста
            });

            isLoading = false;
            currentPage++;
            loadingIndicator.style.display = 'none';
        } else {
            console.error('Invalid response format:', responseData);
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
};

loadButton.addEventListener('click', async () => {
    loadingIndicator.style.display = 'block';
    await loadPosts();
});

const handleIntersection = async (entries, observer) => {
    if (!isLoading && entries[0].isIntersecting) {
        loadingIndicator.style.display = 'block';
        await loadPosts();
    }
};

const intersectionMarker = document.querySelector('.intersection-marker');

const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
});

observer.observe(intersectionMarker);



loadPosts(); // Load initial posts
