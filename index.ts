import { polling } from './polling';

let count = 0;

interface MockRequestResponse {
  status: string;
  count: number;
}

const mockRequest = (): Promise<MockRequestResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (count < 6) {
        resolve({
          status: 'pending',
          count
        });
      } else {
        resolve({
          status: 'finish',
          count
        });
      }
      count++;
    }, 100);
  });
};

polling<MockRequestResponse, number>({
  try: mockRequest,
  tryRequest: count,
  retryUntil: res => {
    console.log(new Date().toLocaleString(), res);
    return res.status === 'finish';
  },
  tick: 1000
}).subscribe(response => {
  console.log('轮询结束: ', response);
}, (err: Error) => {
  console.log(err.message);
});
