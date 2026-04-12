// ============================================
        // RENDER LINKEDIN POSTS
        // ============================================
        function renderLinkedInPosts() {
            const container = document.getElementById('linkedin-container');
            container.innerHTML = '';

            LinkedIn_Post_dB.forEach((post, index) => {
                const postDate = new Date(post.date_of_publication);
                const formattedDate = postDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const postHTML = `
                    <div class="LinkedIn-Post" id="post-${post.id}">
                        <div class="post-header">
                            <div class="post-avatar">
                                <i class="bi bi-person-fill"></i>
                            </div>
                            <div class="post-meta">
                                <strong>${post.author}</strong>
                                <span class="post-date">${formattedDate}</span>
                                <span class="post-date" style="font-size: 0.75rem; color: #667eea;">📌 ${post.category}</span>
                            </div>
                        </div>
                        <h3 style="color: #333; margin-bottom: 0.5rem;">${post.title}</h3>
                        <p class="post-content">${post.description}</p>
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #666;">
                            <span><i class="bi bi-hand-thumbs-up"></i> ${post.likes} Likes</span>
                            <span><i class="bi bi-chat-dots"></i> ${post.comments} Comments</span>
                            <span><i class="bi bi-arrow-repeat"></i> ${post.shares} Shares</span>
                        </div>
                        <div class="post-actions">
                            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="post-action-btn">
                                <i class="bi bi-linkedin"></i> View on LinkedIn
                            </a>
                            <button class="post-action-btn" onclick="likePost(${post.id})" style="background: #764ba2;">
                                <i class="bi bi-hand-thumbs-up"></i> Like
                            </button>
                            <button class="post-action-btn" onclick="sharePost(${post.id})" style="background: #50c878;">
                                <i class="bi bi-share"></i> Share
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML += postHTML;
            });

            // Update stats
            document.getElementById('stat-posts').textContent = LinkedIn_Post_dB.length;
        }

        // ============================================
        // RENDER ANNOUNCEMENTS
        // ============================================
        function renderAnnouncements() {
            const container = document.getElementById('announcement-container');
            container.innerHTML = '';

            announcementDatabase.forEach((announcement) => {
                const annDate = new Date(announcement.date);
                const formattedDate = annDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const priorityColor = {
                    'high': '#e74c3c',
                    'medium': '#f39c12',
                    'low': '#27ae60'
                };

                const announcementHTML = `
                    <div class="announcement-card" id="ann-${announcement.id}">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${priorityColor[announcement.priority]};"></span>
                            <span style="font-size: 0.85rem; color: #666; text-transform: uppercase; font-weight: bold;">
                                ${announcement.priority} Priority
                            </span>
                        </div>
                        <h3 style="color: #333; margin-bottom: 0.5rem;">${announcement.title}</h3>
                        <p style="color: #555; margin-bottom: 0.5rem;">${announcement.content}</p>
                        <p style="font-size: 0.85rem; color: #999;">📅 ${formattedDate}</p>
                    </div>
                `;
                container.innerHTML += announcementHTML;
            });

            // Update stats
            document.getElementById('stat-announcements').textContent = announcementDatabase.length;
        }

        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        function likePost(postId) {
            const post = LinkedIn_Post_dB.find(p => p.id === postId);
            if (post) {
                post.likes += 1;
                renderLinkedInPosts();
                showNotification(`Liked! Total likes: ${post.likes}`);
            }
        }

        function sharePost(postId) {
            const post = LinkedIn_Post_dB.find(p => p.id === postId);
            if (post) {
                post.shares += 1;
                renderLinkedInPosts();
                showNotification(`Shared! Share count: ${post.shares}`);
            }
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #667eea;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // ============================================
        // INITIALIZE PAGE
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            renderLinkedInPosts();
            renderAnnouncements();
            
            // Add smooth scroll behavior for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href !== '#' && document.querySelector(href)) {
                        e.preventDefault();
                        document.querySelector(href).scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });

        // ============================================
        // ANIMATION KEYFRAMES (CSS in JS)
        // ============================================
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
