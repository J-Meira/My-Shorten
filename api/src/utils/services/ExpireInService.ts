import moment from 'moment';

const get = (
  hours:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24,
) => {
  const now = moment();
  return now.add(hours, 'hours').toJSON();
};

export const ExpireInService = {
  get,
};
