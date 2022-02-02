import { Injectable } from '@nestjs/common';
import axios from 'axios';
const Web3 = require('web3');
const web3 = new Web3(
  'https://mainnet.infura.io/v3/1bd40ac2693f48159476e5b426280f6a',
);

@Injectable()
export class AppService {
  getCount(transactions) {
    let unique = Array.from(
      new Set(transactions.map((item: any) => item.from)),
    );
    return unique.length;
  }

  async callApi(lastPageNumber: number, address: string) {
    try {
      const endBlock = await web3.eth.getBlockNumber();
      let [list, maxResponseLimit] = [[], 8000];
      for (let i = lastPageNumber; i >= 1; i--) {
        list = [...list, { page: i, offset: Math.floor(maxResponseLimit / i) }];
      }
      let request = await Promise.all(
        list.map((value) => {
          return axios.get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=${endBlock}&page=${value.page}&offset=${value.offset}&sort=asc&apikey=3SAJ8EXQMXKXDFZPW14S2XVFKPIGZ6JMW2`,
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
      let [transactions, lastPageNumber] = [[], 20];
      const request = await this.callApi(lastPageNumber, address);
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
        users: fetchTransactions,
      };
    } catch (error) {
      return error;
    }
  }
}
