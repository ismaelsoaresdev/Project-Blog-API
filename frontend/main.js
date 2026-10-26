const API_URL = 'https://blog-api-backend-71br.onrender.com/';

async function fetchPosts() {
    const container = document.getElementById('posts-container');
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();

        // Filtra apenas os posts que estão publicados para o site público
        const publishedPosts = posts.filter(post => post.published);

        if (publishedPosts.length === 0) {
            container.innerHTML = '<p>No published posts yet.</p>';
            return;
        }

        container.innerHTML = '';

        for (const post of publishedPosts) {
            const postEl = document.createElement('div');
            postEl.className = 'post';
            
            const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US');

            postEl.innerHTML = `
                <h2>${post.title}</h2>
                <div class="date">Published on ${formattedDate}</div>
                <p>${post.content}</p>
                
                <div class="comments-section" id="comments-section-${post.id}">
                    <strong>Comments:</strong>
                    <div class="comment-list" id="comment-list-${post.id}">Loading comments...</div>
                    
                    <!-- Comment Form for Public Visitors -->
                    <form class="comment-form" data-post-id="${post.id}" style="margin-top: 15px;">
                        <input type="text" name="name" placeholder="Your name (optional)" style="display: block; margin-bottom: 8px; padding: 6px; width: 100%; max-width: 300px;" />
                        <textarea name="content" placeholder="Write a comment..." required style="display: block; margin-bottom: 8px; padding: 6px; width: 100%; height: 60px;"></textarea>
                        <button type="submit" style="padding: 6px 12px; background: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer;">Post Comment</button>
                    </form>
                </div>
            `;

            container.appendChild(postEl);
            fetchComments(post.id);
        }

        attachCommentFormListeners();

    } catch (error) {
        console.error('Error fetching posts:', error);
        container.innerHTML = '<p style="color: red;">Error loading posts from the server.</p>';
    }
}

async function fetchComments(postId) {
    const commentsContainer = document.getElementById(`comment-list-${postId}`);
    try {
        const response = await fetch(`${API_URL}/${postId}/comments`);
        const comments = await response.json();

        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p style="font-size: 0.85rem; color: #7f8c8d;">No comments yet. Be the first to comment!</p>';
            return;
        }

        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `<strong>${comment.name}</strong>: ${comment.content}`;
            commentsContainer.appendChild(commentEl);
        });
    } catch (error) {
        commentsContainer.innerHTML = '<p style="font-size: 0.85rem; color: red;">Error loading comments.</p>';
    }
}

function attachCommentFormListeners() {
    const forms = document.querySelectorAll('.comment-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const postId = form.getAttribute('data-post-id');
            const nameInput = form.querySelector('input[name="name"]');
            const contentInput = form.querySelector('textarea[name="content"]');

            const payload = {
                content: contentInput.value,
                name: nameInput.value.trim() || 'Anonymous'
            };

            try {
                const response = await fetch(`${API_URL}/${postId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    contentInput.value = '';
                    nameInput.value = '';
                    fetchComments(postId);
                } else {
                    alert('Failed to post comment.');
                }
            } catch (err) {
                console.error('Error submitting comment:', err);
                alert('Server error while posting comment.');
            }
        });
    });
}

fetchPosts();