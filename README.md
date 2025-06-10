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