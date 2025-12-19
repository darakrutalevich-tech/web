// 2 задание: Функция для получения данных с JSONPlaceholder API
async function fetchPostsFromJsonPlaceholder() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');

        if (!response.ok) {
            throw new Error("Ошибка");
        }

        const posts = await response.json();

        console.log("Заголовки постов:");
        posts.slice(0, 10).forEach((post, index) => {
            console.log(`${index + 1}. ${post.title}`);
        });

        console.log(`Всего загружено постов: ${posts.length}`);
        return posts;

    } catch (error) {
        console.error("Ошибка при загрузке постов:", error);
        return null;
    }
}

fetchPostsFromJsonPlaceholder();