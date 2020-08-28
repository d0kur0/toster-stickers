 # НЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫА
Данное расширение для toster.ru (qna.habr.ru) добавляет в панель редактора новый элемент - панель стикеров. Которые можно использовать на сайте.
Ведь все любят мемы, а некоторые вопросы так и просят отправить им ехидную картинку. Раньше мне приходилось сперва загуглить нужный мем, а уже потом вставить его на сайте, но согласитесь - это не удобно.

Так же дополнительной фичей является добавление поддержки вставки изображения прямо из буфера обмена в форму, что очень удобно и избавляет от надобности сперва сохранять скриншот на ПК, а потом грузить на сайт.

## Демо гифка
![Image of Yaktocat](https://github.com/d0kur0/toster-stickers/blob/master/screenshots/ezgif-5-36bbbc88ebc8.gif?raw=true)

## Баги
Писал на коленке за 3 дня, если найдете баги - создавайте issue, подправлю.

## Как установить
[Toster Stickers in Chrome Store](https://chrome.google.com/webstore/detail/toster-stickers/biohplimnkjgemnkkhdbjenjkngnbpkp?hl=ru)

Так же Вы можете установить его как unpacked extension:

- Откройте страницу [Releases](https://github.com/d0kur0/toster-stickers/releases) и скачайте последний релиз.
- Распакуйте архив в любую папку.
- Открой страницу [chrome://extensions](chrome://extensions)
- В верхнем, левом углу есть кнопка Load Unpacked, нажмите её и выберите распакованную папку.

### Поддержка firefox
Не тестировал, если у кого-то есть желание - можете попробовать и даже отправить pull request, если можете что-то предложить.
Расширение использует всего одну функцию chrome.runtime, так что проблемы вряд ли будут. Не буду против если зальёте в FF стор.

## Добавить свой пак стикеров
Вы можете или отправить мне pull request или форкнуть репозиторий и добавить только для себя.
Чтобы добавить пак, нужно создать папку в ``stickerPacks/source``, имя которой будет равно имени пака стикеров.
В эту папку добавляете нужные изображения а далее нужно собрать проект, это описано ниже.

## Сборка проекта
Расширение написано на Svelte, папка src - исходники, папка public - билд и само по себе расширение.
Для сборки нужна Node.JS и npm, достаточно выполнить ``npm install`` в корне проекта, чтобы подтянуть все зависимости.
Есть следующие скрипты:
- ``npm run dev`` - билдит стикеры и запускает режим разработки с симуляцией панели тостера (не работает CTRL+V в формах, загрузка не пройдет)
- ``npm run build`` - билдит стикеры и само расширение.
- ``npm run build-stickers`` - загружает стикеры на CND cloudinary, так же собирает pack.json со списком стикеров для расширения.
Обратите внимание на то, что в случае форка, вам нужно самостоятельно завести учётную запись на [cloudinary.com](https://cloudinary.com/)
И прописать данные к API в файле ``.env`` в корне проекта, в ``.env.example`` находится шаблон для ``.env``

Обратите внимание, что билд в режиме dev вызовет проблемы если его загрузить в хром, будет висеть долгая загрузка страницы из-за live-reload.

## TODO:
- Хочу добавить панель гифок с API гифок.
