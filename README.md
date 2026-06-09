# Eclipse Protocol

## Sobre o Projeto

O Eclipse Protocol é uma aplicação mobile desenvolvida com React Native e Expo, criada para auxiliar no monitoramento e gerenciamento de propriedades rurais.

A plataforma centraliza informações relacionadas às propriedades, plantações, sensores, leituras e alertas, permitindo que produtores rurais acompanhem dados importantes para a tomada de decisão e gestão agrícola.

Este projeto foi desenvolvido como parte da Global Solution da FIAP, aplicando conceitos de desenvolvimento mobile, integração com APIs REST, autenticação JWT e gerenciamento de dados.
https://youtube.com/shorts/p2n1Jo9S_ww?si=W4KZGuSNP_VPz6in
---

# Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* Expo Router
* AsyncStorage
* Expo Linear Gradient
* React Native Vector Icons
* API REST Java Spring Boot
* JWT (JSON Web Token)

---

# Funcionalidades

## Login e Autenticação

* Autenticação de usuários através de API REST.
* Armazenamento seguro do token JWT utilizando AsyncStorage.
* Controle de acesso às funcionalidades da aplicação.

## Dashboard

* Tela inicial com visão geral do sistema.
* Navegação para os principais módulos da aplicação.

## Propriedades

* Listagem de propriedades cadastradas.
* Cadastro de novas propriedades.
* Atualização de propriedades existentes.
* Exclusão de propriedades.
* Integração com API REST.

## Plantações

* Listagem de plantações.
* Estrutura preparada para cadastro e gerenciamento de culturas agrícolas.
* Integração com API REST.

## Sensores

* Visualização dos sensores cadastrados.
* Organização dos dispositivos vinculados às propriedades.

## Leituras

* Exibição das informações coletadas pelos sensores.
* Visualização dos dados monitorados.

## Localização

* Consulta e gerenciamento das localizações cadastradas.

## Alertas

* Exibição de alertas gerados pelo sistema.
* Acompanhamento de eventos monitorados.

## Perfil

* Visualização das informações do usuário autenticado.

---

# Estrutura do Projeto

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── perfil.tsx
│   ├── alertas.tsx
│   ├── leituras.tsx
│   ├── localizacao.tsx
│   ├── sensores.tsx
│   ├── propriedades.tsx
│   ├── propriedade-form.tsx
│   ├── plantacoes.tsx
│   └── plantacao-form.tsx
│
└── services/
    └── api.ts
```

---

# Configuração do Ambiente

## Clonar o Repositório

```bash
git clone <url-do-repositorio>
```

## Acessar a Pasta do Projeto

```bash
cd eclipse-protocol-mobile
```

## Instalar Dependências

```bash
npm install
```

## Executar o Projeto

```bash
npx expo start
```

---

# Integração com API

A aplicação realiza comunicação com uma API REST desenvolvida em Java Spring Boot.

Principais endpoints utilizados:

```text
POST   /auth/login

GET    /propriedades
POST   /propriedades
PUT    /propriedades/{id}
DELETE /propriedades/{id}

GET    /plantacoes
POST   /plantacoes
PUT    /plantacoes/{id}
DELETE /plantacoes/{id}
```

---

# Objetivos Acadêmicos

O projeto foi desenvolvido com o objetivo de aplicar conhecimentos relacionados a:

* Desenvolvimento Mobile
* React Native
* Expo
* Navegação entre telas
* Consumo de APIs REST
* Autenticação JWT
* Persistência de dados
* Integração Front-end e Back-end
* Arquitetura de aplicações mobile
* Versionamento com Git e GitHub

---

# Status do Projeto

As funcionalidades de autenticação, navegação e gerenciamento de propriedades encontram-se implementadas e integradas com a API. Os demais módulos seguem a mesma arquitetura de integração e expansão do sistema.

---

# Integrantes

* Nicholas Cañadas
* Gustavo Gomes Martins
* Matheus de Mattos Vecchi
* Nicholas Albuquerque Buzo
* Pedro dos Anjos
