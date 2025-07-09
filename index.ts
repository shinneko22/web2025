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

// 論文一覧取得
app.get('/', async (req, res) => {
  const papers = await prisma.paper.findMany();
  res.render('index', { papers });
});

// 論文追加
app.post('/papers', async (req, res) => {
  const { title, authors, journal, year, pdfUrl, summary } = req.body;
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
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});