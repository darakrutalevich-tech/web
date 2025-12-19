// 3 задание: Функция для получения курса валют с Belarusbank API
async function fetchCurrencyRates() {
    console.log("\n=== Загрузка курса валют с Belarusbank ===");

    try {
        const apiUrl = 'https://belarusbank.by/api/kursExchange?city=Минск';

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const currencyData = await response.json();

        if (Array.isArray(currencyData) && currencyData.length > 0) {
            const rates = currencyData[0];

            console.log("Курсы валют на:", rates.CURS_DATE || new Date().toLocaleDateString());

            const currencies = [
                { name: "Доллар США", buyKey: "USD_in", sellKey: "USD_out" },
                { name: "Евро", buyKey: "EUR_in", sellKey: "EUR_out" },
                { name: "Российский рубль", buyKey: "RUB_in", sellKey: "RUB_out" }
            ];

            currencies.forEach(currency => {
                if (rates[currency.buyKey] && rates[currency.sellKey]) {
                    console.log(`${currency.name}:`);
                    console.log(`  Покупка: ${rates[currency.buyKey]} BYN`);
                    console.log(`  Продажа: ${rates[currency.sellKey]} BYN`);
                    console.log("____________");
                }
            });

            return rates;
        } else {
            console.log("Данные о курсах валют не найдены");
            return null;
        }

    } catch (error) {
        console.error("Ошибка при загрузке курсов валют:", error);
        return null;
    }
}

fetchCurrencyRates();