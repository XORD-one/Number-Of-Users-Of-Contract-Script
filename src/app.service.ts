import { Injectable } from '@nestjs/common';
import axios from 'axios';
const Web3 = require('web3');
const web3 = new Web3(
  'https://mainnet.infura.io/v3/1bd40ac2693f48159476e5b426280f6a',
);
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
      const endBlock = await web3.eth.getBlockNumber();

      let request = await Promise.all(
        list.map((value) => {
          return axios.get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${value.address}&startblock=0&endblock=${endBlock}&page=${value.page}&offset=${value.offset}&sort=asc&apikey=3SAJ8EXQMXKXDFZPW14S2XVFKPIGZ6JMW2`,
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
        {
          address,
          page: 16,
          offset: 600,
        },
        {
          address,
          page: 17,
          offset: 550,
        },
        {
          address,
          page: 18,
          offset: 500,
        },
        {
          address,
          page: 19,
          offset: 450,
        },
      ];

      let transactions = [];

      const request = await this.callApi(list);

      for (let i = 0; i < request.length; i++) {
        if (request[i].data.status == 1) {
          transactions = [...transactions, ...request[i].data.result];
        }
      }
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
