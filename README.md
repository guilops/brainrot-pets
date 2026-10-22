# Brainrot Pets

Jogo clicker de mascotes feito com HTML, CSS e JavaScript. Não precisa de build, servidor ou dependências: o GitHub Pages publica os arquivos diretamente e é gratuito para repositórios públicos.

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
- Substitua o espaço de banner e conecte seu provedor de anúncios em `index.html`.
- A integração de anúncio recompensado fica marcada em `script.js`. O botão não concede moedas enquanto o SDK do provedor não estiver conectado.

O progresso é salvo no `localStorage` do navegador de cada jogador; não há conta, sincronização entre dispositivos ou banco de dados. O GitHub Pages hospeda o site estático gratuitamente, mas não oferece um servidor para processar pagamentos, contas ou dados de jogadores.
