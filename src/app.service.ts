import { Injectable } from '@nestjs/common';
import axios from 'axios';
interface List {
  address: string;
  page: number;
  offset: number;
}
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getCount(transactions) {
    let mymap = new Map();
    let unique = Array.from(
      new Set(transactions.map((item: any) => item.from)),
    );
    console.log(unique.length, '===>length');

    return unique.length;
  }
  async callApi(list: List[]) {
    try {
      let request = await Promise.all(
        list.map((value) => {
          return axios.get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${value.address}&startblock=0&endblock=14118458&page=${value.page}&offset=${value.offset}&sort=asc&apikey=3SAJ8EXQMXKXDFZPW14S2XVFKPIGZ6JMW2`,
          );
        }),
      );
      return request;
    } catch (error) {
      return error;
    }
  }
  async fetchTransactions(address: string) {
    try {
      const list = [
        {
          address,
          page: 1,
          offset: 1000,
        },
        {
          address,
          page: 2,
          offset: 1000,
        },
        {
          address,
          page: 3,
          offset: 1000,
        },
        {
          address,
          page: 4,
          offset: 1000,
        },
        {
          address,
          page: 5,
          offset: 1000,
        },
        {
          address,
          page: 6,
          offset: 1000,
        },
        {
          address,
          page: 7,
          offset: 1000,
        },
        {
          address,
          page: 8,
          offset: 1000,
        },
        {
          address,
          page: 9,
          offset: 1000,
        },
        {
          address,
          page: 11,
          offset: 900,
        },
        {
          address,
          page: 12,
          offset: 800,
        },
        {
          address,
          page: 13,
          offset: 700,
        },
        {
          address,
          page: 14,
          offset: 700,
        },
        {
          address,
          page: 15,
          offset: 600,
        },
      ];
      // l
      let transactions = [];
      let result = [];
      const request = await this.callApi(list);
      transactions = request
        .map((value) => {
          if (value.data.status == 1) {
            result = [...transactions, ...value.data.result];
          }
          return result;
        })
        .flat();
      const getCount = this.getCount(transactions);
      return getCount;
    } catch (error) {
      return error;
    }
  }

  async getUsers() {
    try {
      const address = '0x6b175474e89094c44da98b954eedeac495271d0f';
      const fetchTransactions = await this.fetchTransactions(address);
      return {
        signal: 'okay',
        data: fetchTransactions,
      };
    } catch (error) {
      return error;
    }
  }
}
