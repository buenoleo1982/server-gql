# Template para um servidor Graphql com os recursos abaixo

- graphql-yoga
- type-graphql
- prisma
- typescript
- lint/prettier
- winston (logging)
- vitest

### Resolver prontos

- Atenticação
- Listagem de Usuários
- Criação de Usuários

### Para utilizar:

- instalar as depencias do pacote

```shell
pnpm install
```

- Criar o arquivo .env com base no arquivo .env.example

- Inicializar o prisma client

```shell
npx prisma generate
or
npx prisma migrate dev
```

Iniciar o serviço

```shell
pnpm dev
```
