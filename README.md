# typescript-typeorm-upload
Utilizando o TypeORM com upload de arquivos. Desafio da Bootcamp GoStack da Rocketseat.

Esta aplicação tem a finalidade de demonstrar a utilização do TypeORM para administração de entidades do banco de dados. Além disso, demonstra também a utilização da biblioteca Multer para upload de arquivos.

## :information_source: Sobre a API

Esta interface de transações financeiras possui as seguintes rotas disponíveis:

- **`POST /transactions`**: A rota deve receber `title`, `value`, `type` e `category` dentro do corpo da requisição (em formato JSON), onde type pode ter o valor "income" para entradas de valor no saldo ou "outcome" para saídas de valor do saldo:

```
{
  "title": "Salário",
  "value": 3000,
  "type": "income",
  "category": "Salário"
}
```

- **`POST /transactions/import`**: Esta rota permite o envio de um arquivo .csv **[neste formato](https://github.com/marcelo-amorim/typescript-typeorm-upload/blob/master/demo/file.csv)**. No final do processamento será retornado todas as transações que foram cadastradas no banco:

```
[
  ...
  {
    "title": "Salário",
    "value": 3000,
    "type": "income",
    "category": "Salário"
  }
  ...
]
```

- **`GET /transactions`**: Lista todos as transações com o balanço:
```
{
  "transactions": [
    {
      "id": "1cf5e9af-52aa-4d91-97e4-918d28d11e38",
      "title": "Salário",
      "value": 3000,
      "type": "income"
      "category": "Salário"
    },
    {
      "id": "7c35b765-1d2c-4098-acf5-af50f4f5f864",
      "title": "Bike muitcho louca",
      "value": 2999.99,
      "type": "outcome",
      "category": "Lazer"
    }
  ],
  "balance": {
    "total": 0.01,
    "income": 3000,
    "outcome": 2999.99
  }
}
```

- **`DELETE /transactions/:id`**: Deleta uma transação especifícada pelo ID indicado na url.


## Como rodar o projeto

Para rodar o projeto basta clona-lo em um diretório de sua preferência e em seguida, executar o comando `yarn` no seu terminal.
Após a instalação das dependências, você deverá criar uma tabela com o nome **gostack_desafio06** no seu Postgres e depois executar as migrations de criação das tabelas através do comando `yarn typeorm migration:run`. Você pode alterar as configurações de autenticação do banco no arquivo `**.ormconfig.json**`, na raíz do projeto. Depois de criar o banco de dados e as tabelas, você pode rodar a API com o comando shell`yarn dev:server`.

Você pode utilizar o **[Insomnia](https://insomnia.rest/download/)** ou **[Postman](https://www.postman.com/)** para fazer as chamadas na api.

:metal::metal:
