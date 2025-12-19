// 1 задание: Три асинхронные функции с имитацией задач
async function loadUserData() {
    console.log("Начинаю загрузку данных пользователя...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Данные пользователя загружены!");
    return { name: "Дарья Круталевич", age: 19 };
}

async function loadProductData() {
    console.log("Начинаю загрузку данных о продуктах...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Данные о продуктах загружены!");
    return [
        { id: 1, name: "Ноутбук", price: 1200 },
        { id: 2, name: "Смартфон", price: 800 }
    ];
}

async function loadSettings() {
    console.log("Начинаю загрузку настроек...");
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Настройки загружены!");
    return { theme: "dark", language: "ru" };
}

async function executeTasksSequentially() {
    try {
        const userData = await loadUserData();
        console.log("Полученные данные пользователя:", userData);

        const productData = await loadProductData();
        console.log("Полученные данные о продуктах:", productData);

        const settings = await loadSettings();
        console.log("Полученные настройки:", settings);

        console.log("Все задачи выполнены последовательно!");
    } catch (error) {
        console.error("Ошибка при выполнении задач:", error);
    }
}

executeTasksSequentially();