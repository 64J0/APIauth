# APIauth

O intuito deste repositório é armazenar os arquivos gerados na série de vídeos disponibilizados no canal do Youtube da RocketSeat sobre a criação de uma API usando:

* NodeJS
* Express
* MongoDB

No primeiro vídeo é ensinado a criar uma pequena API Rest para cadastrar dados em um banco de dados MongoDB remoto. Em seguida é abordada uma técnica para autenticação de usuários em um exemplo de sistema de login, com a utilização de token para validação (JWT).
Em seguida é discutido como usar o NodeMailer para criar uma feature de recuperação de senhas, e finalmente, no último vídeo, são abordados mais profundamente conceitos da arquitetura CRUD e relacionamentos com o MongoDB.

Para acessar a playlist basta clicar no link: <a href="https://www.youtube.com/watch?v=BN_8bCfVp88&list=PL85ITvJ7FLoiXVwHXeOsOuVppGbBzo2dp">Link do youtube</a>.

Além disso, abaixo são mostradas outras dicas de segurança baseadas nesse <a href="https://medium.com/@jcbaey/authentication-in-spa-reactjs-and-vuejs-the-right-way-e4a9ac5cd9a3">post do Medium</a>.

### Pré-requisitos de segurança

* Comunicação encriptada (HTTPS)

1. Como a autenticação usa headers HTTP e troca dados sensíveis (senha, token de acesso, ...), a comunicação deve ser encriptada para evitar que alguém fazendo <i>sniff</i> na rede tenha acesso a essas informações.

* Não use <i>query params</i> para trocar dados sensíveis

1. A URL e os <i>query params</i> podem aparecer em logs do servidor, logs do browser e histórico do navegador: alguém poderia pegar esses dados desses lugares e tentar reutilizá-los.
2. Usuários sem "malícia" podem simplesmente copiar e colar a URL com tokens de autorização em algum lugar público. Posteriormente essa informação pode ser usada para falsificar uma sessão desse usuário.
3. Se os parâmetros forem muito longos é possível que a URL seja barrada nos browsers ou servidores.

* Previna ataques de força bruta

1. Um atacante pode tentar descobrir senhas, tokens ou nomes de usuários através de um método de tentativa e erro.
2. Limitadores de tentativas devem ser implementados no servidor no backend para limitar a quantidade de tentativas.
3. Bana usuários que tenham muitos códigos de erro do servidor (300+, 400+, 500).
4. Não dê informações sobre as tecnologias usadas no backend, limpe o header <i>X-Powered-By</i> que indica o tipo de servidor no header da resposta. Pode ser usado o <strong>helmet</strong> se você estiver usando o ExpressJS.

* Faça update das dependências regularmente

1. Para evitar o uso de packages com problemas de segurança é necessário atualizar os pacotes NPM:

```
# Lista brechas de segurança
npm audit
```

* Adicione monitoramento

1. Monitore seus servidores para identificar padrões anormais antes de incidentes.

<strong>...</strong>

Vinícius Gajo Marques Oliveira, 2020.
