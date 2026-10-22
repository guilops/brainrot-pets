# Brainrot Pets

Jogo clicker de mascotes feito com HTML, CSS e JavaScript. Não precisa de build, servidor ou dependências: o GitHub Pages publica os arquivos diretamente e é gratuito para repositórios públicos.

## Como funciona o jogo

- Ao abrir o jogo, escolha o **Modo normal**, com progresso salvo, ou a **Corrida contra o tempo**, com partidas independentes de 1, 10, 30 ou 60 minutos. Ao zerar o relógio, a partida congela e mostra um resumo compartilhável.
- Clique no mascote principal para ganhar braincoins e subir de nível. A loja tem 16 upgrades: força de clique, renda automática, bônus por mascote, multiplicadores e descontos nos ovos.
- O acervo tem mais de 40 mascotes, de Comum a Divino. Novos pets ficam disponíveis conforme você clica, e os ovos começam baratos, sobem de preço gradualmente e favorecem mascotes ainda não colecionados.
- Na coleção, toque em um mascote que você já ganhou para ver a ficha, a renda passiva e a chance atual no ovo; use **Escolher para clicar** para colocá-lo na área principal. O mascote escolhido fica salvo no navegador.
- Os mascotes duplicados continuam acumulando renda passiva.

## Monetag

O `sw.js` na raiz contém a configuração de zona Monetag fornecida para este site. O jogo registra esse service worker pelo caminho relativo `./sw.js`, compatível com o endereço de projeto do GitHub Pages (`/brainrot-pets/`).

Esse arquivo é uma integração de service worker; ele não contém o código de banner nem o de anúncio em vídeo recompensado. Os espaços de banner e recompensa continuam reservados até que os respectivos códigos de formato sejam fornecidos pela Monetag. A disponibilidade e o comportamento dos anúncios dependem das configurações da zona, do navegador e das políticas do provedor.

Antes de monetizar um jogo destinado a crianças, revise as configurações de adequação de anúncios, privacidade e consentimento para a sua audiência e jurisdição.

## Publicar gratuitamente com GitHub Pages

### 1. Crie um repositório

1. Entre em [github.com/new](https://github.com/new) e faça login ou crie uma conta.
2. Dê um nome ao repositório, por exemplo `brainrot-pets`.
3. Selecione **Public**.
4. Deixe desmarcada a opção para inicializar com README, `.gitignore` ou licença: os arquivos do jogo já estão neste projeto.
5. Clique em **Create repository**.

### 2. Envie os arquivos do projeto

Abra o PowerShell na pasta do jogo (`C:\Users\User\source\repos\Virau`) e execute estes comandos, substituindo `SEU-USUARIO` pelo seu nome de usuário do GitHub:

```powershell
git init
git add .
git commit -m "Publica Brainrot Pets"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/brainrot-pets.git
git push -u origin main
```

Se o Git solicitar autenticação, autorize a operação pelo navegador ou use o método de autenticação configurado para sua conta do GitHub.

### 3. Ative a publicação

1. Na página do repositório, abra **Settings** → **Pages**.
2. Em **Build and deployment** → **Source**, selecione **GitHub Actions**.
3. Abra a aba **Actions** e aguarde o workflow **Publicar jogo no GitHub Pages** terminar com sucesso.
4. A URL pública aparecerá em **Settings** → **Pages** e também no resumo da execução do workflow. Para este exemplo, o endereço será `https://SEU-USUARIO.github.io/brainrot-pets/`.

O primeiro deploy pode levar alguns minutos. Depois disso, cada `git push` na branch `main` publica automaticamente as alterações.

## Atualizar o jogo publicado

Depois de editar os arquivos, envie a atualização:

```powershell
git add .
git commit -m "Atualiza o jogo"
git push
```

Confira o resultado na aba **Actions**. Quando a execução terminar com sucesso, recarregue o endereço publicado.

## Personalizar antes de compartilhar

- Edite os mascotes, seus nomes, raridades e ganhos em `script.js`.
- O service worker Monetag fica em `sw.js` e é registrado por `script.js`.
- O espaço de banner e a integração de anúncio recompensado em `index.html` continuam reservados até você fornecer os códigos específicos desses formatos.

O progresso é salvo no `localStorage` do navegador de cada jogador; não há conta, sincronização entre dispositivos ou banco de dados. O GitHub Pages hospeda o site estático gratuitamente, mas não oferece um servidor para processar pagamentos, contas ou dados de jogadores.
