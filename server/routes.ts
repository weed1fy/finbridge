import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync } from "fs";
import { join } from "path";
import mammoth from "mammoth";
import { Stock, FilterCriteria, filterCriteriaSchema, capmInputSchema } from "@shared/schema";

// Load stock data from attached JSON file
let stocksData: Stock[] = [];
try {
  const dataPath = join(process.cwd(), 'attached_assets', 'psx_top300_1759312394734.json');
  const rawData = readFileSync(dataPath, 'utf-8');
  stocksData = JSON.parse(rawData);
} catch (error) {
  console.error('Error loading stock data:', error);
}

// Helper function to parse market cap string to number
function parseMarketCap(marketCapStr: string): number {
  if (!marketCapStr) return 0;
  const cleanStr = marketCapStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleanStr);
  if (marketCapStr.includes('T')) return num * 1000000;
  if (marketCapStr.includes('B')) return num * 1000;
  return num;
}

// Helper function to get ratio value
function getRatioValue(stock: Stock, ratioKey: string, period: string = 'Current'): number | null {
  try {
    const ratio = stock.ratios[ratioKey];
    if (!ratio || !ratio[period]) return null;
    const value = ratio[period];
    if (typeof value === 'string') {
      const cleanValue = value.replace(/[^0-9.-]/g, '');
      return parseFloat(cleanValue) || null;
    }
    return value;
  } catch {
    return null;
  }
}

// Calculate risk level based on available metrics (debt/equity, volatility indicators)
function calculateRiskLevel(stock: Stock): 'low' | 'medium' | 'high' {
  const debtEquity = getRatioValue(stock, 'Debt / Equity Ratio', 'Current');
  const currentRatio = getRatioValue(stock, 'Current Ratio', 'Current');
  const roe = getRatioValue(stock, 'Return on Equity (ROE)', 'Current');
  
  // Low risk: Strong liquidity, low debt, consistent returns
  if (debtEquity !== null && debtEquity < 0.5 && currentRatio !== null && currentRatio > 2) {
    return 'low';
  }
  
  // High risk: High debt or poor liquidity
  if ((debtEquity !== null && debtEquity > 1.5) || (currentRatio !== null && currentRatio < 1)) {
    return 'high';
  }
  
  // Medium risk: Everything else
  return 'medium';
}

// Filter stocks based on criteria
function filterStocks(stocks: Stock[], criteria: FilterCriteria): Stock[] {
  return stocks.filter(stock => {
    const marketCap = parseMarketCap(stock.marketCap);
    const peRatio = stock.peRatio;
    const pbRatio = getRatioValue(stock, 'PB Ratio', 'Current');
    const roe = getRatioValue(stock, 'Return on Equity (ROE)', 'Current');
    const roa = getRatioValue(stock, 'Return on Assets (ROA)', 'Current');
    const dividendYield = getRatioValue(stock, 'Dividend Yield', 'Current');
    const debtEquity = getRatioValue(stock, 'Debt / Equity Ratio', 'Current');
    const currentRatio = getRatioValue(stock, 'Current Ratio', 'Current');
    const quickRatio = getRatioValue(stock, 'Quick Ratio', 'Current');
    const riskLevel = calculateRiskLevel(stock);

    if (criteria.marketCapMin && marketCap < criteria.marketCapMin) return false;
    if (criteria.marketCapMax && marketCap > criteria.marketCapMax) return false;
    if (criteria.peRatioMin && (!peRatio || peRatio < criteria.peRatioMin)) return false;
    if (criteria.peRatioMax && (!peRatio || peRatio > criteria.peRatioMax)) return false;
    if (criteria.pbRatioMin && (!pbRatio || pbRatio < criteria.pbRatioMin)) return false;
    if (criteria.pbRatioMax && (!pbRatio || pbRatio > criteria.pbRatioMax)) return false;
    if (criteria.roeMin && (!roe || roe < criteria.roeMin)) return false;
    if (criteria.roeMax && (!roe || roe > criteria.roeMax)) return false;
    if (criteria.roaMin && (!roa || roa < criteria.roaMin)) return false;
    if (criteria.roaMax && (!roa || roa > criteria.roaMax)) return false;
    if (criteria.dividendYieldMin && (!dividendYield || dividendYield < criteria.dividendYieldMin)) return false;
    if (criteria.dividendYieldMax && (!dividendYield || dividendYield > criteria.dividendYieldMax)) return false;
    // Beta filters removed since Beta data is not available in scraped data
    if (criteria.debtEquityMin && (!debtEquity || debtEquity < criteria.debtEquityMin)) return false;
    if (criteria.debtEquityMax && (!debtEquity || debtEquity > criteria.debtEquityMax)) return false;
    if (criteria.currentRatioMin && (!currentRatio || currentRatio < criteria.currentRatioMin)) return false;
    if (criteria.currentRatioMax && (!currentRatio || currentRatio > criteria.currentRatioMax)) return false;
    if (criteria.quickRatioMin && (!quickRatio || quickRatio < criteria.quickRatioMin)) return false;
    if (criteria.quickRatioMax && (!quickRatio || quickRatio > criteria.quickRatioMax)) return false;
    if (criteria.riskLevel && riskLevel !== criteria.riskLevel) return false;

    return true;
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all stocks
  app.get('/api/stocks', (req, res) => {
    res.json(stocksData);
  });

  // Get single stock by symbol
  app.get('/api/stocks/:symbol', (req, res) => {
    const stock = stocksData.find(s => s.symbol === req.params.symbol);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(stock);
  });

  // Filter stocks
  app.post('/api/stocks/filter', (req, res) => {
    try {
      const criteria = filterCriteriaSchema.parse(req.body);
      const filtered = filterStocks(stocksData, criteria);
      res.json(filtered);
    } catch (error) {
      res.status(400).json({ message: 'Invalid filter criteria', error });
    }
  });

  // Get top gainers
  app.get('/api/stocks/top/gainers', (req, res) => {
    const gainers = stocksData
      .filter(s => s.changePercent && s.changePercent > 0)
      .sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0))
      .slice(0, 10);
    res.json(gainers);
  });

  // Get most active stocks
  app.get('/api/stocks/top/active', (req, res) => {
    const active = stocksData
      .filter(s => s.volume)
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 10);
    res.json(active);
  });

  // Calculate CAPM expected return
  app.post('/api/capm/calculate', (req, res) => {
    try {
      const { riskFreeRate, marketReturn, beta } = capmInputSchema.parse(req.body);
      const expectedReturn = riskFreeRate + beta * (marketReturn - riskFreeRate);
      res.json({ expectedReturn });
    } catch (error) {
      res.status(400).json({ message: 'Invalid CAPM input', error });
    }
  });

  // Get risk presets
  app.get('/api/presets/:level', (req, res) => {
    const level = req.params.level;
    let preset: FilterCriteria = {};

    switch (level) {
      case 'low':
        preset = {
          debtEquityMax: 0.5,
          currentRatioMin: 2,
          quickRatioMin: 1.5,
          riskLevel: 'low',
        };
        break;
      case 'medium':
        preset = {
          debtEquityMax: 1.5,
          currentRatioMin: 1,
          riskLevel: 'medium',
        };
        break;
      case 'high':
        preset = {
          riskLevel: 'high',
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid risk level' });
    }

    res.json(preset);
  });

  // Serve course documents via a proxy endpoint so external viewers can load them without exposing query tokens.
  const courseDocs: Record<string, string> = {
    'income-investing': 'https://cdn.builder.io/o/assets%2Fca35db826797471cb8e33731c10b3ab1%2Ff6d7cfe0397347a9bf821fbeef4f4b24?alt=media&token=93be7fdc-bf13-463b-ac99-768362003904&apiKey=ca35db826797471cb8e33731c10b3ab1',
    'stock-investing': 'https://cdn.builder.io/o/assets%2Fca35db826797471cb8e33731c10b3ab1%2Fe1a5761f9fa44ab98787183eee34c065?alt=media&token=b590b695-6e58-43f1-819f-418f97bf3f45&apiKey=ca35db826797471cb8e33731c10b3ab1',
    'stock-trading': 'https://cdn.builder.io/o/assets%2Fca35db826797471cb8e33731c10b3ab1%2F6334288fbb4b4667af07062ece679ac5?alt=media&token=7cea295c-ca95-4e20-b87a-55f3b9acffaf&apiKey=ca35db826797471cb8e33731c10b3ab1',
  };

  app.get('/courses/doc/:id', async (req, res) => {
    const id = req.params.id;
    const url = courseDocs[id];
    if (!url) return res.status(404).json({ message: 'Document not found' });

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(502).json({ message: 'Failed to fetch upstream document' });
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');

      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err) {
      console.error('Error proxying document:', err);
      res.status(500).json({ message: 'Error fetching document' });
    }
  });

  // Convert DOCX to HTML server-side and serve as HTML
  app.get('/courses/html/:id', async (req, res) => {
    console.log('Received request for /courses/html/' + req.params.id + ' from', req.ip);
    const id = req.params.id;
    const url = courseDocs[id];
    if (!url) return res.status(404).send('Document not found');

    try {
      const response = await fetch(url);
      if (!response.ok) return res.status(502).send('Failed to fetch upstream document');

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('Converting DOCX to HTML (images will be skipped for performance)...');
      const result = await mammoth.convertToHtml({ buffer }, {
        convertImage: mammoth.images.inline(function() {
          // Return an empty image src to avoid embedding large base64 images
          return Promise.resolve({ src: '' });
        })
      });

      let html = result.value || '<p>No content</p>';
      // Small cleanup: limit size by truncating very long HTML (safety)
      const maxLen = 200000; // 200KB
      if (html.length > maxLen) {
        html = html.slice(0, maxLen) + '<p class="text-muted-foreground">(Document trimmed for performance)</p>';
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(html);
    } catch (err) {
      console.error('Error converting document to HTML:', err);
      res.status(500).send('Error converting document');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
