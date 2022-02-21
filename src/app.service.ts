import { Injectable } from '@nestjs/common';
import axios from 'axios';
const moment = require('moment');
const Web3 = require('web3');
const web3 = new Web3(
  'https://mainnet.infura.io/v3/1bd40ac2693f48159476e5b426280f6a',
);

@Injectable()
export class AppService {
  getTransactionByTimeStamp(transactions) {
    const uniqueIds = [];
    const unique = transactions.map((element) => {
      return {
        from: element.from,
        month: moment.unix(element.timeStamp).format('MM'),
        year: moment.unix(element.timeStamp).format('YY'),
      };
    });
    return unique;
  }

  async callApi(lastPageNumber: number, address: string) {
    try {
      const endBlock = await web3.eth.getBlockNumber();
      let request = await Promise.all(
        [...Array(lastPageNumber).keys()].map((page, index) => {
          return axios.get(
            `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=11265058
&endblock=${endBlock}&page=${page + 1}&offset=${
              index < 10 ? 1000 : 1000 - (index - 9) * 100
            }&sort=asc&apikey=7QC1AKJ3E3BFV214YAGHF2YEPWIEYSYA2W`,
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
      let [transactions, lastPageNumber] = [[], 3];
      console.log(lastPageNumber, 'lastPageNumber');
      const request = await this.callApi(lastPageNumber, address);
      for (let i = 0; i < request.length; i++) {
        if (request[i].data.status == 1) {
          transactions = [...transactions, ...request[i].data.result];
        }
      }
      const getTransactionByTimeStamp =
        this.getTransactionByTimeStamp(transactions);
      return getTransactionByTimeStamp;
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
    // console.log(fetchTransactions, 'fetched');
    let [usersByMonth, storedIndex, counter] = [[], 0, 0];
    let usersByEachMonth = [];
    let uniqueIds = [];
    for (let i = 0; i < fetchTransactions.length; i++) {
      currentYear = fetchTransactions[i].year;
      currentMonth = fetchTransactions[i].month;
      console.log(currentMonth, 'currentMonth', currentYear);
      if (i == 0) {
        usersByEachMonth = [...usersByEachMonth, fetchTransactions[i].from];
        usersByMonth[storedIndex] = {
          [`${months[+currentMonth - 1]}-${currentYear}`]:
            usersByEachMonth.length,
        };
      } else if (
        currentYear == fetchTransactions[i - 1].year &&
        currentMonth == fetchTransactions[i - 1].month
      ) {
        usersByEachMonth = [...usersByEachMonth, fetchTransactions[i].from];
        usersByEachMonth = [...new Set(usersByEachMonth)];

        console.log(usersByEachMonth.length, 'filter');
        usersByMonth[storedIndex] = {
          [`${months[+currentMonth - 1]}-${currentYear}`]:
            usersByEachMonth.length,
        };
      } else {
        storedIndex = storedIndex + 1;
        usersByEachMonth = [fetchTransactions[i].from];
        usersByEachMonth = [...new Set(usersByEachMonth)];

        usersByMonth[storedIndex] = {
          [`${months[+currentMonth - 1]}-${currentYear}`]:
            usersByEachMonth.length,
        };
      }
    }

    return usersByMonth;
  }
  async getUsers() {
    try {
      const address = '0xFcf76D183D7AB3E979505D31CdA1315F68100317';
      const fetchTransactions = await this.fetchTransactions(address);
      const usersByMonth = this.getNoOfUsersByMonth(fetchTransactions);

      return {
        signal: 'okay',
        // unique,
        usersByMonth,
        totalUsers: fetchTransactions.length,
      };
    } catch (error) {
      return error;
    }
  }
}
//  const address = '0x66663724b50f4EA40e5ceD7Fc5181fE1816cE0C4'; lp stacking
// "0xf48E0D934B505C80b6dD3ef4d178D7c8fB83f566"
//  api key fpr eth 3SAJ8EXQMXKXDFZPW14S2XVFKPIGZ6JMW2
// api key for bsc 7QC1AKJ3E3BFV214YAGHF2YEPWIEYSYA2W
