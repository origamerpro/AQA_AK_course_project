# Установка
1. Заходим в папку на вашем ПК в которой будет ваша папка репозитария и запускаем [Git bash](https://git-scm.com/downloads/win) и клонируем репозитарий командой:
```bash
git clone https://github.com/origamerpro/AQA_AK_course_project.git
```
2. Заходим в папку с проектом и запускаем [VS Code](https://code.visualstudio.com/Download)
3. Заходим в терминал и там должна быть строка с названием проекта в конце:
```bash
AQA_AK_course_project (main)
```
4. Если у вас не установлен TypeScript, то установите его командами:
```bash
npm i -g typescript --savedev
npm i -g ts-node
```
5. Для установки всех остальных зависимостей прописываем команду:
```bash
npm i
```
6. Для проверки установленных зависимостей прописываем команду:
```bash
npm list
```
Скриншот для сверки:
![list packages](https://live.staticflickr.com/65535/54587212677_9ac9e4f918_b.jpg?raw=true)
7. Создаем файл .env в папке с проектом и добавляем в него свои данные:
```bash
USER_LOGIN=yourlogin
USER_PASSWORD=yourpassword
```
8. Файл .env.dist для записи используемых переменных в проекте с комментариями:

## Команды:

0. Полная проверка кода:
```bash
npm run pre
```
1. Запуск тестов UI:
```bash
npm run test:ui
```
2. Запуск тестов API:
```bash
npm run test:api
```
3. Проверка кода на ошибки:
```bash
npm run lint
```
4. Проверка формата кода:
```bash
npm run format
```
5. Исправление ошибок в коде:
```bash
npm run lint-fix
```
6. Исправления формата кода:
```bash
npm run format-fix
```
7. Запуск Playwright в режиме UI:
```bash
npm run ui-mode
```
8. Открытие отчета Playwright:
```bash
npm run report-html-open
```
9. Генерация отчета Allure:
```bash
npm run allure-report
```
10. Открытие отчета Allure:
```bash
npm run allure-report-open
```