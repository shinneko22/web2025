// index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query'],
});

const app = express();
const PORT = process.env.PORT || 8888;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSONボディをパースするために追加

// 論文一覧取得
app.get('/', async (req, res) => {
  const papers = await prisma.paper.findMany({
    orderBy: {
      year: 'desc', // 最新の論文が最初に来るように年で降順ソート
    },
  });
  res.render('index', { papers });
});

// 論文追加
app.post('/papers', async (req, res) => {
  const { title, authors, journal, year, pdfUrl, summary } = req.body;
  try {
    await prisma.paper.create({
      data: {
        title,
        authors,
        journal,
        year: year ? Number(year) : undefined,
        pdfUrl,
        summary,
      },
    });
    res.redirect('/');
  } catch (error) {
    console.error("Error adding paper:", error);
    res.status(500).send("論文の追加中にエラーが発生しました。");
  }
});

// 論文削除
app.post('/papers/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.paper.delete({
      where: {
        id: Number(id), // IDは数値として扱う
      },
    });
    res.status(200).send('論文が正常に削除されました。');
  } catch (error) {
    console.error("Error deleting paper:", error);
    res.status(500).send("論文の削除中にエラーが発生しました。");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});