Link on a Swagger: http://localhost:3001/docs/swagger/

Сделаны 4 Метода: Приток/Отток финансов, Баланс Пользователя и Транзакции
Пользователя.

Приток финансов и их Отток объединены в 1 метод. Можно раскоментить код и тогда
указывать свои Комментарии, если они есть(не отправлять поле "comment"), а если
нет, то будут указываться системные. То же самое для C2C метода.

Отправка финансов между пользователями (C2C). То ТЗ это отдельный метод, поэтому
я так и сделал. Но по хорошему, они схожи с Приток/Отток и их можно было
объединить.

Баланс пользователя возвращает текущее значение баланса и при указание валюты
обмена, возвращает значение баланса в другой валюте.

Транзакции возвращаются отсортированными и в них предусмотрена пагинация, по
умолчанию пагинация 10 элементов. Транзакции вынесены в отдельную схему чтобы
упростить работу с данными и не нагружать профиль пользователя.
