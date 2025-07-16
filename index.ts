// index.ts (No changes needed)
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query'],
});

const app = express();
const PORT = process.env.PORT || 8888;

app.set('view engine', 'ejs');
app.set('views', './views'); // Ensure this path is correct relative to your app's root
app.use(express.urlencoded({ extended: true }));

// 論文一覧取得
app.get('/', async (req, res) => {
  const papers = await prisma.paper.findMany({
    orderBy: {
      year: 'desc', // Order by year descending for latest papers first
    },
  });
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
      year: year ? Number(year) : undefined, // Convert year to number if provided
      pdfUrl,
      summary,
    },
  });
  res.redirect('/'); // Redirect back to the home page to see the updated list
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});