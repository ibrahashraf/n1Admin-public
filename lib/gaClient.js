import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(process.cwd(), './credentials/ga-service-account.json'),
});

export default analyticsDataClient;
