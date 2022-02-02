import { Injectable } from '@nestjs/common';
import axios from 'axios';
const moment = require('moment');
const Web3 = require('web3');
const web3 = new Web3(
  'https://mainnet.infura.io/v3/1bd40ac2693f48159476e5b426280f6a',
);

@Injectable()
export class AppService {
  getCount(transactions) {
    const uniqueIds = [];
    const unique = transactions
      .filter((element) => {
        const isDuplicate = uniqueIds.includes(element.from);
        if (!isDuplicate) {
          uniqueIds.push(element.from);
          return true;
        }
      })
      .map((element) => {
        return {
          from: element.from,
          timeStamp: moment.unix(element.timeStamp).format('MM-YY'),
          timeStamp2: element.timeStamp,
        };
      });
    return unique;
  }

  async callApi(lastPageNumber: number, address: string) {
    try {
      const endBlock = await web3.eth.getBlockNumber();
      let list = [{ page: 1, offset: 1000 }];
      let request = await Promise.all(
        [...Array(lastPageNumber).keys()].map((page, index) => {
          return axios.get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=${endBlock}&page=${
              page + 1
            }&offset=${
              index < 10 ? 1000 : 1000 - (index - 9) * 100
            }&sort=asc&apikey=3SAJ8EXQMXKXDFZPW14S2XVFKPIGZ6JMW2`,
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
      let [transactions, lastPageNumber] = [[], 2];
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
  getNoOfUsersByMonth(fetchTransactions) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let currentMonth, currentYear;
    let [usersByMonth, storedIndex, counter] = [[], 0, 0];

    for (let i = 0; i < fetchTransactions.length; i++) {
      currentYear = fetchTransactions[i].timeStamp.slice(3, 5);
      currentMonth = fetchTransactions[i].timeStamp.slice(0, 2);
      if (i == 0) {
        counter++;
        usersByMonth[i] = {
          [`${months[+currentMonth - 1]}-${currentYear}`]: `No of users in ${
            months[+currentMonth - 1]
          } and year ${currentYear} with count ${counter} `,
        };
      } else if (
        currentYear == fetchTransactions[i - 1].timeStamp.slice(3, 5) &&
        currentMonth == fetchTransactions[i - 1].timeStamp.slice(0, 2)
      ) {
        counter++;
        usersByMonth[storedIndex] = {
          [`${months[+currentMonth - 1]}-${currentYear}`]: `No of users in ${
            months[+currentMonth - 1]
          } and year ${currentYear} with count ${counter} `,
        };
      } else {
        counter = 1;
        storedIndex = storedIndex + 1;
        usersByMonth[storedIndex] = {
          [`${months[+currentMonth - 1]}-${currentYear}`]: `No of users in ${
            months[+currentMonth - 1]
          } and year ${currentYear} with count ${counter} `,
        };
      }
    }

    return usersByMonth;
  }
  async getUsers() {
    try {
      const address = '0x6b175474e89094c44da98b954eedeac495271d0f';
      const fetchTransactions = await this.fetchTransactions(address);
      const usersByMonth = this.getNoOfUsersByMonth(fetchTransactions);
      return {
        signal: 'okay',
        usersByMonth,
        totalUsers: fetchTransactions.length,
      };
    } catch (error) {
      return error;
    }
  }
}
