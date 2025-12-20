import axios from 'axios';
import { config } from '../config/env';

/**
 * External Bills API Service
 * Integrates with ProPublica Congress API and OpenStates API
 */

interface ProPublicaBill {
  bill_id: string;
  title: string;
  short_title: string;
  sponsor_name: string;
  introduced_date: string;
  latest_major_action_date: string;
  latest_major_action: string;
  summary?: string;
  congressdotgov_url?: string;
}

interface OpenStatesBill {
  id: string;
  identifier: string;
  title: string;
  classification: string[];
  subject: string[];
  abstracts: Array<{ abstract: string }>;
  created_at: string;
  updated_at: string;
  first_action_date: string;
  latest_action_date: string;
  latest_action_description: string;
}

export class BillsApiService {
  private proPublicaBaseUrl = 'https://api.propublica.org/congress/v1';
  private openStatesBaseUrl = 'https://v3.openstates.org';

  /**
   * Fetch recent bills from ProPublica Congress API
   * @param chamber - 'house' or 'senate'
   * @param congress - Congress number (e.g., 118 for 2023-2024)
   */
  async fetchFederalBills(chamber: 'house' | 'senate' = 'house', congress: number = 118) {
    if (!config.proPublicaApiKey) {
      console.warn('ProPublica API key not configured');
      return [];
    }

    try {
      const response = await axios.get(
        `${this.proPublicaBaseUrl}/${congress}/${chamber}/bills/introduced.json`,
        {
          headers: {
            'X-API-Key': config.proPublicaApiKey,
          },
        }
      );

      const bills: ProPublicaBill[] = response.data.results?.[0]?.bills || [];
      return bills.map(this.transformProPublicaBill);
    } catch (error) {
      console.error('Error fetching federal bills:', error);
      return [];
    }
  }

  /**
   * Fetch state bills from OpenStates API
   * @param state - Two-letter state code (e.g., 'CA', 'NY')
   */
  async fetchStateBills(state: string) {
    if (!config.openStatesApiKey) {
      console.warn('OpenStates API key not configured');
      return [];
    }

    try {
      const response = await axios.get(
        `${this.openStatesBaseUrl}/bills`,
        {
          params: {
            jurisdiction: state.toLowerCase(),
            sort: 'updated_desc',
            per_page: 20,
          },
          headers: {
            'X-API-Key': config.openStatesApiKey,
          },
        }
      );

      const bills: OpenStatesBill[] = response.data.results || [];
      return bills.map((bill) => this.transformOpenStatesBill(bill, state));
    } catch (error) {
      console.error('Error fetching state bills:', error);
      return [];
    }
  }

  /**
   * Transform ProPublica bill to our internal format
   */
  private transformProPublicaBill(bill: ProPublicaBill) {
    return {
      externalId: bill.bill_id,
      title: bill.short_title || bill.title,
      summary: bill.summary || bill.title,
      status: bill.latest_major_action || 'Introduced',
      introducedDate: bill.introduced_date,
      lastActionDate: bill.latest_major_action_date,
      sponsor: bill.sponsor_name,
      level: 'federal',
      state: null,
      chamber: bill.bill_id.toLowerCase().includes('s.') ? 'senate' : 'house',
      billNumber: bill.bill_id,
      fullTextUrl: bill.congressdotgov_url,
    };
  }

  /**
   * Transform OpenStates bill to our internal format
   */
  private transformOpenStatesBill(bill: OpenStatesBill, state: string) {
    return {
      externalId: bill.id,
      title: bill.title,
      summary: bill.abstracts?.[0]?.abstract || bill.title,
      status: bill.latest_action_description || 'Introduced',
      introducedDate: bill.first_action_date,
      lastActionDate: bill.latest_action_date,
      sponsor: 'State Representative', // OpenStates requires additional API call for sponsor details
      level: 'state',
      state: state.toUpperCase(),
      chamber: bill.classification.includes('bill') ? 'house' : 'senate',
      billNumber: bill.identifier,
      fullTextUrl: null,
    };
  }
}

export default new BillsApiService();
