// Expressフレームワークをインポートするのじゃ
import express from 'express';
// 生成した Prisma Client をインポートするぞい
import { PrismaClient } from '@prisma/client';

// Prisma Client のインスタンスを作成するのじゃ
const prisma = new PrismaClient({
  // データベースに実行されたクエリをログに表示するための設定じゃな
  log: ['query'],
});

// Expressアプリケーションのインスタンスを作成するぞいよ
const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得するのじゃ。
// 環境変数に設定がなければ、デフォルトで8888を使用するぞい。
const PORT = process.env.PORT || 8888;

// EJSをテンプレートエンジンとして設定するのじゃ。
// これにより、EJSファイルを使って動的なHTMLを生成できるようになるぞい。
app.set('view engine', 'ejs');
// EJSテンプレートファイルの場所を'views'ディレクトリに設定するのじゃ。
app.set('views', './views');

// フォームから送信されたデータ（URLエンコードされたデータ）をExpressが扱えるようにする設定じゃ。
app.use(express.urlencoded({ extended: true }));

// ルートURL ('/') へのGETリクエストを処理するハンドラーじゃな。
// データベースからユーザー一覧を取得し、それをEJSテンプレートに渡して表示するぞい。
app.get('/', async (req, res) => {
  // データベースからすべてのユーザーを取得するのじゃ
  const users = await prisma.user.findMany();
  // 'index.ejs'テンプレートをレンダリングし、取得したユーザーデータを渡すぞい
  res.render('index', { users });
});

// '/users'へのPOSTリクエストを処理するハンドラーじゃな。
// フォームから新しいユーザー名を受け取り、データベースに追加するぞい。
app.post('/users', async (req, res) => {
  // フォームから送信された'name'フィールドの値を取得するのじゃ
  const name = req.body.name;
  // 'name'が空でなければ、新しいユーザーをデータベースに追加するぞい
  if (name) {
    const newUser = await prisma.user.create({
      data: { name }, // 取得した名前でユーザーを作成するのじゃ
    });
    console.log('新しいユーザーを追加しました:', newUser);
  }
  // ユーザー追加後、ルートページ ('/') にリダイレクトして、更新された一覧を表示するぞい
  res.redirect('/');
});

// 設定したポートでサーバーを起動するのじゃ。
// 設定したポートでサーバーを起動するのじゃ。
// 設定したポートでサーバーを起動するのじゃ。
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
