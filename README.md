## Установка

```bash
$ yarn install
```

## Переменные среды

Необходимо заполнить .env файл по подобию .env.example. Ключ API от etherscan.io можно не использовать, но в тамком случае нужно поставить POLL_DELAY = 5000 - задеркжа между запросами к etherscan. POLL_START - номер блока, с которого приложение будет наблюдать новые блоки. 


## Запуск приложения

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```